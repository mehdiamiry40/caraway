import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CarFront,
  FileCheck2,
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

const pathways = [
  {
    icon: BadgeDollarSign,
    label: "Get a cash quote",
    description: "A clear estimate from four quick details.",
    href: "/#price-estimator",
  },
  {
    icon: Truck,
    label: "Arrange free pickup",
    description: "Coverage across Greater Brisbane.",
    href: "/locations",
  },
  {
    icon: FileCheck2,
    label: "Understand the process",
    description: "Simple guidance from quote to collection.",
    href: "/how-it-works",
  },
  {
    icon: CarFront,
    label: "Sell any condition",
    description: "Running, damaged, old, or unregistered.",
    href: "/cash-for-cars-brisbane",
  },
] as const;

export function TrustBadges() {
  return (
    <section className="section-y bg-background" aria-labelledby="help-heading">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">Your next step</p>
            <h2
              id="help-heading"
              className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-display text-primary"
            >
              What can we help you with?
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-foreground/70 lg:col-span-5 lg:text-lg">
            Start with the option that matches what you need. Every path leads
            to clear information and a simple next action.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map(({ icon: Icon, label, description, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="group flex h-full min-h-56 flex-col rounded-[1.5rem] border border-border/80 bg-card p-6 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-8 font-display text-xl font-semibold text-primary">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {description}
                </p>
                <ArrowRight
                  className="mt-auto h-10 w-5 pt-5 text-accent-ink transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border/70 pt-6">
          {credentials.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
