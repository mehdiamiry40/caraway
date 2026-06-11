import type { LucideIcon } from "lucide-react";
import { Banknote, CalendarCheck, FileCheck2, MapPinned, ShieldCheck } from "lucide-react";
import { BUSINESS, PRICE_RANGE_LABEL } from "@/lib/site";

interface StatDef {
  value: string;
  label: string;
  icon: LucideIcon;
}

const featureStat: StatDef = {
  value: PRICE_RANGE_LABEL,
  label:
    "Actual offers depend on condition, completeness, location, demand, and current market value.",
  icon: Banknote,
};

const supportingStats: StatDef[] = [
  {
    value: "SE Queensland",
    label: "Brisbane, Logan, Ipswich, Redlands, and Moreton Bay coverage",
    icon: MapPinned,
  },
  {
    value: "Confirmed pickup",
    label: "Timing, access notes, operator, and handover sequence agreed before collection",
    icon: ShieldCheck,
  },
  {
    value: "Same- or next-day",
    label: "Available in most metro areas, subject to truck scheduling",
    icon: CalendarCheck,
  },
  {
    value: "Clean records",
    label: "Buyer details and payment confirmation kept clear for your records",
    icon: FileCheck2,
  },
];

export function Stats() {
  return (
    <section className="relative border-y border-border bg-muted" aria-label="What to expect">
      <div className="site-container py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <FeatureStatCard stat={featureStat} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
            {supportingStats.map((stat) => (
              <SupportStatItem key={stat.label} stat={stat} />
            ))}
          </ul>
        </div>
        <div className="mt-7 border-t border-border pt-5 text-center text-xs text-foreground/75 text-balance sm:mt-9 sm:text-sm">
          <p>
            {BUSINESS.name} - ABN {BUSINESS.abn} - Brisbane-based vehicle buyer
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-[11px]">
            Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureStatCard({ stat }: { stat: StatDef }) {
  const Icon = stat.icon;

  return (
    <article
      className="relative overflow-hidden bg-primary p-6 text-on-dark-hi ring-1 ring-[hsl(var(--on-dark-hi)/0.1)] sm:p-8 lg:col-span-5"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-cta" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[hsl(var(--on-dark-hi)/0.12)] ring-1 ring-[hsl(var(--on-dark-hi)/0.18)] text-on-dark-hi">
            <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-dark-hi/70">
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
      className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 border border-border bg-card p-4 transition-[box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:border-primary/40 hover:shadow-card-hover sm:p-5"
    >
      <span className="row-span-2 flex h-10 w-10 items-center justify-center bg-cta/15 text-cta-ink transition-colors duration-300 group-hover:bg-cta/25">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="font-display text-base leading-tight text-primary sm:text-lg">
        {stat.value}
      </p>
      <p className="mt-1 text-xs font-medium leading-snug text-foreground/75 sm:mt-1.5 sm:text-sm">
        {stat.label}
      </p>
    </li>
  );
}
