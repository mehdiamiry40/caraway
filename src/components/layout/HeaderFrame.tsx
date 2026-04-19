"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;

/**
 * Client shell for the header. Keeps the header server-rendered where possible
 * while managing a single `data-scrolled` attribute that swaps the backdrop
 * treatment once the user passes ~24px of scroll — the Stripe nav convention.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);

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
    <header
      ref={ref}
      data-scrolled="false"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-safe pl-safe pr-safe",
        "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-200 ease-[var(--ease-out-quint)]",
        // Idle state — transparent, no border, no shadow.
        "bg-background/0 backdrop-blur-0 border-b border-transparent",
        // Scrolled state (data-scrolled="true") — translucent blur + hairline.
        "data-[scrolled=true]:bg-background/75 data-[scrolled=true]:backdrop-blur-xl data-[scrolled=true]:backdrop-saturate-150 data-[scrolled=true]:border-border/70 data-[scrolled=true]:shadow-[0_1px_0_0_hsl(var(--border)/0.5),0_8px_24px_-12px_hsl(var(--shadow-color)/0.1)]",
      )}
    >
      {children}
    </header>
  );
}
