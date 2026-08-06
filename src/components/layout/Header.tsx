import Link from "next/link";
import { Clock, Phone } from "lucide-react";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { MobileMenuClient } from "./MobileMenuClient";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const mainLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

const utilityLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Cash for Cars", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal", href: "/car-removal-brisbane" },
  { label: "Sell My Car", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Unwanted Cars", href: "/unwanted-cars-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

export function Header() {
  return (
    <HeaderFrame>
      <div className="hidden h-9 bg-primary text-on-dark-hi sm:block">
        <div className="site-container flex h-full items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 text-on-dark-hi/80">
            <Clock className="h-3.5 w-3.5 text-cta" aria-hidden="true" />
            Open {BUSINESS.hours} · 7 days
          </span>
          <div className="flex h-full items-center gap-5">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-full items-center font-semibold text-on-dark-hi/85 transition-colors hover:text-cta"
              >
                {link.label}
              </Link>
            ))}
            <span
              className="h-4 w-px bg-[hsl(var(--on-dark-hi)/0.35)]"
              aria-hidden="true"
            />
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-1.5 font-semibold text-on-dark-hi transition-colors hover:text-cta"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-5 sm:h-[5.25rem]">
          <Link href="/" className="group shrink-0 leading-none">
            <span className="block font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary sm:text-[1.9rem]">
              caraway<span className="text-cta">.</span>
            </span>
            <span className="mt-1 block text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Vehicle buying
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-end gap-1 lg:flex"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            <HeaderNavLinks links={mainLinks} />
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              href="/#price-estimator"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-11 rounded-none px-6",
              )}
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
