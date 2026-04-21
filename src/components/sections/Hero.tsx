"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LicensePlateInput } from "@/components/ui/LicensePlateInput";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const promises = [
  "Firm offer in 60 seconds",
  "Free pickup across Brisbane",
  "Cash on the spot",
];

export function Hero() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent("hero_cta_click", { target: "plate-submit" });
    const form = e.currentTarget;
    const input = form.elements.namedItem("plate") as HTMLInputElement | null;
    const target = document.getElementById("price-estimator");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (input) {
      try {
        sessionStorage.setItem("caraway_plate", input.value);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden wave-divider-bottom bg-primary text-on-dark-hi"
      aria-labelledby="hero-heading"
    >
      {/* decorative coloured shapes behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-16 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--accent)/0.22)] blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-[hsl(var(--cta)/0.18)] blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[hsl(var(--plate)/0.08)] blur-2xl" />
      </div>

      <div className="relative site-container mt-header-safe pt-10 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy column */}
          <div className="relative z-10 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--on-dark-hi)/0.12)] px-4 py-1.5 text-xs sm:text-sm font-bold text-on-dark-hi mb-6 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-cta" aria-hidden="true" />
              Brisbane&apos;s friendly car buyers
            </p>

            <h1
              id="hero-heading"
              className="font-display font-black text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[var(--tracking-display)] text-on-dark-hi text-balance"
            >
              Sell your car in{" "}
              <span className="hl-orange">3&nbsp;steps</span>
              <br />
              with <span className="hl-green">cash</span> on pickup.
            </h1>

            <p className="mt-6 max-w-xl text-on-dark-hi/85 leading-relaxed text-lg sm:text-xl">
              Drop in your plate, get a firm offer in under a minute, and
              we&apos;ll drive to you — any make, model or condition.
            </p>

            {/* Plate input + CTA */}
            <form
              onSubmit={onSubmit}
              className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl"
              aria-label="Start your cash quote"
            >
              <LicensePlateInput
                name="plate"
                aria-label="Your number plate"
                placeholder="123 ABC"
                className="sm:flex-1"
              />
              <button
                type="submit"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group sm:w-auto px-8",
                )}
              >
                Check my car
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </form>

            <Link
              href="/#price-estimator"
              onClick={() => trackEvent("hero_cta_click", { target: "no-plate" })}
              className="mt-3 inline-flex items-center text-sm text-on-dark-hi/70 hover:text-on-dark-hi underline underline-offset-4 decoration-on-dark-hi/40"
            >
              No plate? Quote by make &amp; model instead
            </Link>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {promises.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2 text-[0.9375rem] font-medium text-on-dark-hi/90"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta text-cta-foreground">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero image column */}
          <div className="relative z-10 lg:col-span-5">
            <HeroArt />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* orange floating tag (price) */}
      <div className="absolute -top-4 right-2 sm:-top-6 sm:-right-2 rotate-[-6deg] z-20 rounded-2xl bg-accent text-accent-foreground px-5 py-3 shadow-xl ring-1 ring-[hsl(var(--accent)/0.3)]">
        <span className="block text-[0.6875rem] uppercase tracking-[0.08em] font-bold opacity-85">
          Top offer
        </span>
        <span className="block font-display font-black text-2xl tabular-nums leading-none mt-1">
          $9,999
        </span>
      </div>

      {/* green floating tag (time) */}
      <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 rotate-[4deg] z-20 rounded-2xl bg-cta text-cta-foreground px-5 py-3 shadow-xl ring-1 ring-[hsl(var(--cta)/0.4)]">
        <span className="block text-[0.6875rem] uppercase tracking-[0.08em] font-bold opacity-90">
          Pickup
        </span>
        <span className="block font-display font-black text-lg leading-none mt-1">
          Same-day
        </span>
      </div>

      <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[2.5rem] overflow-hidden ring-4 ring-[hsl(var(--on-dark-hi)/0.18)] bg-plate shadow-[0_30px_80px_-20px_hsl(var(--ink-deep)/0.6)]">
        <Image
          src="/images/tow-truck-hero.webp"
          alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
          title="Caraway cash for cars Brisbane — free pickup"
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 80vw, 540px"
          className="object-cover"
          priority
          fetchPriority="high"
        />
        {/* warm overlay so the plate-yellow ring picks up beneath */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/0.4)] via-transparent to-transparent"
        />
      </div>
    </div>
  );
}
