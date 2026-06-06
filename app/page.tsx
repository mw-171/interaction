"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityRow, ActivityRowSkeleton } from "./components/activity-row";
import type { ActivityRowProps } from "./components/activity-row";
import SearchBar from "./components/search-bar";
import ScrollFade from "./components/scroll-fade";
import { DUMMY_ITEMS } from "./data/dummy";

type BaseItem = Omit<ActivityRowProps, "onRevert" | "onRestore">;
type Item = BaseItem & { _id: string; original?: BaseItem };

const SKELETON_COUNT = 8;
const REVERT_DELAY_MS = 1200;
const AFTER_MODAL_CLOSE_MS = 300; // modal transition (200ms) + small buffer
const SEARCH_DEBOUNCE_MS = 250;
const ENTER_MS = 300; // entrance transition for a freshly added timeline entry

function stripRuntime(item: Item): BaseItem {
  const { _id, original, ...rest } = item;
  void _id;
  void original;
  return rest;
}

// How an integration's access reads ("Notion workspace access"). Integrations
// supply their own phrasing; integrations that only appear as a recipe
// dependency with no standalone row (e.g. Browserbase) fall back to a generic
// phrase.
function accessLabelFor(
  integrationActor: string,
  allItems: BaseItem[],
): string {
  const integration = allItems.find(
    (o) => o.kind === "integration" && o.actor === integrationActor,
  );
  return integration?.accessLabel ?? `${integrationActor} access`;
}

// "What's stopping" — the capabilities you lose. A recipe loses its features; an
// integration loses Poke's access to it.
function computeStops(item: BaseItem, allItems: BaseItem[]): string[] {
  if (item.kind === "integration")
    return [accessLabelFor(item.actor, allItems)];
  return item.stops ?? [];
}

// "What won't change" — derived from the recipe↔integration graph so it's clear
// what's shared. Reverting a recipe keeps the integration access it relied on;
// reverting an integration keeps the recipes still using it. Empty when there's
// no relationship, so the modal hides the section.
function computeStays(item: BaseItem, allItems: BaseItem[]): string[] {
  if (item.kind === "recipe") {
    return (item.details ?? []).map((d) => accessLabelFor(d.label, allItems));
  }
  if (item.kind === "integration") {
    return allItems
      .filter(
        (other) =>
          other.kind === "recipe" &&
          other.details?.some((d) => d.label === item.actor),
      )
      .map((recipe) => `${item.actor} access for ${recipe.actor} recipe`);
  }
  return [];
}

// Module-level so the unique id / timestamp helpers stay out of render purity checks.
let entryCounter = 0;
function makeEntryId(prefix: string): string {
  entryCounter += 1;
  return `${prefix}-${Date.now()}-${entryCounter}`;
}
function nowIso(): string {
  return new Date().toISOString();
}

