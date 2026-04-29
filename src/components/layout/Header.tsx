import Link from "next/link";
import { services } from "@/data/services";
import { ServicesDropdownClient } from "./ServicesDropdownClient";
import { MobileMenuClient } from "./MobileMenuClient";
import { GetMyQuoteButton } from "./GetMyQuoteButton";
import { HeaderFrame } from "./HeaderFrame";

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
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="site-container flex items-center justify-between h-14 sm:h-16 gap-4">
          <Link
            href="/"
            aria-label="Caraway — Home"
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="font-medium text-lg tracking-tight text-foreground lowercase transition-opacity duration-150 group-hover:opacity-70">
              caraway
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 flex-1 justify-center"
          >
            <ServicesDropdownClient serviceLinks={serviceLinks} />
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center shrink-0">
            <GetMyQuoteButton size="sm">Get a quote</GetMyQuoteButton>
          </div>

          <MobileMenuClient serviceLinks={serviceLinks} />
        </div>
      </div>
    </HeaderFrame>
  );
}
