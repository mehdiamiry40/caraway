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
  { icon: CarFront, label: "Any condition", href: "/damaged-cars-brisbane" },
] as const;

const linkClass =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-accent-ink link-underline";

export function TrustBadges() {
  return (
    <section
      className="relative bg-background"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-16 sm:py-20">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link
                href={href}
                prefetch={href === "/#quote-form" ? false : undefined}
                className="group flex h-full flex-col items-center justify-center gap-4 px-3 py-8 text-center opacity-85 grayscale transition-opacity duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:py-12"
              >
                <Icon className="h-14 w-14 text-foreground sm:h-16 sm:w-16" strokeWidth={1.25} aria-hidden="true" />
                <span className="font-display text-lg font-medium leading-snug text-foreground sm:text-xl">
                  {label}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-foreground/60 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 border-t border-border pt-6 text-[0.9375rem]">
          <Link href="/locations" className={linkClass}>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Check your area
          </Link>
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="View Caraway on Google"
            location="homepage_trust"
            className={linkClass}
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            View Caraway on Google
          </TrackedOutboundLink>
          <TrackedOutboundLink
            href={BUSINESS.abrUrl}
            label={`Verify ABN ${BUSINESS.abn}`}
            location="homepage_trust"
            className={linkClass}
          >
            <Building2 className="h-4 w-4" aria-hidden="true" />
            ABN {BUSINESS.abn}
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}
