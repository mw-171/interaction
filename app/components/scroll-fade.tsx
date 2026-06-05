"use client";

import { useEffect, useState } from "react";

/**
 * A subtle gradient fade pinned to the bottom of the viewport, shown only while
 * the document can still be scrolled down. It hints that more timeline items lie
 * below the fold and hides itself once you reach the end. This page uses
 * document scroll (not an inner container), so it measures the window.
 *
 * The gradient fades to a zero-alpha copy of the *same* background color rather
 * than to `transparent` (transparent black), which would band through grey on
 * the warm/near-black backgrounds.
 */
export default function ScrollFade() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const remaining = scrollable - window.scrollY;
      // Show while the page overflows and there's still more than a hair left.
      setVisible(scrollable > 8 && remaining > 8);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Items get added/removed without a scroll or resize event, which changes
    // document height — observe the body so the fade re-evaluates then too.
    const ro = new ResizeObserver(update);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-t from-[rgb(255,253,250)] to-[rgba(255,253,250,0)] transition-opacity duration-300 ease-out motion-reduce:transition-none dark:from-[rgb(16,16,18)] dark:to-[rgba(16,16,18,0)] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
