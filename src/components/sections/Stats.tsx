"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Banknote, ShieldCheck, Truck, Users } from "lucide-react";
import { PRICE_RANGE_LABEL } from "@/lib/site";
import { useIntersectionVisibility } from "@/hooks/use-intersection-visibility";

interface StatDef {
  value: string;
  label: string;
  icon: LucideIcon;
  /** Numeric target for count-up animation. Undefined = fade-in only. */
  animateTo?: number;
  /** Decimal places for the animated number. */
  decimals?: number;
  /** Suffix appended after the animated number. */
  suffix?: string;
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
  { value: "Fully insured", label: "Public liability and goods-in-transit cover on every pickup", icon: ShieldCheck },
  { value: "Same- or next-day", label: "Usually same- or next-day pickup, subject to truck availability", icon: Truck },
];

const ANIMATION_DURATION = 1000;

function useCountUp(target: number | undefined, decimals: number, started: boolean) {
  const [value, setValue] = useState<number | null>(null);
  const frameRef = useRef(0);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!started || target === undefined || prefersReducedMotion) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      // Ease-out cubic for a natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, target, decimals, prefersReducedMotion]);

  // Reduced-motion users skip the animation and see the final value directly.
  if (prefersReducedMotion && started && target !== undefined) return target;
  return value;
}

export function Stats() {
  const [ref, inView] = useIntersectionVisibility<HTMLElement>({
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="relative bg-muted border-y border-border" aria-label="What to expect">
      <div className="site-container py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <FeatureStatCard stat={featureStat} inView={inView} />
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {supportingStats.map((stat, index) => (
              <SupportStatItem key={stat.label} stat={stat} index={index} inView={inView} />
            ))}
          </ul>
        </div>
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-border text-center text-xs sm:text-sm text-foreground/75 text-balance">
          <p>Caraway Pty Ltd · ABN 62 351 619 456 · Fully insured pickups · Brisbane, QLD</p>
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
      className={`relative lg:col-span-5 overflow-hidden rounded-3xl bg-primary text-on-dark-hi p-7 sm:p-9 ring-1 ring-[hsl(var(--on-dark-hi)/0.1)] transition-opacity duration-700 ${
        inView ? "opacity-100" : "opacity-0"
      } motion-reduce:opacity-100`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[hsl(var(--cta)/0.25)] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[hsl(var(--accent)/0.22)] blur-3xl"
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--on-dark-hi)/0.14)] ring-1 ring-[hsl(var(--on-dark-hi)/0.18)] text-on-dark-hi">
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
  const animatedValue = useCountUp(stat.animateTo, stat.decimals ?? 0, inView);

  const displayValue = stat.animateTo !== undefined && animatedValue !== null
    ? `${animatedValue.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`
    : stat.value;

  return (
    <li
      className={`group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 sm:p-6 transition-[transform,box-shadow,border-color,opacity] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_8px_16px_hsl(var(--shadow-color)/0.08)] ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
      style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta/15 text-cta transition-colors duration-300 group-hover:bg-cta/25">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-base sm:text-lg leading-tight text-foreground">
        {displayValue}
      </p>
      <p className="mt-1.5 text-xs sm:text-sm text-foreground/75 leading-snug font-medium">
        {stat.label}
      </p>
    </li>
  );
}
