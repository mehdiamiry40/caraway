"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const QUOTE_TARGET_IDS = ["quote-form", "quote-section"] as const;

export function findQuoteTarget(doc: Pick<Document, "getElementById"> = document) {
  for (const id of QUOTE_TARGET_IDS) {
    const target = doc.getElementById(id);
    if (target) return target;
  }
  return null;
}

/**
 * Returns a callback that scrolls the user to the quote form.
 *
 * - On the home page, scrolls to the #quote-form section.
 * - On other pages, tries to find an embedded quote section before
 *   falling back to navigating home with a hash.
 */
export function useScrollToQuote() {
  const router = useRouter();

  return useCallback(() => {
    const el = findQuoteTarget();
    if (el) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    } else {
      router.push("/#quote-form");
    }
  }, [router]);
}
