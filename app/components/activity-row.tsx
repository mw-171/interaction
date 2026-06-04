"use client";

import { useState } from "react";

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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10L11.2929 13.2929C11.6834 13.6834 12.3166 13.6834 12.7071 13.2929L16 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileEditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10.9999V7.99994L17.5858 3.41416C18.3668 2.63311 19.6332 2.63311 20.4142 3.41416L20.5858 3.58573C21.3668 4.36678 21.3668 5.63311 20.5858 6.41416L16 10.9999H13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 7V12M12 12V17M12 12H7M12 12H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
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
  content: string;
  type: string;
  typeColor?: "green" | "blue" | "purple" | "orange";
  onExpand?: () => void;
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

const typeColorMap: Record<string, string> = {
  green: "text-green-500 dark:text-green-400",
  blue: "text-blue-500 dark:text-blue-400",
  purple: "text-purple-500 dark:text-purple-400",
  orange: "text-orange-500 dark:text-orange-400",
};

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
  const [showDetails, setShowDetails] = useState(true);

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
        className={`relative z-10 mt-[-1px] flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-950 ${iconColor}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="text-[14px] leading-snug text-neutral-700 dark:text-neutral-300">
            <p>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {actor}
              </span>{" "}
              {action}
              <span className="ml-1.5 whitespace-nowrap text-neutral-400 dark:text-neutral-500">
                ·{" "}
                <time dateTime={isoString} className="tabular-nums">
                  {formatRelativeTime(timestamp)}
                </time>
              </span>
            </p>
          </div>
          {onRevert && (
            <button
              type="button"
              onClick={onRevert}
              className="shrink-0 rounded-md px-2 py-0.5 text-[12px] font-medium text-neutral-400 transition-colors duration-200 ease-out hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              Revert
            </button>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}

        {/* Details section */}
        {hasDetails && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 text-[13px] text-neutral-400 transition-colors duration-150 ease hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              <ChevronIcon
                className={`size-3.5 transition-transform duration-200 ease-out ${showDetails ? "rotate-180" : ""}`}
              />
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
              <div className="mt-2 flex flex-col rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                {details.map((item, i) => {
                  const iconClass =
                    typeColorMap[item.typeColor ?? "green"] ??
                    typeColorMap.green;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onExpand}
                      className={`flex w-full items-start gap-2 px-3 py-2 text-left transition-colors duration-150 ease hover:bg-neutral-100 dark:hover:bg-neutral-800/50 ${
                        i > 0
                          ? "border-t border-neutral-200 dark:border-neutral-800"
                          : ""
                      }`}
                    >
                      <FileEditIcon className="mt-px size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                      <span className="min-w-0 text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                        {item.content}
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-1.5">
                        <PlusIcon className={`size-3.5 ${iconClass}`} />
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          {item.type}
                        </span>
                        <ChevronIcon className="size-3 text-neutral-400 dark:text-neutral-500" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
