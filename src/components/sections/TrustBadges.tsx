import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CarFront,
  FileCheck2,
  MapPin,
  Star,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

/* Icon tiles carry one short label each; the linked pages hold the detail. */
const quickLinks = [
  { icon: BadgeDollarSign, label: "Get an assessment", href: "/#quote-form" },
  { icon: Truck, label: "Pickup when we buy", href: "/car-removal-brisbane" },
  { icon: FileCheck2, label: "Simple paperwork", href: "/faq" },
  { icon: CarFront, label: "Any condition", href: "/cash-for-cars-brisbane" },
] as const;

const linkClass =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-primary link-underline";

export function TrustBadges() {
  return (
    <section
      className="relative border-b border-border/70 bg-background"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-9 sm:py-12">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link
                href={href}
                prefetch={href === "/#quote-form" ? false : undefined}
                className="group flex h-full flex-col items-center gap-3 border border-border bg-card px-3 py-6 text-center hover:border-primary/60 card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:py-8"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-16 sm:w-16">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-semibold leading-snug text-primary sm:text-base">
                  {label}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-accent-ink transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-border pt-4 text-sm">
          <Link href="/locations" className={linkClass}>
            <MapPin className="h-4 w-4 text-accent-ink" aria-hidden="true" />
            Check your area
          </Link>
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="View Caraway on Google"
            location="homepage_trust"
            className={linkClass}
          >
            <Star className="h-4 w-4 text-accent-ink" aria-hidden="true" />
            View Caraway on Google
          </TrackedOutboundLink>
          <TrackedOutboundLink
            href={BUSINESS.abrUrl}
            label={`Verify ABN ${BUSINESS.abn}`}
            location="homepage_trust"
            className={linkClass}
          >
            <Building2 className="h-4 w-4 text-accent-ink" aria-hidden="true" />
            ABN {BUSINESS.abn}
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}
