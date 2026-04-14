"use client";

import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

/** Opens the Google Business profile in a new tab and records a single analytics event. */
export function TrackedGoogleBusinessLink({
  className,
  ariaLabel = "Caraway on Google (opens in a new tab)",
  location,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  location: string;
  children: ReactNode;
}) {
  return (
    <a
      href={BUSINESS.googleBusinessUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("google_business_click", { location })}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
