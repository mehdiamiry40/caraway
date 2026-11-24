import Link from "next/link";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { Logo } from "./Logo";
import { BUSINESS } from "@/lib/site";

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

const metaLinkClass =
  "inline-flex min-h-8 items-center rounded-sm text-muted-foreground underline decoration-muted-foreground/40 decoration-1 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * White bar with the logo and the phone number, green navigation bar under
 * it. Every link appears once in the markup; the grid below places the same
 * elements differently on phones (logo and menu, then the quote and phone
 * buttons side by side) and on desktop (two bars).
 */
export function Header() {
  const serviceLinks = coreServiceLinks;

  return (
    <HeaderFrame>
      {/* The green bar behind the navigation row. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-12 bg-accent lg:block" />

      <div className="site-container relative grid grid-cols-2 items-center gap-x-2.5 gap-y-3 pb-3 pt-3 [grid-template-areas:'logo_menu'_'quote_quote'] min-[360px]:[grid-template-areas:'logo_menu'_'quote_phone'] lg:grid-cols-[auto_1fr_auto] lg:gap-x-8 lg:gap-y-0 lg:py-0 lg:[grid-template-areas:'logo_note_contact'_'nav_nav_quote'] lg:[grid-template-rows:var(--header-top-h)_3rem]">
        <Logo className="justify-self-start [grid-area:logo]" />

        {/* Where we buy. Desktop only; on small screens the same details live
            in the footer. */}
        <p className="hidden max-w-[26rem] items-start gap-2 justify-self-center text-sm leading-snug text-muted-foreground [grid-area:note] lg:flex">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            Buying cars across Greater Brisbane, including parts of Logan,
            Ipswich, Moreton Bay &amp; Redlands
          </span>
        </p>

        <div className="contents lg:flex lg:flex-col lg:items-end lg:justify-center lg:[grid-area:contact]">
          <div className="hidden items-center gap-5 text-[0.8125rem] lg:flex">
            <a
              href={BUSINESS.abrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={metaLinkClass}
            >
              ABN {BUSINESS.abn}
            </a>
            <a href={BUSINESS.emailHref} className={metaLinkClass}>
              {BUSINESS.email}
            </a>
          </div>
          <a
            href={BUSINESS.phoneTel}
            className="group hidden h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary px-2 text-primary-foreground [grid-area:phone] hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-[360px]:inline-flex lg:h-auto lg:w-auto lg:gap-2.5 lg:bg-transparent lg:px-0 lg:text-primary lg:[grid-area:auto] lg:hover:bg-transparent"
            aria-label={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-[1.125rem] w-[1.125rem] shrink-0 lg:h-6 lg:w-6 lg:text-foreground" aria-hidden="true" />
            <span className="flex items-baseline gap-2 leading-none">
              <span className="hidden text-sm font-semibold text-muted-foreground xl:inline">
                Call us
              </span>
              <span className="text-[1.0625rem] font-bold leading-none tabular-nums lg:text-[2rem] lg:tracking-[0.01em] lg:group-hover:underline lg:group-hover:decoration-2 lg:group-hover:underline-offset-4">
                {BUSINESS.phoneDisplay}
              </span>
            </span>
          </a>
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden h-12 items-stretch bg-accent [grid-area:nav] lg:flex"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          <HeaderNavLinks links={navLinks} />
        </nav>

        <Link
          href="/#quote-form"
          prefetch={false}
          className="inline-flex h-12 w-full items-center justify-center gap-1 rounded-sm border-2 border-cta bg-card px-3 text-[1.0625rem] font-bold text-foreground transition-colors [grid-area:quote] hover:bg-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-9 lg:w-auto lg:justify-self-end lg:border lg:border-cta-hover lg:bg-cta lg:px-4 lg:text-base lg:text-cta-foreground lg:hover:bg-cta-hover lg:focus-visible:ring-offset-accent lg:[--ring:48_100%_65%]"
        >
          Get my quote
          <ChevronRight className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={3} aria-hidden="true" />
        </Link>

        <div className="justify-self-end [grid-area:menu] lg:hidden">
          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>
    </HeaderFrame>
  );
}
