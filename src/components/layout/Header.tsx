import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
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
  { label: "Car Removal", href: "/car-removal-brisbane" },
  { label: "Sell My Car", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const stripLinkClass =
  "inline-flex h-9 items-center gap-1.5 text-on-dark transition-colors hover:text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Header() {
  const serviceLinks = coreServiceLinks;

  return (
    <HeaderFrame>
      {/* Utility strip: where we buy and who we are. Desktop only — on small
          screens the same details live in the footer and the mobile menu.
          Its height is part of --header-h from lg up. */}
      <div className="hidden bg-ink-deep text-[0.8125rem] lg:block">
        <div className="site-container flex h-9 items-center justify-between gap-6">
          <p className="flex min-w-0 items-center gap-1.5 text-on-dark">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-cta-bright" aria-hidden="true" />
            <span className="truncate">
              Buying cars across Greater Brisbane, including parts of Logan,
              Ipswich, Moreton Bay &amp; Redlands
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-6">
            <a
              href={BUSINESS.abrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={stripLinkClass}
            >
              <Building2 className="h-3.5 w-3.5 text-cta-bright" aria-hidden="true" />
              ABN {BUSINESS.abn}
            </a>
            <a href={BUSINESS.emailHref} className={stripLinkClass}>
              <Mail className="h-3.5 w-3.5 text-cta-bright" aria-hidden="true" />
              {BUSINESS.email}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-ink">
        <div className="site-container flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.5rem] lg:h-[4.75rem] lg:gap-5">
          <Logo />

          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1.5"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            <HeaderNavLinks links={navLinks} />
          </nav>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <a
              href={BUSINESS.phoneTel}
              className="group inline-flex min-h-11 items-center gap-2.5 text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="flex h-10 w-10 items-center justify-center border border-on-dark-hi/25 text-cta-bright transition-colors group-hover:border-cta group-hover:bg-cta group-hover:text-cta-foreground">
                <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
              </span>
              <span className="hidden flex-col leading-none xl:flex">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-on-dark">
                  Call us
                </span>
                <span className="mt-1 font-display text-[1.375rem] font-bold leading-none tracking-[0.02em]">
                  {BUSINESS.phoneDisplay}
                </span>
              </span>
            </a>
            <Link
              href="/#quote-form"
              prefetch={false}
              className={cn(buttonVariants({ size: "sm" }), "h-11 px-5 text-lg")}
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
