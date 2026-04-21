import Link from "next/link";
import { Phone, Clock } from "lucide-react";
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
];

export function Header() {
  const serviceLinks = services.map((s) => ({
    label: s.title.split("|")[0].trim(),
    href: `/${s.slug}`,
  }));

  return (
    <HeaderFrame>
      {/* Top utility strip — dark purple band with phone + hours */}
      <div className="hidden sm:block w-full bg-ink-deep text-on-dark-hi">
        <div className="site-container flex items-center justify-between h-9 text-xs font-medium">
          <span className="inline-flex items-center gap-2 text-on-dark-hi/80">
            <Clock className="h-3.5 w-3.5 text-cta" aria-hidden="true" />
            Open today · {BUSINESS.hours} · 7 days
          </span>
          <div className="flex items-center gap-5">
            <span className="text-on-dark-hi/70">
              Free pickup across Greater Brisbane
            </span>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center gap-1.5 text-on-dark-hi hover:text-cta transition-colors"
              aria-label={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phoneFriendly}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background border-b border-border/80">
        <div className="site-container flex items-center justify-between h-14 sm:h-16 lg:h-[72px] gap-3 lg:gap-6">
          <Link
            href="/"
            aria-label="Caraway — Home"
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="font-display font-black text-2xl lg:text-[1.625rem] tracking-[-0.04em] text-primary lowercase transition-opacity duration-200 group-hover:opacity-80">
              caraway<span className="text-accent">.</span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-1 flex-1 justify-center"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-foreground/75 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center shrink-0 gap-2">
            <GetMyQuoteButton size="sm">Check my car</GetMyQuoteButton>
          </div>

          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>
    </HeaderFrame>
  );
}