function scrollToTop(): void {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export default function Home() {
  const [items, setItems] = useState<Item[] | null>(null);
  // Entries whose action has already been taken — they no longer show a menu.
  const [revertedIds, setRevertedIds] = useState<Set<string>>(new Set());
  const [restoredIds, setRestoredIds] = useState<Set<string>>(new Set());
  // Entrance animation phase for newly added entries: "enter" = painted
  // collapsed, "open" = transitioning to full height. Absent = settled.
  const [entering, setEntering] = useState<Record<string, "enter" | "open">>(
    {},
  );

  // Slide a freshly added entry in: render it collapsed, flip to open on the
  // next frame so the height/opacity transition runs, then drop it from the map
  // once the transition is done (so it's no longer wrapped in an overflow clip).
  function animateIn(id: string) {
    setEntering((m) => ({ ...m, [id]: "enter" }));
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setEntering((m) => (id in m ? { ...m, [id]: "open" } : m)),
      ),
    );
    window.setTimeout(() => {
      setEntering((m) => {
        if (!(id in m)) return m;
        const next = { ...m };
        delete next[id];
        return next;
      });
    }, ENTER_MS + 60);
  }

  // Search state: `query` updates on every keystroke, `debouncedQuery` is what
  // we actually filter by. While they differ we show skeletons, mirroring the
  // initial fetch animation.
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () =>
        setItems(DUMMY_ITEMS.map((item, i) => ({ ...item, _id: `item-${i}` }))),
      1500,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const filteredItems = useMemo(() => {
    if (!items) return null;
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      if (item.actor.toLowerCase().includes(q)) return true;
      return item.details?.some((d) => d.label.toLowerCase().includes(q));
    });
  }, [items, debouncedQuery]);

  // True while the user is typing — we haven't applied the latest query yet.
  const searching = query !== debouncedQuery;
  // Show skeletons during initial fetch AND while debouncing a new query.
  const showSkeletons = items === null || searching;

  function handleRevert(item: Item): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mark as reverted and resolve so the modal starts closing
        setRevertedIds((prev) => new Set([...prev, item._id]));
        resolve();

        // Add the new timeline entry after the modal finishes closing.
        // A reverted integration disconnects it (show the chip); a reverted
        // recipe removes nothing, so it carries no details.
        setTimeout(() => {
          const isIntegration = item.kind === "integration";
          const revertedEntry: Item = {
            _id: makeEntryId(`reverted-${item._id}`),
            icon: item.icon,
            iconColor: item.iconColor,
            actor: item.actor,
            kind: item.kind,
            recipeSlug: item.recipeSlug,
            action: "was reverted",
            timestamp: nowIso(),
            description: item.description,
            details: isIntegration
              ? item.details?.map((d) => ({ ...d, id: `${d.id}-rev` }))
              : undefined,
            original: stripRuntime(item),
          };
          setItems((prev) =>
            prev ? [revertedEntry, ...prev] : [revertedEntry],
          );
          animateIn(revertedEntry._id);
          scrollToTop();
        }, AFTER_MODAL_CLOSE_MS);
      }, REVERT_DELAY_MS);
    });
  }

  // Undo a revert: add the original back as a fresh entry that can be reverted again.
  function handleRestore(item: Item) {
    if (!item.original) return;
    setRestoredIds((prev) => new Set([...prev, item._id]));
    const restoredEntry: Item = {
      ...item.original,
      _id: makeEntryId(`restored-${item._id}`),
      timestamp: nowIso(),
    };
    setItems((prev) => (prev ? [restoredEntry, ...prev] : [restoredEntry]));
    animateIn(restoredEntry._id);
    scrollToTop();
  }

  function getHandlers(item: Item): {
    onRevert?: () => Promise<void>;
    onRestore?: () => void;
  } {
    if (item.action === "was reverted") {
      if (restoredIds.has(item._id) || !item.original) return {};
      return { onRestore: () => handleRestore(item) };
    }
    if (revertedIds.has(item._id)) return {};
    return { onRevert: () => handleRevert(item) };
  }

  const hasNoMatches =
    !showSkeletons &&
    filteredItems !== null &&
    filteredItems.length === 0 &&
    debouncedQuery.trim().length > 0;

  return (
    <>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Activity
          </h1>
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div>
          {showSkeletons ? (
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ActivityRowSkeleton
                key={i}
                isLast={i === SKELETON_COUNT - 1}
                variant={i}
              />
            ))
          ) : hasNoMatches ? (
            <p
              role="status"
              aria-live="polite"
              className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400"
            >
              No activity matches “{debouncedQuery}”.
            </p>
          ) : (
            filteredItems?.map((item, i) => {
              const q = debouncedQuery.trim().toLowerCase();
              const matchedIntegration =
                q.length > 0 &&
                !!item.details?.some((d) => d.label.toLowerCase().includes(q));

              const phase = entering[item._id];
              // Initial-load entries (ids "item-N") get the staggered fade;
              // dynamically added entries slide in via height/opacity instead.
              const isInitial = item._id.startsWith("item-");

              let outerClass = "";
              let outerStyle: React.CSSProperties | undefined;
              let innerClass = "";
              if (phase) {
                outerClass = `grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  phase === "open"
                    ? "[grid-template-rows:1fr] opacity-100"
                    : "[grid-template-rows:0fr] opacity-0"
                }`;
                innerClass = "min-h-0 overflow-hidden";
              } else if (isInitial) {
                outerClass = "animate-fade-in motion-reduce:animate-none";
                outerStyle = { animationDelay: `${Math.min(i, 8) * 50}ms` };
              }

              return (
                <div key={item._id} className={outerClass} style={outerStyle}>
                  <div className={innerClass}>
                    <ActivityRow
                      {...item}
                      stops={computeStops(item, items ?? [])}
                      stays={computeStays(item, items ?? [])}
                      isLast={i === filteredItems.length - 1}
                      forceExpanded={matchedIntegration}
                      {...getHandlers(item)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <ScrollFade />
    </>
  );
}
