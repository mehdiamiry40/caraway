import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const promises = [
  "Firm offer in 60 seconds",
  "Free pickup across Brisbane",
  "Cash on the spot",
];

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden wave-divider-bottom bg-primary text-on-dark-hi"
      aria-labelledby="hero-heading"
    >
      <div className="relative site-container mt-header-safe pt-10 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy column */}
          <div className="relative z-10 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--on-dark-hi)/0.12)] px-4 py-1.5 text-xs sm:text-sm font-medium text-on-dark-hi mb-6 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-cta" aria-hidden="true" />
              Brisbane&apos;s friendly car buyers
            </p>

            <h1
              id="hero-heading"
              className="font-display font-semibold text-[clamp(2.75rem,6.25vw,5rem)] leading-[0.98] tracking-[var(--tracking-display)] text-on-dark-hi text-balance"
            >
              Sell Your Car Today
              <br />
              in <span className="hl-green">Brisbane</span>
            </h1>

            <p className="mt-6 max-w-xl text-on-dark-hi/85 leading-relaxed text-lg sm:text-xl font-light">
              Tell us your make and model, get a fair offer in under a minute,
              and we&apos;ll drive to you — any condition.
            </p>
            <p className="mt-3 max-w-xl text-on-dark-hi/72 leading-relaxed text-sm sm:text-base">
              Selected vehicles may receive up to $9,999. Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl">
              <Link
                href="/#price-estimator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group w-full sm:w-auto px-8",
                )}
              >
                Get my quote
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

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
      <span className="sr-only">
        Selected vehicles may receive offers up to $9,999 with same- or next-day pickup.
      </span>
      {/* orange floating tag (price) — decorative; nearby copy explains that the top figure applies to selected vehicles */}
      <div
        aria-hidden="true"
        className="absolute -top-4 right-2 sm:-top-6 sm:-right-2 rotate-[-6deg] z-20 rounded-2xl bg-accent text-accent-foreground px-5 py-3 shadow-xl ring-1 ring-[hsl(var(--accent)/0.3)]"
      >
        <span className="block text-[0.6875rem] uppercase tracking-[0.08em] font-medium opacity-85">
          Selected
        </span>
        <span className="block font-display font-semibold text-2xl tabular-nums leading-none mt-1">
          $9,999
        </span>
      </div>

      {/* green floating tag (time) — decorative; same-day pickup is covered in the promises list */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 rotate-[4deg] z-20 rounded-2xl bg-cta text-cta-foreground px-5 py-3 shadow-xl ring-1 ring-[hsl(var(--cta)/0.4)]"
      >
        <span className="block text-[0.6875rem] uppercase tracking-[0.08em] font-medium opacity-90">
          Pickup
        </span>
        <span className="block font-display font-semibold text-lg leading-none mt-1">
          Same-day
        </span>
      </div>

      <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[2.5rem] overflow-hidden ring-4 ring-[hsl(var(--on-dark-hi)/0.18)] bg-plate shadow-[0_30px_80px_-20px_hsl(var(--ink-deep)/0.6)]">
        <Image
          src="/images/tow-truck-hero.webp"
          alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
          title="Caraway cash for cars Brisbane — free pickup"
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 75vw, 560px"
          className="object-cover"
          priority
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
