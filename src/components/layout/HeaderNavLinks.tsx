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
              "relative inline-flex h-full items-center border-l border-[hsl(var(--on-dark-hi)/0.16)] px-5 text-sm font-semibold transition-colors duration-200 after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-cta after:transition-transform hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-inset",
              isActive
                ? "bg-[hsl(var(--on-dark-hi)/0.08)] text-on-dark-hi after:scale-x-100"
                : "text-on-dark-hi/80 hover:bg-[hsl(var(--on-dark-hi)/0.06)] hover:text-on-dark-hi",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
