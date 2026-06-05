"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, ChevronDown, MoreVertical, Undo2 } from "lucide-react";
import RevertModal from "./revert-modal";

const RELATIVE_DAY_LIMIT = 3;

function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > RELATIVE_DAY_LIMIT)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

const SKELETON_VARIANTS = [
  { text: "w-48", timestamp: "w-10", desc: "w-64" },
  { text: "w-56", timestamp: "w-12", desc: "w-44" },
  { text: "w-40", timestamp: "w-8", desc: "w-52" },
  { text: "w-52", timestamp: "w-10", desc: "w-56" },
];

export function ActivityRowSkeleton({
  isLast = false,
  variant = 0,
}: {
  isLast?: boolean;
  variant?: number;
}) {
  const v = SKELETON_VARIANTS[variant % SKELETON_VARIANTS.length];
  return (
    <div className="relative flex animate-pulse items-start gap-3 md:gap-4">
      {!isLast && (
        <div className="absolute top-6 left-[13px] h-full w-px bg-neutral-200 dark:bg-neutral-800" />
      )}
      <div className="relative z-10 mt-[-3px] size-[26px] shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="min-w-0 flex-1 pb-6">
        {/* Title row — height matches real row's text-[14px] leading-snug (~20px) */}
        <div className="flex h-5 items-center justify-between gap-3">
          <div
            className={`h-[14px] ${v.text} rounded-full bg-neutral-200 dark:bg-neutral-800`}
          />
          <div
            className={`h-3 ${v.timestamp} shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800`}
          />
        </div>
        {/* Description row — height matches real row's text-[13px] leading-relaxed (~21px) */}
        <div className="mt-1 flex h-[21px] items-center">
          <div
            className={`h-3 ${v.desc} rounded-full bg-neutral-200 dark:bg-neutral-800`}
          />
        </div>
      </div>
    </div>
  );
}

export type ActivityKind = "recipe" | "integration";

export interface ActivityDetail {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface ActivityRowProps {
  icon: React.ReactNode;
  iconColor?: string;
  actor: string;
  action: string;
  kind?: ActivityKind;
  recipeSlug?: string;
  recipeUrl?: string;
  timestamp: Date | string;
  description?: string;
  stops?: string[];
  onRevert?: () => Promise<void>;
  onRestore?: () => void;
  details?: ActivityDetail[];
  isLast?: boolean;
  reverting?: boolean;
  /**
   * When true, opens the details dropdown automatically. Used by search to
   * surface why a row matched when the match came from an integration name
   * rather than the title. Users can still close it manually.
   */
  forceExpanded?: boolean;
}

/**
 * Per-row actions menu (the vertical ellipsis). Holds the single "Undo" action,
 * which either opens the revert confirmation modal or restores a reverted item.
 */
function RowMenu({
  actor,
  label,
  onSelect,
  triggerRef,
}: {
  actor: string;
  label: string;
  onSelect: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    itemRef.current?.focus();

    const onDocPointer = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, triggerRef]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More actions for ${actor}`}
        onClick={() => setOpen((v) => !v)}
        style={{ WebkitTapHighlightColor: "transparent" }}
        className={`flex size-6 touch-manipulation items-center justify-center rounded-md transition-colors duration-150 ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
          open
            ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        }`}
      >
        <MoreVertical className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={`Actions for ${actor}`}
          className="absolute right-0 top-8 z-20 origin-top-right rounded-xl border border-neutral-200 bg-[rgb(255,253,250)] p-1 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)] animate-pop-in motion-reduce:animate-none dark:border-neutral-800 dark:bg-[rgb(16,16,18)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <button
            ref={itemRef}
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              onSelect();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors duration-150 ease hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <Undo2 className="size-3.5 shrink-0" />
            {label}
          </button>
        </div>
      )}
    </div>
  );
}

export function ActivityRow({
  icon,
  iconColor = "text-neutral-400 dark:text-neutral-500",
  actor,
  action,
  kind,
  recipeSlug,
  recipeUrl,
  timestamp,
  description,
  stops,
  onRevert,
  onRestore,
  details,
  isLast = false,
  reverting = false,
  forceExpanded = false,
}: ActivityRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  // When the parent signals a match (e.g. search hit on an integration name),
  // open the dropdown so it's obvious what matched. The user can still
  // collapse it; we only auto-open on the transition into a forced state.
  useEffect(() => {
    if (!forceExpanded) return;
    const raf = requestAnimationFrame(() => setShowDetails(true));
    return () => cancelAnimationFrame(raf);
  }, [forceExpanded]);
  const [showModal, setShowModal] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isReverted = action === "was reverted";
  const isoString =
    typeof timestamp === "string" ? timestamp : timestamp.toISOString();
  const recipeHref =
    recipeUrl ??
    (recipeSlug ? `https://poke.com/recipes/${recipeSlug}` : undefined);

