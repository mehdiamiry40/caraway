import Link from "next/link";
import { Phone } from "lucide-react";
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
  { label: "Car Removal", href: "/car-removal-brisbane" },
  { label: "Sell My Car", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

export function Header() {
  const serviceLinks = coreServiceLinks;

  return (
    <HeaderFrame>
      <div className="bg-background">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-3 sm:h-[5.5rem] lg:gap-6">
          <Link
            href="/"
            prefetch={false}
            className="shrink-0 font-sans text-2xl font-semibold leading-none text-foreground transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Caraway
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex flex-1 items-center justify-end gap-1"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            <HeaderNavLinks links={navLinks} />
          </nav>

          <div className="hidden lg:flex items-center shrink-0 gap-5">
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex min-h-11 items-center gap-1.5 text-base text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
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
      </div>
    </HeaderFrame>
  );
}
