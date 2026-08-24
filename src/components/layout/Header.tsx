import Link from "next/link";
import { CarFront, Clock, MapPin, Phone } from "lucide-react";
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
      <div className="h-0.5 bg-cta" aria-hidden="true" />

      <div className="hidden sm:block w-full bg-background border-b border-border">
        <div className="site-container flex min-h-11 items-center justify-end text-xs">
          <div className="flex items-center divide-x divide-border">
            <span className="inline-flex items-center gap-2 px-4 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Collection windows confirmed per job
            </span>
            <span className="inline-flex items-center gap-2 px-4 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Pickup included when we buy
            </span>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex min-h-11 items-center gap-1.5 px-4 text-primary font-semibold hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-background border-b border-border">
        <div className="site-container flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-3 group shrink-0"
          >
            <span className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center bg-primary text-primary-foreground transition-colors group-hover:bg-ink-deep">
              <CarFront className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-bold text-lg sm:text-xl tracking-[0.08em] text-primary">
                CARAWAY
              </span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Vehicle buying
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-0 flex-1 justify-center"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            <HeaderNavLinks links={navLinks} />
          </nav>

          <div className="hidden lg:flex items-center shrink-0 gap-2">
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
