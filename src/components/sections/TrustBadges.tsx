import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CarFront,
  FileCheck2,
  MapPin,
  Recycle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/site";

const credentials = [
  { icon: ShieldCheck, label: "Pickup terms confirmed" },
  { icon: Recycle, label: "Responsible recycling" },
  { icon: Building2, label: `ABN ${BUSINESS.abn}` },
] as const;

const quickLinks = [
  {
    icon: BadgeDollarSign,
    label: "Get a cash quote",
    description: "A clear estimate from four quick details.",
    href: "/#price-estimator",
  },
  {
    icon: Truck,
    label: "Free vehicle pickup",
    description: "Across Greater Brisbane.",
    href: "/locations",
  },
  {
    icon: FileCheck2,
    label: "Simple paperwork",
    description: "Clear guidance from quote to collection.",
    href: "/faq",
  },
  {
    icon: CarFront,
    label: "Any condition",
    description: "Running, damaged, old, or unregistered.",
    href: "/cash-for-cars-brisbane",
  },
] as const;

export function TrustBadges() {
  return (
    <section
      className="relative border-b border-border/70 bg-background"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-9 sm:py-14">
        <div className="border border-border bg-card p-5 sm:p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-secondary text-primary">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-primary sm:text-xl">
                Local service across Greater Brisbane
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Same- or next-day pickup is available in most areas, subject to truck
                availability.
              </p>
            </div>
          </div>
          <Link
            href="/locations"
            className="mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:mt-0"
          >
            Check your area
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {quickLinks.map(({ icon: Icon, label, description, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="group relative grid min-h-0 h-full grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-1 border border-border bg-card p-4 pr-10 transition-[border-color,box-shadow] hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex sm:min-h-40 sm:flex-col sm:items-start sm:p-5"
              >
                <Icon className="row-span-2 h-9 w-9 text-primary sm:h-10 sm:w-10" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="font-display text-base font-semibold leading-snug text-primary sm:mt-5">{label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:mt-1">{description}</p>
                <ArrowRight
                  className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-ink transition-transform group-hover:translate-x-1 sm:static sm:mt-auto sm:h-8 sm:translate-y-0 sm:pt-4"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border pt-5">
          {credentials.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              <Icon size={15} strokeWidth={2} className="text-accent-ink" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
