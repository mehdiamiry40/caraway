"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Fixed site header. On the homepage it starts transparent over the photo
 * hero and turns solid navy once the page scrolls; every other route gets the
 * solid navy bar from the first paint. `data-scrolled` drives the drop shadow
 * defined in globals.css.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const overlay = pathname === "/" && !scrolled;

  return (
    <header
      data-scrolled={scrolled ? "true" : undefined}
      data-overlay={overlay ? "true" : undefined}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-safe pl-safe pr-safe text-on-dark-hi transition-[background-color,box-shadow] duration-300 ease-[var(--ease-out-quint)]",
        overlay ? "bg-transparent" : "bg-primary",
      )}
    >
      {children}
    </header>
  );
}
