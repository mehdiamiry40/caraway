import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { HeaderFrame } from "./HeaderFrame";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { MobileMenuClient } from "./MobileMenuClient";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";

const mainLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

const utilityLinks = [
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <HeaderFrame>
      <div className="hidden h-8 border-b border-border/70 bg-background sm:block">
        <div className="site-container flex h-full items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent-ink" aria-hidden="true" />
            Free pickup across Greater Brisbane
          </span>
          <div className="flex items-center gap-5">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-accent-ink"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-5 sm:h-20">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="font-display text-xl font-bold tracking-[0.06em] text-primary sm:text-2xl">
              CARAWAY
            </span>
            <span
              className="h-2.5 w-2.5 rounded-full bg-cta transition-transform group-hover:scale-125"
              aria-hidden="true"
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-center lg:flex"
          >
            <HeaderNavLinks links={mainLinks} />
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              href="/#price-estimator"
              className={buttonVariants({ size: "sm" })}
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
