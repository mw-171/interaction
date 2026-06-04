"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function ActivityRowSkeleton({ isLast = false }: { isLast?: boolean }) {
  return (
    <div className="relative flex items-start gap-3 md:gap-4">
      {!isLast && (
        <div className="absolute top-6 left-[13px] h-full w-px bg-neutral-200 dark:bg-neutral-800" />
      )}
      <div className="relative z-10 mt-[-1px] flex size-[26px] shrink-0 animate-pulse items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="min-w-0 flex-1 pb-6">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-3.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="mt-2 flex animate-pulse gap-2">
          <div className="h-3 w-64 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

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
  timestamp: Date | string;
  description?: string;
  onRevert?: () => void;
  details?: ActivityDetail[];
  isLast?: boolean;
}

export function ActivityRow({
  icon,
  iconColor = "text-neutral-400 dark:text-neutral-500",
  actor,
  action,
  timestamp,
  description,
  onRevert,
  details,
  isLast = false,
}: ActivityRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  const hasDetails = details && details.length > 0;
  const isoString =
    typeof timestamp === "string" ? timestamp : timestamp.toISOString();

  return (
    <div className="relative flex items-start gap-3 md:gap-4">
      {!isLast && (
        <div className="absolute top-6 left-[13px] h-full w-px bg-neutral-200 dark:bg-neutral-800" />
      )}

      {/* Icon */}
      <div
        className={`relative z-10 mt-[-3px] flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-950 ${iconColor}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-6">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] leading-snug text-neutral-700 dark:text-neutral-300">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {actor}
            </span>{" "}
            {action}
          </p>
          <time
            dateTime={isoString}
            className="shrink-0 text-[13px] tabular-nums text-neutral-400 dark:text-neutral-500"
          >
            {formatRelativeTime(timestamp)}
          </time>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}

        {/* Details toggle */}
        {hasDetails && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 text-[13px] text-neutral-400 transition-colors duration-150 ease hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none ${showDetails ? "rotate-180" : ""}`}
              />
              {details.length} added
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                showDetails
                  ? "[grid-template-rows:1fr] opacity-100"
                  : "[grid-template-rows:0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-2">
                  {/* Integration bubbles */}
                  <div className="flex flex-wrap gap-1.5">
                    {details.map((item) =>
                      item.href ? (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[13px] text-neutral-600 transition-colors duration-150 ease hover:bg-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800/70"
                        >
                          {item.icon && <span className="shrink-0">{item.icon}</span>}
                          {item.label}
                          <ArrowUpRight className="size-3 text-neutral-400 dark:text-neutral-500" />
                        </a>
                      ) : (
                        <div
                          key={item.id}
                          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[13px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400"
                        >
                          {item.icon && <span className="shrink-0">{item.icon}</span>}
                          {item.label}
                        </div>
                      )
                    )}
                  </div>

                  {/* Undo */}
                  {onRevert && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={onRevert}
                        className="rounded-md px-2 py-0.5 text-[12px] font-medium text-neutral-400 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
