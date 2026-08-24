import Link from "next/link";
import { ArrowRight, CarFront, Phone } from "lucide-react";
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
      <div className="h-1 bg-cta" aria-hidden="true" />

      <div className="border-b border-border bg-background">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-3 sm:h-[4.75rem] lg:gap-8">
          <Link
            href="/"
            prefetch={false}
            className="group flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
              <CarFront className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-[0.1em] text-primary sm:text-xl">
                CARAWAY
              </span>
              <span className="mt-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Brisbane vehicle buyer
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-ink-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#quote-form"
              prefetch={false}
              className={buttonVariants({ size: "sm", variant: "primary" })}
            >
              Get my quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>

      <div className="hidden bg-ink-deep text-on-dark-hi lg:block">
        <div className="site-container flex h-11 items-center justify-between">
          <nav aria-label="Primary navigation" className="flex h-full items-stretch">
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            <HeaderNavLinks links={navLinks} />
          </nav>
          <Link
            href="/contact"
            className="group inline-flex min-h-11 items-center gap-2 border-l border-[hsl(var(--on-dark-hi)/0.2)] pl-6 text-sm font-semibold text-on-dark-hi/90 transition-colors hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--on-dark-hi)/0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep"
          >
            Contact us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </HeaderFrame>
  );
}
