import type { ReactNode } from "react";

/**
 * Kept as a compatibility wrapper for existing call sites. It renders a plain
 * anchor so phone links do not create a client-side hydration boundary.
 */
export function TrackedPhoneLink({
  href,
  className,
  ariaLabel,
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
    >
      {children}
    </a>
  );
}
