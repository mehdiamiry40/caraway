import type { LucideIcon } from "lucide-react";
import { Banknote, ShieldCheck, Truck, Users } from "lucide-react";
import { BUSINESS, PRICE_RANGE_LABEL } from "@/lib/site";

interface StatDef {
  value: string;
  label: string;
  icon: LucideIcon;
  /** Optional emphasis tone — only the featured stat uses this. */
  feature?: boolean;
}

const featureStat: StatDef = {
  value: PRICE_RANGE_LABEL,
  label:
    "Actual offers depend on condition, completeness, location, demand, and current market value.",
  icon: Banknote,
  feature: true,
};

const supportingStats: StatDef[] = [
  { value: "Local team", label: "Reach a Brisbane buyer by phone — not a call centre", icon: Users },
  { value: "Pickup details", label: "Operator, timing, access, and applicable cover confirmed before collection", icon: ShieldCheck },
  { value: "Same- or next-day", label: "Usually same- or next-day pickup, subject to truck availability", icon: Truck },
];

export function Stats() {
  return (
    <section className="relative bg-muted border-y border-border" aria-label="What to expect">
      <div className="site-container py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5">
          <FeatureStatCard stat={featureStat} />
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {supportingStats.map((stat) => (
              <SupportStatItem key={stat.label} stat={stat} />
            ))}
          </ul>
        </div>
        {/* The offer-varies detail is already on the feature card above; this
            strip is just the identity line. */}
        <div className="mt-7 sm:mt-9 pt-5 border-t border-border text-center text-xs sm:text-sm text-foreground/75 text-balance">
          <p>{BUSINESS.name} · ABN {BUSINESS.abn} · Brisbane-based vehicle buyer</p>
        </div>
      </div>
    </section>
  );
}

function FeatureStatCard({ stat }: { stat: StatDef }) {
  const Icon = stat.icon;

  return (
    <article
      className="relative lg:col-span-5 overflow-hidden bg-primary text-on-dark-hi p-6 sm:p-8 ring-1 ring-[hsl(var(--on-dark-hi)/0.1)]"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-cta" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[hsl(var(--on-dark-hi)/0.12)] ring-1 ring-[hsl(var(--on-dark-hi)/0.18)] text-on-dark-hi">
            <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-dark-hi/80">
            Cash payouts
          </p>
        </div>
        <p className="mt-5 font-display text-2xl sm:text-3xl leading-tight text-on-dark-hi">
          {stat.value}
        </p>
        <p className="mt-3 max-w-md text-sm sm:text-[0.9375rem] leading-relaxed text-on-dark-hi/85">
          {stat.label}
        </p>
      </div>
    </article>
  );
}

function SupportStatItem({ stat }: { stat: StatDef }) {
  const Icon = stat.icon;

  return (
    <li
      className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 border border-border bg-card p-4 transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-md sm:flex sm:flex-col sm:p-5"
    >
      <span className="row-span-2 flex h-10 w-10 items-center justify-center bg-cta/15 text-cta-ink transition-colors duration-300 group-hover:bg-cta/25">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="font-display text-base leading-tight text-primary sm:mt-4 sm:text-lg">
        {stat.value}
      </p>
      <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm text-foreground/75 leading-snug font-medium">
        {stat.label}
      </p>
    </li>
  );
}
