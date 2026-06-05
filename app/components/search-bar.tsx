"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search activity…",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stay open while there's a value, so the user can see what they're filtering by.
  const isOpen = expanded || value.length > 0;

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  function handleIconClick() {
    if (isOpen && value.length === 0) {
      setExpanded(false);
      inputRef.current?.blur();
    } else {
      setExpanded(true);
    }
  }

  function handleBlur() {
    if (value.length === 0) setExpanded(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (value.length > 0) onChange("");
      setExpanded(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div
      className={`relative flex h-8 shrink-0 items-center transition-[width] duration-200 ease-out motion-reduce:transition-none ${
        isOpen ? "w-3/5 max-w-64 sm:w-64" : "w-8"
      }`}
    >
      <button
        type="button"
        onClick={handleIconClick}
        aria-label={isOpen ? "Close search" : "Search activity"}
        aria-expanded={isOpen}
        className="absolute top-0 left-0 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <Search size={16} strokeWidth={2} />
      </button>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search activity"
        autoComplete="off"
        spellCheck={false}
        tabIndex={isOpen ? 0 : -1}
        className={`h-8 w-full rounded-lg border bg-transparent pr-8 pl-8 text-[16px] text-neutral-900 placeholder:text-neutral-400 transition-[border-color,opacity] duration-150 ease-out focus-visible:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 motion-reduce:transition-none sm:text-[14px] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-700 [&::-webkit-search-cancel-button]:hidden ${
          isOpen
            ? "border-neutral-200 opacity-100 dark:border-neutral-800"
            : "pointer-events-none border-transparent opacity-0"
        }`}
      />
      {isOpen && value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-0.5 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
