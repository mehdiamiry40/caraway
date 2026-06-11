import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CarFront,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Recycle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/site";

const credentials = [
  { icon: ShieldCheck, label: "Collection terms confirmed" },
  { icon: Recycle, label: "Recycling pathways considered" },
  { icon: Building2, label: `ABN ${BUSINESS.abn}` },
] as const;

const quickLinks = [
  {
    icon: BadgeDollarSign,
    label: "Quote",
    description: "Four details produce an initial valuation range.",
    href: "/#price-estimator",
  },
  {
    icon: Truck,
    label: "Pickup",
    description: "Timing, access, and truck availability confirmed before collection.",
    href: "/locations",
  },
  {
    icon: FileCheck2,
    label: "Records",
    description: "Buyer details, payment sequence, and handover steps kept clear.",
    href: "/faq",
  },
  {
    icon: CarFront,
    label: "Vehicle fit",
    description: "Running, damaged, old, unregistered, fleet, or incomplete vehicles.",
    href: "/cash-for-cars-brisbane",
  },
] as const;

export function TrustBadges() {
  return (
    <section
      className="relative border-b border-border/70 bg-background"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">Operating standards</p>
            <h2 className="max-w-xl font-display text-2xl font-bold leading-[1.12] text-primary text-balance sm:text-3xl md:text-[2.35rem]">
              A cleaner sale, with the handover details accounted for.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/78 sm:text-lg">
              Caraway is built around direct buying, clear pickup coordination, and payment
              before the vehicle leaves your property.
            </p>
            <ul className="mt-6 grid gap-2.5">
              {credentials.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground/78"
                >
                  <Icon size={17} strokeWidth={2.2} className="text-accent-ink" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-border bg-card p-5 sm:p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-secondary text-primary">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary sm:text-xl">
                    Local service across Greater Brisbane
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Same- or next-day pickup is available in most areas, subject to truck
                    availability.
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-cta-ink">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Brisbane-based buyer
                  </p>
                </div>
              </div>
              <Link
                href="/locations"
                className="mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:mt-0"
              >
                Check your area
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {quickLinks.map(({ icon: Icon, label, description, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group grid h-full min-h-0 grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 border border-border bg-card p-4 transition-[border-color,box-shadow] hover:border-primary hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-36 sm:p-5"
                  >
                    <Icon className="row-span-2 h-9 w-9 text-primary" strokeWidth={1.6} aria-hidden="true" />
                    <h3 className="font-display text-base font-semibold text-primary">{label}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground sm:mt-1">
                      {description}
                    </p>
                    <ArrowRight
                      className="row-span-2 h-4 w-4 text-accent-ink transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
