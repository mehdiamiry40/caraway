import Link from "next/link";
import { services } from "@/data/services";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { GetMyQuoteButton } from "./GetMyQuoteButton";
import { HeaderFrame } from "./HeaderFrame";

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
    <HeaderFrame>
      <div className="site-container flex items-center justify-between min-h-14 h-14 sm:h-16 lg:h-[72px] gap-2 sm:gap-4 lg:gap-6">
        <Link
          href="/"
          aria-label="Caraway — Home"
          className="group flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-md"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground font-display font-bold text-sm shadow-[0_1px_2px_hsl(var(--shadow-color)/0.12),0_4px_10px_-4px_hsl(var(--primary)/0.45)]"
          >
            C
          </span>
          <span className="font-display font-bold text-[1.0625rem] sm:text-[1.125rem] tracking-[-0.02em] text-foreground transition-opacity duration-200 group-hover:opacity-85">
            Caraway
          </span>
        </Link>

        {/* Desktop nav: calm, proper-case links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[0.9375rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          <GetMyQuoteButton size="sm">Get your free offer</GetMyQuoteButton>
        </div>

        {/* Mobile: phone icon + Quote button + hamburger + drawer */}
        <MobileMenuClient serviceLinks={serviceLinks} />
      </div>
    </HeaderFrame>
  );
}
