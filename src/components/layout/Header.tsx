import Link from "next/link";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";

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
      <div className="site-container flex h-16 items-center justify-between gap-6 sm:h-18">
        <Link
          href="/"
          prefetch={false}
          className="shrink-0 rounded-sm text-base font-semibold tracking-[-0.01em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Caraway
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          <HeaderNavLinks links={navLinks} />
        </nav>

        <div className="hidden shrink-0 items-center gap-6 lg:flex">
          <a
            href={BUSINESS.phoneTel}
            className="rounded-sm text-sm text-foreground tabular-nums transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Call ${BUSINESS.phoneDisplay}`}
          >
            {BUSINESS.phoneDisplay}
          </a>
          <Link
            href="/#quote-form"
            prefetch={false}
            className={buttonVariants({ size: "sm" })}
          >
            Get my quote
          </Link>
        </div>

        <MobileMenuClient serviceLinks={serviceLinks} />
      </div>
    </HeaderFrame>
  );
}
