"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { isDataAttributeEvent, trackEvent } from "@/lib/analytics";

/**
 * Mounts Vercel Web Analytics plus a single delegated click listener, so
 * server-rendered anchors (phone numbers, outbound references, CTAs) can be
 * tracked through `data-track-*` attributes without each link becoming its
 * own client-hydration island.
 *
 * - `tel:` / `mailto:` anchors are tracked automatically.
 * - Other anchors opt in with `data-track-event` (allowlisted names only).
 * - `data-track-location` says where the link lives, e.g. "footer".
 */
export function SiteAnalytics() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const location = anchor.dataset.trackLocation ?? "unspecified";

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { location });
        return;
      }
      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { location });
        return;
      }

      const name = anchor.dataset.trackEvent;
      if (name && isDataAttributeEvent(name)) {
        trackEvent(name, { location, href });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <Analytics />;
}
