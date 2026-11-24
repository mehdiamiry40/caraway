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
  { label: "Car Removal", href: "/car-removal-brisbane" },
  { label: "Sell My Car", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const stripLinkClass =
  "inline-flex h-9 items-center text-on-dark underline decoration-on-dark/40 decoration-1 underline-offset-[3px] transition-colors hover:text-on-dark-hi hover:decoration-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

export function Header() {
  const serviceLinks = coreServiceLinks;

  return (
    <HeaderFrame>
      {/* Utility strip: where we buy and who we are. Desktop only — on small
          screens the same details live in the footer and the mobile menu.
          Its height is part of --header-h from lg up. */}
      <div className="on-green hidden bg-primary text-[0.8125rem] lg:block">
        <div className="site-container flex h-9 items-center justify-between gap-6">
          <p className="min-w-0 truncate text-on-dark">
            Buying cars across Greater Brisbane, including parts of Logan,
            Ipswich, Moreton Bay &amp; Redlands
          </p>
          <div className="flex shrink-0 items-center gap-6">
            <a
              href={BUSINESS.abrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={stripLinkClass}
            >
              ABN {BUSINESS.abn}
            </a>
            <a href={BUSINESS.emailHref} className={stripLinkClass}>
              {BUSINESS.email}
            </a>
          </div>
        </div>
      </div>

      <div className="site-container flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.5rem] lg:h-[4.75rem] lg:gap-5">
        <Logo />

        <nav
          aria-label="Primary navigation"
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-2"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          <HeaderNavLinks links={navLinks} />
        </nav>

        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <a
            href={BUSINESS.phoneTel}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            aria-label={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-[1.125rem] w-[1.125rem] text-accent" aria-hidden="true" />
            <span className="hidden flex-col leading-none xl:flex">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Call us
              </span>
              <span className="mt-1 text-[1.1875rem] font-bold leading-none tabular-nums text-primary group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {BUSINESS.phoneDisplay}
              </span>
            </span>
          </a>
          <Link
            href="/#quote-form"
            prefetch={false}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Get my quote
          </Link>
        </div>

        <MobileMenuClient serviceLinks={serviceLinks} />
      </div>
    </HeaderFrame>
  );
}
