"use client";

import { useEffect, useState } from "react";
import { ActivityRow, ActivityRowSkeleton } from "./components/activity-row";
import type { ActivityRowProps } from "./components/activity-row";
import { DUMMY_ITEMS } from "./data/dummy";

type Item = Omit<ActivityRowProps, "onRevert"> & { _id: string };

const SKELETON_COUNT = 3;
const REVERT_DELAY_MS = 1200;
const AFTER_MODAL_CLOSE_MS = 300; // modal transition (200ms) + small buffer

export default function Home() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [revertedIds, setRevertedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(
      () => setItems(DUMMY_ITEMS.map((item, i) => ({ ...item, _id: `item-${i}` }))),
      1500
    );
    return () => clearTimeout(timer);
  }, []);

  function handleRevert(item: Item): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mark as reverted and resolve so the modal starts closing
        setRevertedIds((prev) => new Set([...prev, item._id]));
        resolve();

        // Add the new timeline entry after the modal finishes closing
        setTimeout(() => {
          const revertedEntry: Item = {
            _id: `reverted-${item._id}-${Date.now()}`,
            icon: item.icon,
            iconColor: item.iconColor,
            actor: item.actor,
            action: "was reverted",
            timestamp: new Date().toISOString(),
            description: item.description,
            details: item.details?.map((d) => ({ ...d, id: `${d.id}-rev` })),
          };
          setItems((prev) => (prev ? [revertedEntry, ...prev] : [revertedEntry]));
        }, AFTER_MODAL_CLOSE_MS);
      }, REVERT_DELAY_MS);
    });
  }

  function getOnRevert(item: Item) {
    if (
      item.action === "was reverted" ||
      item.action.startsWith("re-verified") ||
      revertedIds.has(item._id)
    ) {
      return undefined;
    }
    return () => handleRevert(item);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Activity
      </h1>
      <div>
        {items === null
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ActivityRowSkeleton
                key={i}
                isLast={i === SKELETON_COUNT - 1}
                variant={i}
              />
            ))
          : items.map((item, i) => (
              <div
                key={item._id}
                className="animate-fade-in motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <ActivityRow
                  {...item}
                  isLast={i === items.length - 1}
                  onRevert={getOnRevert(item)}
                />
              </div>
            ))}
      </div>
    </main>
  );
}
