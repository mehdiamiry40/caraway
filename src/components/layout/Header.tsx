import Link from "next/link";
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
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe pl-safe pr-safe bg-background/85 backdrop-blur-xl border-b border-border/70 shadow-[0_16px_40px_-34px_hsl(var(--shadow-color)/0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-14 h-14 sm:h-16 lg:h-[68px] gap-2 sm:gap-4 lg:gap-6">
        <Link href="/" aria-label="Caraway — Home" className="flex items-center gap-2 group shrink-0">
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-primary lowercase transition-opacity duration-200 group-hover:opacity-80">
            caraway<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop nav: inline primary links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1 flex-1 justify-center"
        >
          <ServicesDropdownClient serviceLinks={serviceLinks} />
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          <GetMyQuoteButton size="sm">Get your free cash offer</GetMyQuoteButton>
        </div>

        {/* Mobile: phone icon + Quote button + hamburger + drawer */}
        <MobileMenuClient serviceLinks={serviceLinks} />
      </div>
    </header>
  );
}
