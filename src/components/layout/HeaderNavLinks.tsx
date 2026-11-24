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
              "inline-flex h-12 items-center border-b-[3px] px-3.5 text-[1.0625rem] font-semibold text-on-dark-hi transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [--ring:48_100%_65%] xl:px-5",
              isActive ? "border-cta-bright" : "border-transparent",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
