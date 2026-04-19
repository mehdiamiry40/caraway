import Image from "next/image";
import { CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { HeroCTAs } from "./HeroCTAs";
import { BUSINESS, PRICE_RANGE_LABEL } from "@/lib/site";

const highlights = [
  {
    icon: CheckCircle2,
    title: "Quoted before pickup",
    detail: "No last-minute haircut when the truck arrives.",
  },
  {
    icon: Clock3,
    title: "Fast response",
    detail: "Most quote requests are handled within the hour.",
  },
  {
    icon: MapPin,
    title: "Greater Brisbane coverage",
    detail: "Logan, Ipswich, Moreton Bay and nearby suburbs.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured operator",
    detail: "Professional pickups with paperwork handled clearly.",
  },
] as const;

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe min-h-hero [background:var(--hero-wash)]"
      aria-labelledby="hero-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero-mesh)] opacity-90" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow mb-5">
              Brisbane&apos;s trusted cash for cars buyer
            </p>

            <h1
              id="hero-heading"
              className="mb-5 break-words scroll-mt-[calc(4rem+env(safe-area-inset-top))] text-[2.4rem] font-display font-bold leading-[0.98] tracking-tight text-primary sm:text-5xl lg:text-[3.9rem]"
            >
              Sell your car fast.
              <br className="hidden sm:block" />
              <span className="text-accent"> Get paid on pickup.</span>
            </h1>

            <p className="mb-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:mb-8 sm:text-lg">
              Instant quote first, truck second. We buy running, damaged,
              scrap, and unregistered vehicles across Greater Brisbane with
              free pickup and same-day or next-day availability.
            </p>

            <HeroCTAs />

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="surface-card px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Typical range
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary">
                  {PRICE_RANGE_LABEL}
                </p>
              </div>
              <div className="surface-card px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pickup window
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary">
                  Same or next day
                </p>
              </div>
              <div className="surface-card px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Call hours
                </p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-primary">
                  {BUSINESS.hours}
                </p>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div
              aria-hidden="true"
              className="absolute inset-x-4 bottom-2 top-10 rounded-[2.5rem] bg-primary/12 blur-3xl"
            />

            <div className="surface-card relative overflow-hidden p-3 sm:p-4">
              <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] sm:min-h-[420px] lg:min-h-[540px]">
                <Image
                  src="/images/tow-truck-hero.webp"
                  alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
                  title="Caraway cash for cars Brisbane — free pickup"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <div className="surface-dark p-5 sm:p-6">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                      Why sellers choose Caraway
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {highlights.map(({ icon: Icon, title, detail }) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-sm"
                        >
                          <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                          <p className="mt-3 text-sm font-semibold tracking-tight text-primary-foreground">
                            {title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
