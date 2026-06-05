"use client";

import { useState, useEffect, useRef, useLayoutEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MODAL_TRANSITION_MS = 200;

export default function RevertModal({
  open,
  onClose,
  onConfirm,
  actor,
  kind,
  description,
  stops,
  stays,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  actor: string;
  kind?: "recipe" | "integration";
  description?: string;
  stops?: string[];
  stays?: string[];
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    let raf1: number | null = null;
    let raf2: number | null = null;
    let t: number | null = null;

    if (open) {
      // Mount in the closed state so it paints first, then flip to visible on
      // the next frame. Setting both in the same frame renders already-open and
      // skips the enter transition.
      raf1 = requestAnimationFrame(() => {
        setMounted(true);
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        if (raf1 !== null) cancelAnimationFrame(raf1);
        if (raf2 !== null) cancelAnimationFrame(raf2);
      };
    }

    raf1 = requestAnimationFrame(() => setVisible(false));
    t = window.setTimeout(() => setMounted(false), MODAL_TRANSITION_MS);
    return () => {
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (t !== null) clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    dialogRef.current
      ?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )[0]
      ?.focus();
  }, [visible]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!loadingRef.current) onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  const isIntegration = kind === "integration";
  const confirmLabel = isIntegration ? "Revert " : `Revert Recipe`;
  const loadingLabel = "Reverting...";

  const stopsItems =
    stops ?? (description ? [description.replace(/\.$/, "")] : []);
  // "What stays" is fully data-driven — callers pass exactly the lines they want
  // (e.g. recipes still relying on an integration). No auto-generated copy.
  const staysItems = stays ?? [];
  const hasContext = stopsItems.length > 0 || staysItems.length > 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center px-6 py-3 sm:items-center">
      <div
        className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-200 ease-in-out dark:bg-black/80 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={() => {
          if (!loading) onCloseRef.current();
        }}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative z-10 my-auto flex w-full flex-col rounded-2xl border border-neutral-200 bg-[rgb(255,253,250)] text-neutral-900 shadow-lg transition-[scale,opacity] duration-200 ease-in-out dark:border-neutral-800 dark:bg-[rgb(16,16,18)] dark:text-neutral-100 motion-reduce:transition-none sm:max-w-lg ${visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start gap-3 p-6 pt-4 pb-3">
          <div className="min-w-0 flex-1 pt-1">
            <h2
              id={titleId}
              className="text-lg font-semibold leading-snug break-words"
            >
              {isIntegration
                ? `Revert ${actor} Integration?`
                : `Revert ${actor}?`}
            </h2>
            <p
              id={descId}
              className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400"
            >
              {isIntegration
                ? `This limits Poke’s access to your ${actor}.`
                : "This removes this recipe’s features from your account."}
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => onCloseRef.current()}
            aria-label="Close"
            className="-me-1.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40 dark:text-neutral-500 dark:hover:bg-white/8"
          >
            <X className="size-[18px]" strokeWidth={2.5} />
          </button>
        </div>

        {hasContext && (
          <div className="flex flex-col gap-4 border-t border-neutral-100 px-6 py-3 dark:border-neutral-800">
            {stopsItems.length > 0 && (
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                  What’s stopping
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {stopsItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {staysItems.length > 0 && (
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                  What won’t change
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {staysItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-neutral-100 p-6 pt-3 dark:border-neutral-800">
          <button
            type="button"
            disabled={loading}
            onClick={() => onCloseRef.current()}
            className="w-full inline-flex h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-100 sm:h-8"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              onCloseRef.current();
            }}
            className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-500 dark:hover:bg-red-700 sm:h-8"
          >
            {loading && (
              <div className="size-3.5 animate-spin rounded-full border border-white/40 border-t-white" />
            )}
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

