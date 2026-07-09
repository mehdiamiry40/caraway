import type { ReactNode } from "react";

/** External link that opens in a new tab. Clicks are tracked by the delegated
 *  listener in SiteAnalytics via the `data-track-*` attributes. */
export function TrackedOutboundLink({
  href,
  className,
  location,
  trackEvent = "authority_link_click",
  children,
}: {
  href: string;
  /** Short label for analytics (e.g. from resource-links copy). */
  label: string;
  /** Where the link appears, e.g. `footer_resources`. */
  location: string;
  /** Allowlisted event name sent on click. */
  trackEvent?: "authority_link_click" | "google_business_click";
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-track-event={trackEvent}
      data-track-location={location}
    >
      {children}
    </a>
  );
}
