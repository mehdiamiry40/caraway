import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Estimate from four details",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
] as const;

export function Hero() {
  return (
    <section
      data-chat-launcher-suppress="true"
      data-sticky-cta-suppress="true"
      className="mt-header-safe bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-[96rem] p-2 sm:p-3 lg:p-2">
        <div className="grid gap-2 lg:min-h-[40rem] lg:grid-cols-12">
          <div className="relative overflow-hidden bg-ink-deep sm:min-h-[38rem] lg:col-span-8 lg:min-h-[40rem]">
            <div className="relative h-72 sm:absolute sm:inset-0 sm:h-auto">
              <Image
                src="/images/tow-truck-hero.avif"
                alt="Tilt-tray truck carrying a silver sedan"
                fill
                preload
                sizes="(max-width: 1023px) 100vw, 67vw"
                className="object-cover object-[44%_center]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink-deep/45 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="relative m-2 bg-ink-deep/95 p-6 text-on-dark-hi backdrop-blur-[2px] sm:absolute sm:bottom-8 sm:left-8 sm:right-auto sm:m-0 sm:w-[min(39rem,calc(100%-4rem))] sm:p-9 lg:bottom-10 lg:left-10 lg:p-10">
              <p className="eyebrow-on-dark mb-5">Brisbane vehicle buyer</p>
              <h1
                id="hero-heading"
                className="font-display text-[clamp(2.65rem,5vw,4.4rem)] font-bold leading-[1.01] tracking-display text-on-dark-hi text-pretty"
              >
                A clearer way to sell your car.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-dark-hi/82 sm:text-lg">
                Get an estimate, a confirmed offer, and pickup included when we buy across Greater Brisbane.
              </p>

              <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ size: "lg" }), "group px-8 sm:h-14 sm:px-7")}
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-on-dark-hi underline decoration-cta/75 underline-offset-4 transition-colors hover:text-cta-bright sm:justify-start"
                  ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                  {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
            <article className="relative flex min-h-[19rem] flex-col justify-between overflow-hidden bg-primary p-7 text-on-dark-hi sm:p-8 lg:min-h-0 lg:p-9">
              <span className="absolute right-6 top-4 font-mono text-6xl font-semibold tracking-[-0.08em] text-on-dark-hi/10" aria-hidden="true">
                01
              </span>
              <div className="relative">
                <p className="eyebrow-on-dark">Start with the essentials</p>
                <h2 className="mt-6 max-w-sm font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.04] tracking-tight text-on-dark-hi">
                  Four details.<br />One useful estimate.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-dark-hi/78">
                  Tell us the make, model, year, and condition. We&apos;ll review the rest with you.
                </p>
              </div>
              <Link
                href="/#quote-form"
                className="group relative mt-7 flex min-h-12 items-center justify-between border-t border-[hsl(var(--on-dark-hi)/0.24)] pt-5 text-sm font-semibold text-on-dark-hi"
              >
                Start my quote
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>

            <article className="relative flex min-h-[19rem] flex-col justify-between overflow-hidden border border-border bg-muted p-7 sm:p-8 lg:min-h-0 lg:p-9">
              <span className="absolute right-6 top-4 font-mono text-6xl font-semibold tracking-[-0.08em] text-primary/8" aria-hidden="true">
                02
              </span>
              <div className="relative">
                <p className="eyebrow">Local pickup</p>
                <h2 className="mt-6 max-w-sm font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.04] tracking-tight text-foreground">
                  Greater Brisbane,<br />covered clearly.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  We confirm availability from your exact address, vehicle, access details, and collection schedule.
                </p>
              </div>
              <Link
                href="/locations"
                className="group relative mt-7 flex min-h-12 items-center justify-between border-t border-border pt-5 text-sm font-semibold text-primary"
              >
                Check your area
                <MapPin className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>

        <ul className="mt-2 grid border border-border bg-card sm:grid-cols-3" aria-label="Caraway service promises">
          {promises.map((promise, index) => (
            <li
              key={promise}
              className="flex min-h-16 items-center gap-3 border-b border-border px-5 text-sm font-semibold text-foreground/82 last:border-b-0 sm:min-h-20 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0"
            >
              <span className="font-mono text-[0.625rem] text-muted-foreground" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {promise}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
