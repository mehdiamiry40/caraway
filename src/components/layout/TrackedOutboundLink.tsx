import type { ReactNode } from "react";

/** External link that opens in a new tab. */
export function TrackedOutboundLink({
  href,
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
      className={className}
    >
      {children}
    </a>
  );
}
