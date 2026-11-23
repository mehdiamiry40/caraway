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
  "inline-flex min-h-11 items-center gap-2 font-semibold text-foreground underline decoration-cta decoration-2 underline-offset-[5px] transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function TrustBadges() {
  return (
    <section
      className="relative border-b border-border bg-secondary"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-8 sm:py-10">
        <ul className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <li key={label} className="bg-card">
              <Link
                href={href}
                prefetch={href === "/#quote-form" ? false : undefined}
                className="group flex h-full flex-col items-start gap-3 p-4 transition-colors duration-200 hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-4 sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="font-display text-xl font-bold leading-[1.1] text-foreground transition-colors group-hover:text-on-dark-hi sm:text-[1.375rem]">
                  {label}
                </span>
                <ArrowRight
                  className="ml-auto hidden h-5 w-5 shrink-0 text-foreground/40 transition-[transform,color] group-hover:translate-x-1 group-hover:text-cta-bright sm:block"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[0.9375rem]">
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
