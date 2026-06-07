import Link from "next/link";
import { CarFront, Clock, MapPin, Phone } from "lucide-react";
import { services } from "@/data/services";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { GetMyQuoteButton } from "./GetMyQuoteButton";
import { HeaderFrame } from "./HeaderFrame";
import { BUSINESS } from "@/lib/site";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const serviceLinks = services.map((s) => ({
    label: s.title.split("|")[0].trim(),
    href: `/${s.slug}`,
  }));

  return (
    <HeaderFrame>
      <div className="h-1 bg-gradient-to-r from-cta via-accent to-primary" aria-hidden="true" />

      <div className="hidden sm:block w-full bg-background border-b border-border">
        <div className="site-container flex items-center justify-end h-8 text-xs">
          <div className="flex items-center divide-x divide-border">
            <span className="inline-flex items-center gap-2 px-4 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Open today · {BUSINESS.hours} · 7 days
            </span>
            <span className="inline-flex items-center gap-2 px-4 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Free pickup across Greater Brisbane
            </span>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-1.5 pl-4 text-primary font-semibold hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            aria-label="Caraway — Home"
            className="flex items-center gap-3 group shrink-0"
          >
            <span className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center bg-primary text-primary-foreground transition-colors group-hover:bg-ink-deep">
              <CarFront className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block font-display font-bold text-lg sm:text-xl tracking-[0.08em] text-primary">
                CARAWAY
              </span>
              <span className="mt-1 block text-[0.58rem] sm:text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Vehicle buying
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-0 flex-1 justify-center"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-primary/85 hover:text-accent transition-colors duration-200 px-3 py-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center shrink-0 gap-2">
            <GetMyQuoteButton size="sm">Get my quote</GetMyQuoteButton>
          </div>

          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>
    </HeaderFrame>
  );
}
