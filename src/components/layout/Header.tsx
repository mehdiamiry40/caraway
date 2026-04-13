import Link from "next/link";
import { Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { services } from "@/data/services";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { GetMyQuoteButton } from "./GetMyQuoteButton";

const navLinks = [
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe pl-safe pr-safe bg-primary shadow-sm">
      {/* Top bar */}
      <div className="border-b border-white/20 pl-safe pr-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-14 h-14">
          <Link href="/" aria-label="Caraway — Home" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-2xl tracking-tight text-white lowercase transition-opacity duration-200 group-hover:opacity-80">
              caraway<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop: static phone link + scroll-to-quote button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              aria-label={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>{BUSINESS.phoneFriendly}</span>
            </a>
            <GetMyQuoteButton
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ring-offset-primary"
            >
              Get my quote
            </GetMyQuoteButton>
          </div>

          {/* Mobile: phone icon + Quote button + hamburger + drawer */}
          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>

      {/* Desktop navigation bar */}
      <div className="border-b border-black/10 hidden lg:block pl-safe pr-safe bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Primary navigation" className="flex items-center gap-1 h-12">
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            {navLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center">
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white hover:border-white/30 hover:bg-white/15 flex items-center rounded-full px-4 py-1.5 border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
