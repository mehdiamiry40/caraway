import Link from "next/link";
import { CarFront, Phone } from "lucide-react";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "FAQ", href: "/faq" },
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
      <div className="hidden min-h-9 bg-ink-deep text-on-dark-hi sm:block">
        <div className="site-container flex min-h-9 items-center justify-end text-xs font-semibold">
          <div className="flex items-center gap-6">
            <span>Greater Brisbane vehicle buyers</span>
            <span className="text-on-dark-hi/35" aria-hidden="true">|</span>
            <Link href="/about" className="transition hover:text-cta-bright">About</Link>
            <Link href="/faq" className="transition hover:text-cta-bright">Seller FAQs</Link>
            <Link href="/blog" className="transition hover:text-cta-bright">Guides</Link>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-2 transition hover:text-cta-bright"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="site-container flex h-[76px] items-center justify-between gap-3 lg:gap-6 sm:h-[88px]">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-3 group shrink-0"
          >
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-primary text-primary-foreground transition-colors group-hover:bg-ink-deep sm:h-14 sm:w-14">
              <CarFront className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl font-semibold tracking-[0.08em] text-primary sm:text-2xl">
                CARAWAY
              </span>
              <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-ink">
                Brisbane vehicle buyers
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden h-full flex-1 items-stretch justify-center lg:flex"
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
