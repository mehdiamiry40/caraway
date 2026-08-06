import Link from "next/link";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { MobileMenuClient } from "./MobileMenuClient";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  return (
    <HeaderFrame>
      <div className="border-b border-border bg-background">
        <div className="site-container flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[0.08em] text-primary transition-opacity hover:opacity-75 sm:text-2xl"
          >
            CARAWAY
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-center lg:flex"
          >
            <HeaderNavLinks links={navLinks} />
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              href="/#price-estimator"
              className={buttonVariants({ size: "sm" })}
            >
              Get my quote
            </Link>
          </div>

          <MobileMenuClient />
        </div>
      </div>
    </HeaderFrame>
  );
}
