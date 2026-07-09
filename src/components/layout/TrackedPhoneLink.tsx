import type { ReactNode } from "react";

/**
 * Renders a plain anchor so phone links do not create a client-side hydration
 * boundary. Clicks are tracked by the delegated listener in SiteAnalytics,
 * which reads the `data-track-location` attribute.
 */
export function TrackedPhoneLink({
  href,
  className,
  ariaLabel,
  location,
  children,
}: {
  href: string;
  className?: string;
  ariaLabel?: string;
  location: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      data-track-location={location}
    >
      {children}
    </a>
  );
}
