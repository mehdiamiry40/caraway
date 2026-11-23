import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Human-reviewed vehicle assessment",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
];

/**
 * Flatbed photo behind the whole hero, darkened so the copy and the quote card
 * stay readable. Purely decorative — the copy carries the meaning. Small
 * screens get the square crop, wide screens the landscape one.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet="/images/hero-flatbed-wide.avif"
          type="image/avif"
        />
        <source
          media="(min-width: 1024px)"
          srcSet="/images/hero-flatbed-wide.webp"
          type="image/webp"
        />
        <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
        <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
        <img
          src="/images/tow-truck-hero.webp"
          alt=""
          width={800}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[35%_40%] lg:-scale-x-100 lg:object-[0%_60%]"
        />
      </picture>
      <div className="absolute inset-0 bg-ink/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink lg:from-30% lg:via-ink/75 lg:via-60% lg:to-ink/35" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}

export function Hero() {
  return (
    // The hero carries the quote form, so the whole block is one suppress
    // region: the sticky mobile CTA and chat launcher stay hidden until the
    // form is off screen.
    <div data-chat-launcher-suppress="true" data-sticky-cta-suppress="true">
      <section
        className="relative isolate w-full overflow-hidden bg-ink text-on-dark-hi"
        aria-labelledby="hero-heading"
      >
        <HeroBackdrop />

        <div className="mt-header-safe site-container grid grid-cols-1 items-center gap-10 pb-12 pt-9 sm:pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="eyebrow-on-dark">Brisbane-based car buyer</p>

            {/* "Cash for Cars Brisbane" stays one unbroken run of text for
                search. The width cap makes it wrap after "Cars", and the first
                line takes the yellow. */}
            <h1
              id="hero-heading"
              className="display-impact mt-5 text-[clamp(2.75rem,13vw,4.75rem)] text-on-dark-hi sm:text-[5.5rem] xl:text-[6.5rem]"
            >
              <span className="block max-w-[8em] first-line:text-cta-bright">
                Cash for Cars Brisbane,
              </span>{" "}
              <span className="mt-3 block text-[0.4em] font-bold normal-case leading-[1.1] tracking-normal text-on-dark-hi">
                without the runaround.
              </span>
            </h1>

            <p className="mt-6 max-w-[36rem] text-base leading-7 text-on-dark sm:text-lg sm:leading-8">
              Request an assessment in minutes. Caraway is a Brisbane-based car
              buyer: you get a written offer before anything is booked, pickup
              is included when we buy, and payment is confirmed at collection.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {promises.map((promise) => (
                <li
                  key={promise}
                  className="flex items-center gap-2.5 text-[0.9375rem] font-medium leading-5 text-on-dark-hi"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                    <Check size={13} strokeWidth={3.5} aria-hidden="true" />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              {/* On wide screens the form sits beside this copy, so the jump
                  link is only needed where the form is further down. */}
              <Link
                href="#quote-form"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto lg:hidden")}
              >
                Get my quote
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>

              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="hero"
                className="group inline-flex min-h-12 items-center gap-3 text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-cta text-cta-bright transition-colors group-hover:bg-cta group-hover:text-cta-foreground">
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-on-dark">
                    or call
                  </span>
                  <span className="mt-1 font-display text-[2rem] font-extrabold leading-none tracking-[0.02em]">
                    {BUSINESS.phoneDisplay}
                  </span>
                </span>
              </TrackedPhoneLink>

              <Link
                href="/how-it-works"
                className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-on-dark-hi underline decoration-cta decoration-2 underline-offset-[6px] transition-colors hover:text-cta-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                How it works
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* The quote card is the home page's only quote surface: it is
              server-rendered with the page, so the primary conversion path and
              the #quote-form deep link still work for crawlers and JS-off
              users. */}
          <div className="lg:col-span-5">
            <div
              id="quote-form"
              className="relative mx-auto w-full max-w-[32rem] scroll-mt-header bg-card text-card-foreground shadow-[0_30px_70px_-20px_hsl(var(--ink-deep)/0.85)] lg:ml-auto lg:mr-0"
            >
              <div aria-hidden="true" className="hazard-stripe h-2" />
              <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
                <HeroQuoteForm />
                <p className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
                  Brisbane-based · ABN {BUSINESS.abn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
