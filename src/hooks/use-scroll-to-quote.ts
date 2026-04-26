"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Returns a callback that scrolls the user to the quote form.
 *
 * - On the home page, scrolls to the #price-estimator section.
 * - On other pages, tries to find an embedded quote section
 *   (#price-estimator or #quote-form) before falling back to
 *   navigating home with a hash.
 */
export function useScrollToQuote() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  return useCallback(() => {
    if (isHome) {
      const el = document.getElementById("price-estimator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    const el =
      document.getElementById("price-estimator") ||
      document.getElementById("quote-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#price-estimator");
    }
  }, [isHome, router]);
}
