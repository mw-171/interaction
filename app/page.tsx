"use client";

import { useEffect, useState } from "react";
import { ActivityRow, ActivityRowSkeleton, type ActivityRowProps } from "./components/activity-row";

function UtensilsIcon() {
  return (
    <svg
      className="size-[16px]"
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4V10.1716C5 10.702 5.21071 11.2107 5.58579 11.5858L5.91421 11.9142C6.28929 12.2893 6.5 12.798 6.5 13.3284V18.5C6.5 19.3284 7.17157 20 8 20C8.82843 20 9.5 19.3284 9.5 18.5V13.3284C9.5 12.798 9.71071 12.2893 10.0858 11.9142L10.4142 11.5858C10.7893 11.2107 11 10.702 11 10.1716V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4V9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 18.5V4C18.105 4 14.9094 6.46963 14.0177 12.9027C13.8605 14.037 14.7698 15 15.8997 15H16.0409V18.5C16.0409 19.3284 16.7033 20 17.5204 20C18.3376 20 19 19.3284 19 18.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DUMMY_ITEMS: Omit<ActivityRowProps, "onRevert">[] = [
  {
    icon: <UtensilsIcon />,
    iconColor: "text-green-500",
    actor: "you",
    action: "added Design Interview Guide",
    timestamp: "2026-06-03T19:54:47.327Z",
    description: "Information for applicants for Interaction's design roles",
    details: [
      {
        id: "1",
        content:
          "the user is applying for a design or design engineering role at the interaction company of california (creators of poke). here's the information they …",
        type: "Instructions",
        typeColor: "green",
      },
    ],
  },
  {
    icon: <UtensilsIcon />,
    iconColor: "text-blue-500",
    actor: "you",
    action: "updated Onboarding Checklist",
    timestamp: "2026-06-02T10:00:00.000Z",
    description: "Steps for new hires joining the design team",
  },
  {
    icon: <UtensilsIcon />,
    iconColor: "text-purple-500",
    actor: "you",
    action: "removed Deprecated Role Brief",
    timestamp: "2026-06-01T08:20:00.000Z",
    isLast: true,
  },
];

const SKELETON_COUNT = 3;

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
                onRevert={() => console.log("revert", i)}
              />
            ))}
      </div>
    </main>
  );
}
