"use client";

import { useState } from "react";
import { ChevronDown, FilePen, Plus } from "lucide-react";

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
  const [showDetails, setShowDetails] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasDetails = details && details.length > 0;
  const isoString =
    typeof timestamp === "string" ? timestamp : timestamp.toISOString();

  return (
    <div className="group relative flex items-start gap-3 md:gap-4">
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
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] leading-snug text-neutral-700 dark:text-neutral-300">
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {actor}
              </span>{" "}
              {action}
            </p>
            {onRevert && (
              <button
                type="button"
                onClick={onRevert}
                className="shrink-0 rounded-md px-2 py-0.5 text-[12px] font-medium text-neutral-400 opacity-0 transition-[opacity,color,background-color] duration-150 ease-out hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 motion-reduce:transition-none"
              >
                Undo
              </button>
            )}
          </div>
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

        {/* Details section */}
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
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {/* grid-template-rows trick: avoids animating height directly */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                showDetails
                  ? "[grid-template-rows:1fr] opacity-100"
                  : "[grid-template-rows:0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-2 flex flex-col rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                  {details.map((item, i) => {
                    const isExpanded = expandedItems.has(item.id);
                    const iconClass =
                      typeColorMap[item.typeColor ?? "green"] ??
                      typeColorMap.green;
                    return (
                      <div
                        key={item.id}
                        className={i > 0 ? "border-t border-neutral-200 dark:border-neutral-800" : ""}
                      >
                        {/* Header row — always shows truncated preview */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleItem(item.id);
                            item.onExpand?.();
                          }}
                          className="flex w-full items-start gap-2 px-3 py-2 text-left cursor-pointer transition-colors duration-150 ease hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                        >
                          <FilePen className="mt-px size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                          <span className="min-w-0 text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                            {item.content}
                          </span>
                          <span className="ml-auto flex shrink-0 items-center gap-1.5">
                            <Plus className={`size-3.5 ${iconClass}`} />
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                              {item.type}
                            </span>
                            <ChevronDown
                              className={`size-3 text-neutral-400 transition-transform duration-200 ease-out motion-reduce:transition-none dark:text-neutral-500 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </button>

                        {/* Expanded content — grid reveal below header */}
                        <div
                          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                            isExpanded
                              ? "[grid-template-rows:1fr]"
                              : "[grid-template-rows:0fr]"
                          }`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="px-3 pt-1.5 pb-2.5 pl-[30px]">
                              <p
                                className={`whitespace-pre-wrap text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400 transition-opacity duration-150 delay-75 motion-reduce:transition-none ${
                                  isExpanded ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                {item.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
