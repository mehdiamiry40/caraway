import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  { icon: ClipboardCheck, label: "Written offer before pickup" },
  { icon: ShieldCheck, label: "Collection details confirmed" },
  { icon: BadgeCheck, label: "Payment before the vehicle leaves" },
] as const;

const operatingDetails: Array<{
  value: string;
  label: string;
  icon: LucideIcon;
  tone?: "accent";
}> = [
  { value: "7 days", label: "Quotes and booking support", icon: CalendarClock },
  { value: "Free pickup", label: "Across Greater Brisbane", icon: MapPin, tone: "accent" },
  { value: "Direct buyer", label: `ABN ${BUSINESS.abn}`, icon: BadgeCheck },
];

export function Hero() {
  return (
    <>
      <section
        className="relative isolate w-full overflow-hidden bg-ink text-on-dark-hi"
        aria-labelledby="hero-heading"
      >
        <div className="mt-header-safe relative hero-viewport">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tow truck transporting a car for vehicle pickup in Brisbane"
            fill
            sizes="100vw"
            className="object-cover object-[42%_50%]"
            priority
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--ink-deep)/0.94)_0%,hsl(var(--ink-deep)/0.84)_38%,hsl(var(--ink-deep)/0.48)_68%,hsl(var(--ink-deep)/0.24)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(0deg,hsl(var(--ink-deep)/0.86)_0%,transparent_36%)]"
            aria-hidden="true"
          />

          <div className="site-container relative z-10 flex min-h-[inherit] items-center py-9 sm:py-12 lg:py-14">
            <div className="max-w-4xl">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-cta-bright sm:mb-5 sm:text-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Brisbane cash for cars
              </p>

              <h1
                id="hero-heading"
                className="max-w-[60rem] font-display text-[clamp(2.55rem,6vw,5rem)] font-bold leading-[0.98] tracking-display text-on-dark-hi text-balance"
              >
                Cash for cars Brisbane, handled properly.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-dark-hi/90 sm:mt-6 sm:text-xl">
                Get a clear cash offer, booked pickup across Greater Brisbane, and payment
                confirmed before your vehicle leaves.
              </p>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-on-dark-hi/72 sm:text-sm">
                Offers depend on make, model, condition, location, completeness, and current
                demand.
              </p>

              <div className="mt-7 flex max-w-2xl flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/#price-estimator"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group w-full px-8 shadow-[0_14px_34px_hsl(var(--cta)/0.22)] sm:w-auto",
                  )}
                >
                  Get my quote
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <TrackedPhoneLink
                  href={BUSINESS.phoneTel}
                  location="hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-2 text-sm font-medium text-on-dark-hi/90 underline decoration-cta/70 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-cta sm:px-0 sm:text-[0.9375rem]"
                  ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                or call {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
              </div>

              <p className="mt-5 text-sm font-semibold leading-relaxed text-on-dark-hi/90 sm:hidden">
                Written offer. Confirmed pickup. Payment before the vehicle leaves.
              </p>

              <ul className="mt-7 hidden max-w-2xl gap-2.5 sm:mt-8 sm:grid sm:grid-cols-3">
                {promises.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-start gap-2 border border-on-dark-hi/16 bg-on-dark-hi/8 px-3 py-3 text-sm font-semibold leading-5 text-on-dark-hi/92 backdrop-blur-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-cta-bright">
                      <Icon size={16} strokeWidth={2.3} aria-hidden="true" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-on-dark-hi/14 bg-ink-deep text-on-dark-hi"
        aria-label="Caraway operating details"
      >
        <div className="site-container grid gap-0 sm:grid-cols-3">
          {operatingDetails.map(({ icon: Icon, label, tone, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 border-on-dark-hi/12 py-4 sm:border-l sm:px-5 sm:first:border-l-0"
            >
              <Icon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 text-cta-bright",
                  tone === "accent" && "text-accent-on-dark",
                )}
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-base font-semibold leading-tight text-on-dark-hi">
                  {value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-on-dark-hi/72">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
