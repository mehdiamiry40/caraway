"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";

/**
 * Single delegated click listener for link analytics. TrackedPhoneLink /
 * TrackedOutboundLink stay server-rendered (no per-link hydration islands);
 * they annotate anchors with data-track-* attributes that this one client
 * component reads at click time.
 */
export function AnalyticsListener() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const location = anchor.dataset.trackLocation ?? "page";

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { location });
        return;
      }
      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { location });
        return;
      }
      if (
        href === BUSINESS.googleBusinessUrl ||
        href === BUSINESS.googleReviewUrl
      ) {
        trackEvent("google_business_click", { location });
        return;
      }
      const label = anchor.dataset.trackLabel;
      if (label) {
        trackEvent("authority_link_click", { label, location });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
