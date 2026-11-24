import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { BUSINESS } from "@/lib/site";

const promises = [
  "Human-reviewed vehicle assessment",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
];

/**
 * Caraway's own flatbed photo behind the whole hero, under a dark wash. The
 * wash is 80% opaque on phones and 75% on desktop, which keeps white text
 * above 7:1 even where the photo behind it is pure white sky. Purely decorative — the copy
 * carries the meaning. Small screens get the square crop, wide screens the
 * landscape one.
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
          className="h-full w-full object-cover object-[35%_40%] lg:object-[50%_55%]"
        />
      </picture>
      <div className="absolute inset-0 bg-ink/80 lg:bg-ink/75" />
    </div>
  );
}

/**
 * Home hero: a dark photo band with the headline and ticks on the left and
 * the quote form as a white card on the right. On phones the form follows the
 * ticks directly.
 */
export function Hero() {
  return (
    // The hero carries the quote form, so the whole block is one suppress
    // region: the sticky mobile CTA and chat launcher stay hidden until the
    // form is off screen.
    <div data-chat-launcher-suppress="true" data-sticky-cta-suppress="true">
      <section
        className="on-band relative isolate w-full overflow-hidden bg-ink text-on-dark-hi"
        aria-labelledby="hero-heading"
      >
        <HeroBackdrop />

        <div className="site-container grid grid-cols-1 gap-x-12 gap-y-8 pb-10 pt-8 sm:pb-12 sm:pt-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-14 lg:pt-12">
          <div className="lg:col-span-7 lg:pt-4">
            <p className="text-base font-bold text-on-dark-hi sm:text-lg">Brisbane-based car buyer</p>

            {/* "Cash for Cars Brisbane" stays one unbroken run of text for
                search. */}
            <h1
              id="hero-heading"
              className="type-display mt-2 max-w-[20ch] text-on-dark-hi after:mt-4 after:block after:h-1.5 after:w-40 after:rounded-full after:bg-primary after:content-['']"
            >
              <span>Cash for Cars Brisbane,</span>{" "}
              <span>without the runaround.</span>
            </h1>

            <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-on-dark-hi sm:text-lg">
              Request an assessment in minutes. Caraway is a Brisbane-based car
              buyer: you get a written offer before anything is booked, pickup
              is included when we buy, and payment is confirmed at collection.
            </p>

            <ul className="list-ticks mt-6 space-y-4 text-xl font-semibold text-on-dark-hi sm:text-[1.375rem]">
              {promises.map((promise) => (
                <li key={promise} className="!pl-10 before:!top-[0.02em] before:!h-7 before:!w-7 before:!rounded-md">
                  {promise}
                </li>
              ))}
            </ul>

            {/* The form follows on small screens, so this jump link is only
                offered to keyboard and screen-reader users there. */}
            <Link
              href="#quote-form"
              className="sr-only rounded-sm focus-visible:not-sr-only focus-visible:mt-4 focus-visible:inline-flex focus-visible:items-center focus-visible:gap-2 focus-visible:bg-cta focus-visible:px-4 focus-visible:py-2.5 focus-visible:font-bold focus-visible:text-cta-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink lg:hidden"
            >
              Get my quote
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          {/* The quote card is the home page's only quote surface: it is
              server-rendered with the page, so the primary conversion path and
              the #quote-form deep link still work for crawlers and JS-off
              users. */}
          <div className="lg:col-span-5 lg:row-span-2">
            <div
              id="quote-form"
              className="on-light relative mx-auto w-full max-w-[30rem] scroll-mt-header rounded-xl bg-card text-card-foreground shadow-xl lg:ml-auto lg:mr-0"
            >
              <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                <HeroQuoteForm />
                <p className="mt-4 border-t border-border pt-3 text-center text-[0.8125rem] text-muted-foreground">
                  Brisbane-based · ABN {BUSINESS.abn}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:col-span-7 lg:self-start">
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="hero"
              className="group inline-flex min-h-12 items-baseline gap-2.5 rounded-sm text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
            >
              <span className="text-lg">or call</span>
              <span className="text-[1.75rem] font-bold leading-none tabular-nums underline decoration-cta decoration-[3px] underline-offset-[6px] group-hover:decoration-cta-bright">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>

            <Link href="/how-it-works" className="link-arrow text-lg ring-offset-ink">
              How it works
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
