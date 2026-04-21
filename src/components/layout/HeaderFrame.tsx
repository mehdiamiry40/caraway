"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;

/**
 * Looping-style header shell. Tracks scroll so the top utility strip can
 * collapse on scroll and the main pill nav can add a deeper shadow.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (el.dataset.scrolled !== String(scrolled)) {
        el.dataset.scrolled = String(scrolled);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-scrolled="false"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-safe pl-safe pr-safe",
      )}
    >
      {children}
    </div>
  );
}
