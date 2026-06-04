"use client";

import { useEffect, useState } from "react";
import { ActivityRow, ActivityRowSkeleton } from "./components/activity-row";
import { DUMMY_ITEMS } from "./data/dummy";

const SKELETON_COUNT = 6;

export default function Home() {
  const [items, setItems] = useState<typeof DUMMY_ITEMS | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setItems(DUMMY_ITEMS), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Activity
      </h1>
      <div>
        {items === null
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ActivityRowSkeleton key={i} isLast={i === SKELETON_COUNT - 1} />
            ))
          : items.map((item, i) => (
              <ActivityRow
                key={i}
                {...item}
                onRevert={
                  item.action.startsWith("re-verified")
                    ? undefined
                    : () => console.log("revert", i)
                }
              />
            ))}
      </div>
    </main>
  );
}

