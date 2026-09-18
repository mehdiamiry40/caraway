import Link from "next/link";
import { ArrowRight, Building2, FileCheck2, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const services = [
  {
    label: "Cash for cars Brisbane",
    description:
      "A direct vehicle assessment for running, damaged, old, high-kilometre, or unregistered cars.",
    href: "/cash-for-cars-brisbane",
  },
  {
    label: "Car removal Brisbane",
    description:
      "Collection arranged across Greater Brisbane, with pickup included when Caraway buys.",
    href: "/car-removal-brisbane",
  },
] as const;

const credentials = [
  { icon: ShieldCheck, label: "Pickup terms confirmed" },
  { icon: FileCheck2, label: "Buyer details provided" },
  { icon: Building2, label: `ABN ${BUSINESS.abn}` },
] as const;

export function TrustBadges() {
  return (
    <section
      className="border-y border-border bg-background py-16 lg:py-20"
      aria-label="Caraway services and credentials"
    >
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
          <div>
            <p className="t-index text-accent-ink">Brisbane services</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Choose the help you need with your car.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground lg:justify-self-end">
            Start with the service that best matches your situation. Both begin
            with a free, no-obligation enquiry and clear pickup terms.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.href}
              href={service.href}
              className="group flex h-full flex-col border border-accent/25 bg-secondary p-7 transition hover:border-accent sm:p-9"
            >
              <span className="font-mono text-xs font-semibold text-accent-ink">
                0{index + 1}
              </span>
              <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent-ink">
                {service.label}
              </h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 font-semibold text-accent-ink underline underline-offset-4">
                Learn about this service
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {credentials.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                <Icon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <TrackedOutboundLink
              href={BUSINESS.googleBusinessUrl}
              label="View Caraway on Google"
              location="homepage_trust"
              className="font-semibold text-primary underline underline-offset-4 hover:text-accent-ink"
            >
              View Caraway on Google
            </TrackedOutboundLink>
            <TrackedOutboundLink
              href={BUSINESS.abrUrl}
              label={`Verify ABN ${BUSINESS.abn}`}
              location="homepage_trust"
              className="font-semibold text-primary underline underline-offset-4 hover:text-accent-ink"
            >
              Verify our ABN
            </TrackedOutboundLink>
          </div>
        </div>
      </div>
    </section>
  );
}
