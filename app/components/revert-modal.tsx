"use client";

import { useState, useEffect, useRef, useLayoutEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MODAL_TRANSITION_MS = 200;

export interface ActivityDetail {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export default function RevertModal({
  open,
  onClose,
  onConfirm,
  actor,
  action,
  details,
  description,
  stops,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  actor: string;
  action: string;
  details?: ActivityDetail[];
  description?: string;
  stops?: string[];
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
    if (open) {
      const raf = requestAnimationFrame(() => {
        setMounted(true);
        setVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }

    const raf = requestAnimationFrame(() => setVisible(false));
    const t = window.setTimeout(
      () => setMounted(false),
      MODAL_TRANSITION_MS,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    dialogRef.current
      ?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
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

  const confirmLabel = `Revert ${actor}`;

  const stopsItems = stops ?? (description ? [description.replace(/\.$/, "")] : []);
  const staysItems: string[] = [
    ...(details?.map((d) => `Your ${d.label} connection`) ?? []),
    "Any data already saved",
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ease-in-out dark:bg-black/70 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
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
        className={`relative z-10 my-auto flex w-full max-w-md flex-col rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-lg transition-[scale,opacity] duration-200 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 motion-reduce:transition-none sm:max-w-lg ${visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"}`}
      >
        <div className="p-6 pb-4">
          <h2 id={titleId} className="text-lg font-semibold leading-none">
            Revert {actor}?
          </h2>
          <p id={descId} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            This removes the recipe from your account.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
          {stopsItems.length > 0 && (
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                What stops
              </h4>
              <ul className="flex flex-col gap-1.5">
                {stopsItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-600 dark:text-neutral-400">
                    <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              What stays
            </h4>
            <ul className="flex flex-col gap-1.5">
              {staysItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-600 dark:text-neutral-400">
                  <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-100 p-6 pt-4 dark:border-neutral-800">
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
            {loading ? "Reverting…" : confirmLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onCloseRef.current()}
            className="w-full inline-flex h-9 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-100 sm:h-8"
          >
            Cancel
          </button>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => onCloseRef.current()}
          aria-label="Close"
          className="absolute end-3 top-3 flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40 dark:text-neutral-500 dark:hover:bg-white/8"
        >
          <X className="size-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>,
    document.body
  );
}
