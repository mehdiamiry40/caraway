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
          className="flex items-center gap-2 group shrink-0"
        >
          <span className="font-display font-black text-xl sm:text-[1.375rem] tracking-[-0.04em] text-foreground lowercase transition-opacity duration-200 group-hover:opacity-80">
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
              className="font-mono uppercase text-[0.75rem] tracking-[0.12em] text-foreground hover:text-accent transition-colors duration-200 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
    </HeaderFrame>
  );
}
