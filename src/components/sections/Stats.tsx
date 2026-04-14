"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Banknote, ShieldCheck, Truck, Users } from "lucide-react";
import { PRICE_RANGE_LABEL } from "@/lib/site";

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
}

const stats: StatDef[] = [
  { value: "Local", label: "Brisbane team — reach us by phone, not a call centre", icon: Users },
  { value: "Insured", label: "Full coverage on pickups we arrange", icon: ShieldCheck },
  { value: PRICE_RANGE_LABEL, label: "Cash range we pay", icon: Banknote },
  { value: "24–48h", label: "Pickup usually same- or next-day — subject to truck availability", icon: Truck },
];

const ANIMATION_DURATION = 1000;

function useCountUp(target: number | undefined, decimals: number, started: boolean) {
  const [value, setValue] = useState<number | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!started || target === undefined) return;

    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

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
  }, [started, target, decimals]);

  return value;
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-muted border-b border-border/40" aria-label="What to expect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} inView={inView} />
          ))}
        </div>
        <div className="mt-6 sm:mt-10 pt-5 sm:pt-8 border-t border-border/60 text-center text-xs sm:text-sm text-muted-foreground text-balance">
          <p>Caraway Pty Ltd · ABN 62 351 619 456 · Fully insured pickups · Brisbane, QLD</p>
          <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground">
            Seller stories on this page are shared with permission and are not a full survey of every pickup.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, index, inView }: { stat: StatDef; index: number; inView: boolean }) {
  const Icon = stat.icon;
  const animatedValue = useCountUp(stat.animateTo, stat.decimals ?? 0, inView);

  const displayValue = stat.animateTo !== undefined && animatedValue !== null
    ? `${animatedValue.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`
    : stat.value;

  return (
    <div
      className="group relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4"
    >
      {index > 0 && (
        <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 h-10 w-px bg-border" aria-hidden />
      )}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border border-border/60 group-hover:border-primary/30 transition-colors duration-300">
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p
          className={`text-base sm:text-xl font-display font-bold text-primary leading-tight transition-opacity duration-700 ${
            inView ? "opacity-100" : "opacity-0"
          } motion-reduce:opacity-100`}
        >
          {displayValue}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-snug text-balance">
          {stat.label}
        </p>
      </div>
    </div>
  );
}
