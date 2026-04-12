"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Thin client wrapper around an &lt;a&gt; that fires a "phone_click" analytics
 * event before navigation. Lets server components (Footer, etc.) embed a
 * trackable phone link without the parent itself becoming a client boundary.
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
      onClick={() => trackEvent("phone_click", { location })}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
