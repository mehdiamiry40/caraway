"use client";

import type { LucideIcon } from "lucide-react";
import { Banknote, ShieldCheck, Truck, Users } from "lucide-react";
import { BUSINESS, PRICE_RANGE_LABEL } from "@/lib/site";
import { useIntersectionVisibility } from "@/hooks/use-intersection-visibility";

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
  const [ref, inView] = useIntersectionVisibility<HTMLElement>({
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="relative bg-muted border-y border-border" aria-label="What to expect">
      <div className="site-container py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5">
          <FeatureStatCard stat={featureStat} inView={inView} />
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {supportingStats.map((stat, index) => (
              <SupportStatItem key={stat.label} stat={stat} index={index} inView={inView} />
            ))}
          </ul>
        </div>
        <div className="mt-7 sm:mt-9 pt-5 border-t border-border text-center text-xs sm:text-sm text-foreground/75 text-balance">
          <p>{BUSINESS.name} · ABN {BUSINESS.abn} · Brisbane-based vehicle buyer</p>
          <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground">
            Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureStatCard({ stat, inView }: { stat: StatDef; inView: boolean }) {
  const Icon = stat.icon;

  return (
    <article
      className={`relative lg:col-span-5 overflow-hidden bg-primary text-on-dark-hi p-6 sm:p-8 ring-1 ring-[hsl(var(--on-dark-hi)/0.1)] transition-opacity duration-700 ${
        inView ? "opacity-100" : "opacity-0"
      } motion-reduce:opacity-100`}
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

function SupportStatItem({ stat, index, inView }: { stat: StatDef; index: number; inView: boolean }) {
  const Icon = stat.icon;

  return (
    <li
      className={`group relative grid grid-cols-[2.5rem_1fr] gap-x-4 border border-border bg-card p-4 transition-[box-shadow,border-color,opacity,transform] duration-500 ease-[var(--ease-out-quint)] hover:border-primary/40 hover:shadow-md sm:flex sm:flex-col sm:p-5 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
      style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
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
