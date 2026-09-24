import Link from "next/link";
import { Phone } from "lucide-react";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { Logo } from "./Logo";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Navigation shows only the five core services — the long-tail SEO pages
 * (model- and situation-specific) stay reachable from /services and internal
 * links, but 18 near-identical dropdown entries was choice overload.
 */
const coreServiceLinks = [
  { label: "Cash for Cars", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal", href: "/car-removal-brisbane" },
  { label: "Sell My Car", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

export function Header() {
  const serviceLinks = coreServiceLinks;

  return (
    <HeaderFrame>
      <div className="site-container relative flex h-[var(--header-h)] items-center justify-between lg:flex-col lg:justify-center lg:gap-3">
        <Link
          href="/"
          prefetch={false}
          aria-label="Caraway home"
          className="shrink-0 rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark-hi/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <Logo tone="light" size="sm" className="lg:hidden" />
          <Logo tone="light" size="md" className="hidden lg:inline-flex" />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center justify-center gap-1"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          <HeaderNavLinks links={navLinks} />
        </nav>

        <a
          href={BUSINESS.phoneTel}
          className="absolute left-8 top-8 hidden items-center gap-2 rounded-sm text-sm text-on-dark-hi/90 transition-colors hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark-hi/70 lg:inline-flex"
          aria-label={`Call ${BUSINESS.phoneDisplay}`}
        >
          <Phone className="h-4 w-4 text-cta-bright" aria-hidden="true" />
          {BUSINESS.phoneDisplay}
        </a>

        <Link
          href="/#quote-form"
          prefetch={false}
          className={cn(
            buttonVariants({ size: "sm" }),
            "absolute right-8 top-7 hidden lg:inline-flex",
          )}
        >
          Get my quote
        </Link>

        <MobileMenuClient serviceLinks={serviceLinks} />
      </div>
    </HeaderFrame>
  );
}
