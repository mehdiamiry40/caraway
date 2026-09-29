"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface HeaderNavLink {
  label: string;
  href: string;
}

/**
 * Desktop primary-nav links with aria-current on the active route. Split out
 * of the (server) Header so only this list pays the client-boundary cost.
 * Hash links like /#how-it-works never count as active — the pathname for
 * them is "/", which belongs to the logo/home, not the section link.
 */
export function HeaderNavLinks({ links }: { links: readonly HeaderNavLink[] }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isPage = !link.href.includes("#");
        const isActive =
          isPage &&
          (pathname === link.href || pathname.startsWith(link.href + "/"));
        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-sm font-semibold transition-colors duration-200 px-3 py-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "text-primary underline underline-offset-8 decoration-2 decoration-accent"
                : "text-primary/85 hover:text-accent",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
