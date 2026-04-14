"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** External link that opens in a new tab and records `authority_link_click` (e.g. TMR, ABR, AUSTRAC). */
export function TrackedOutboundLink({
  href,
  label,
  location,
  className,
  children,
}: {
  href: string;
  /** Short label for analytics (e.g. from resource-links copy). */
  label: string;
  /** Where the link appears, e.g. `footer_resources`. */
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("authority_link_click", {
          href,
          label,
          location,
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
