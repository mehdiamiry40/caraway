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
              "px-3 py-2 text-sm font-normal transition-colors duration-200 rounded-sm underline-offset-[10px] decoration-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark-hi/70",
              isActive
                ? "text-on-dark-hi underline decoration-accent"
                : "text-on-dark-hi/85 hover:text-on-dark-hi hover:underline hover:decoration-accent",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
