import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Phone, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Instant estimate in 60 seconds",
  "Free pickup across Brisbane",
  "Cash on the spot",
];

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-primary text-on-dark-hi"
      aria-labelledby="hero-heading"
    >
      <div className="mt-header-safe mx-auto max-w-[96rem]">
        <div className="grid min-h-[34rem] grid-cols-1 lg:grid-cols-12">
          <div className="relative order-2 min-h-[20rem] overflow-hidden sm:min-h-[28rem] lg:order-1 lg:col-span-7 lg:min-h-[34rem]">
            <Image
              src="/images/tow-truck-hero.webp"
              alt="Caraway tow truck collecting a customer's car in Brisbane"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink-deep/45 via-transparent to-transparent lg:hidden"
              aria-hidden="true"
            />
            <div
              className="hero-edge absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-b from-cta via-accent to-primary lg:block"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 order-1 flex items-center px-5 py-12 sm:px-8 sm:py-16 lg:order-2 lg:col-span-5 lg:px-12 xl:px-16">
            <div className="max-w-xl">
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-cta-bright sm:text-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Brisbane cash for cars
              </p>

              <h1
                id="hero-heading"
                className="font-display text-[clamp(2.45rem,4.5vw,4.25rem)] font-bold leading-[1.04] tracking-display text-on-dark-hi text-balance"
              >
                Sell your car.
                <br />
                We&apos;ll handle the rest.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark-hi/90 sm:text-lg">
                Get a clear cash offer, free pickup across Greater Brisbane, and payment before
                your vehicle leaves.
              </p>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-on-dark-hi/70 sm:text-sm">
                Offers depend on make, model, condition, location, completeness, and current
                demand.
              </p>

              <div className="mt-8 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
                <Link
                  href="/#price-estimator"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group w-full px-8 sm:w-auto",
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
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-on-dark-hi/90 underline decoration-cta/70 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-cta sm:text-[0.9375rem]"
                  ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                  or call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-center gap-2 text-sm font-semibold text-on-dark-hi/90"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>

              <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 border border-white/20 bg-white/8 px-3 py-2">
                <span className="star-row" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Star key={index} className="h-4 w-4 fill-current" strokeWidth={0} />
                  ))}
                </span>
                <span className="text-sm font-medium text-on-dark-hi">
                  Trusted by Brisbane sellers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