  // A recipe shows the integrations it connected; a reverted integration shows
  // the integrations it disconnected. Connected integrations and reverted
  // recipes show no dropdown — they don't add or remove anything to surface.
  const hasDetailsSection =
    !!details &&
    details.length > 0 &&
    (isReverted ? kind === "integration" : kind === "recipe");
  const detailCount = details?.length ?? 0;
  const detailVerb = isReverted ? "disconnected" : "connected";

  return (
    <div className="relative flex items-start gap-3 md:gap-4">
      {!isLast && (
        <div className="absolute top-6 left-[13px] h-full w-px bg-neutral-200 dark:bg-neutral-800" />
      )}

      {/* Icon */}
      <div
        className={`relative z-10 mt-[-3px] flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-950 ${isReverted ? "text-purple-500" : iconColor}`}
      >
        {isReverted ? <Undo2 size={16} /> : icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] leading-snug text-neutral-700 dark:text-neutral-300">
            {recipeHref ? (
              <a
                href={recipeHref}
                target="_blank"
                rel="noreferrer"
                translate="no"
                className="rounded-sm font-medium text-neutral-900 underline-offset-2 transition-colors duration-150 ease hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-100"
              >
                {actor}
              </a>
            ) : (
              <span
                translate="no"
                className="font-medium text-neutral-900 dark:text-neutral-100"
              >
                {actor}
              </span>
            )}{" "}
            {action}
          </p>

          {/* Fixed height keeps the date + menu centered on the title's first
              line, even when the title wraps to two lines. */}
          <div className="flex h-5 shrink-0 items-center gap-1">
            {reverting ? (
              <div className="flex items-center gap-1.5 text-[13px] text-neutral-400 dark:text-neutral-500">
                <div className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
                Undoing…
              </div>
            ) : (
              <>
                <time
                  dateTime={isoString}
                  className="text-[13px] leading-none tabular-nums text-neutral-400 dark:text-neutral-500"
                >
                  {formatRelativeTime(timestamp)}
                </time>
                {(onRevert || onRestore) && (
                  <RowMenu
                    actor={actor}
                    label={"Undo"}
                    onSelect={onRestore ? onRestore : () => setShowModal(true)}
                    triggerRef={menuButtonRef}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}

        {/* Details toggle */}
        {hasDetailsSection && details && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="flex items-center gap-1 text-[13px] text-neutral-400 transition-colors duration-150 ease hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none ${showDetails ? "rotate-180" : ""}`}
              />
              {detailCount} integration{detailCount === 1 ? "" : "s"}{" "}
              {detailVerb}
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                showDetails
                  ? "[grid-template-rows:1fr] opacity-100"
                  : "[grid-template-rows:0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {details.map((item) =>
                    item.href ? (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[13px] text-neutral-600 transition-colors duration-150 ease hover:bg-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800/70"
                      >
                        {item.icon && (
                          <span className="shrink-0">{item.icon}</span>
                        )}
                        {item.label}
                        <ArrowUpRight className="size-3 text-neutral-400 dark:text-neutral-500" />
                      </a>
                    ) : (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[13px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400"
                      >
                        {item.icon && (
                          <span className="shrink-0">{item.icon}</span>
                        )}
                        {item.label}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {onRevert && (
        <RevertModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            menuButtonRef.current?.focus();
          }}
          onConfirm={onRevert}
          actor={actor}
          kind={kind}
          details={details}
          description={description}
          stops={stops}
        />
      )}
    </div>
  );
}

