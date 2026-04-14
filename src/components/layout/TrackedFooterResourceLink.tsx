"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** Internal footer “Helpful resources” link — reuses `internal_link_click` with a fixed variant. */
export function TrackedFooterResourceLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() =>
        trackEvent("internal_link_click", {
          href,
          label,
          variant: "footer_resources",
        })
      }
      className={className}
    >
      {children}
    </Link>
  );
}
