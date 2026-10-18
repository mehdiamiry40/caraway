import Link from "next/link";
import { preload } from "react-dom";
import { Check, Phone } from "lucide-react";
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
 * Flat geometric collage: a sun, an orange kite and a chocolate arch frame a
 * grayscale street strip and the colour tow-truck photo. Purely decorative —
 * the copy beside it carries the meaning.
 */
function HeroCollage() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[22rem] w-full max-w-[40rem] sm:h-[30rem] xl:absolute xl:bottom-0 xl:right-0 xl:mx-0 xl:h-[35rem] xl:w-[40rem]"
    >
      <span className="shape right-[8%] top-0 h-28 w-28 rounded-full bg-sun sm:h-40 sm:w-40 xl:-top-14 xl:right-[76px] xl:h-44 xl:w-44" />
      <span className="shape shape-kite left-0 top-[34%] h-36 w-52 bg-orange sm:h-48 sm:w-72 xl:left-10 xl:top-40 xl:h-[13rem] xl:w-[19rem]" />
      <span className="shape left-[34%] top-[56%] h-44 w-44 rounded-full bg-chocolate sm:h-60 sm:w-60 xl:left-[13.75rem] xl:top-80 xl:h-64 xl:w-64" />
      <picture>
        <img
          src="/images/og-card.jpg"
          alt=""
          width={1200}
          height={630}
          loading="lazy"
          decoding="async"
          className="absolute bottom-0 left-0 hidden h-[42%] w-[92%] object-cover grayscale sm:block [clip-path:polygon(0_18%,58%_18%,58%_0,100%_6%,100%_100%,0_100%)]"
        />
      </picture>
      <picture>
        <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
        <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
        <img
          src="/images/tow-truck-hero.webp"
          alt=""
          width={800}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="shape-arch absolute bottom-0 right-[6%] h-[70%] w-[62%] object-cover sm:right-0 sm:h-[68%] sm:w-[54%] xl:h-[23.75rem] xl:w-[23.75rem]"
        />
      </picture>
    </div>
  );
}

export function Hero() {
  preload("/images/tow-truck-hero.avif", {
    as: "image",
    fetchPriority: "high",
    type: "image/avif",
  });

  return (
    <>
      <section
        data-chat-launcher-suppress="true"
        className="relative w-full overflow-hidden bg-background text-foreground"
        aria-labelledby="hero-heading"
      >
        <div className="mt-header-safe site-container relative pb-0 pt-10 sm:pt-16 lg:pt-20 xl:min-h-[52rem] xl:pt-24">
          <div className="relative z-10 max-w-[50rem] xl:pl-20">
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground text-pretty"
            >
              Cash for Cars Brisbane, without the runaround.
            </h1>

            <p className="mt-8 max-w-[37.5rem] xl:max-w-[30rem] font-display text-xl leading-8 tracking-[-0.01em] text-foreground sm:mt-16 sm:text-2xl lg:mt-24">
              Request an assessment in minutes. Caraway is a Brisbane-based car
              buyer: you get a written offer before anything is booked, pickup
              is included when we buy, and payment is confirmed at collection.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10">
              <Link
                href="#quote-form"
                className={cn(buttonVariants({ size: "lg" }), "px-10")}
              >
                Get my quote
              </Link>
              <Link
                href="/how-it-works"
                className={cn(buttonVariants({ variant: "grey", size: "lg" }), "px-10")}
              >
                How it works
              </Link>
            </div>

            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="hero"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-base text-muted-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              or call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </div>

          <div className="mt-12 xl:mt-0">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* The quote band is the home page's only quote surface: it is
          server-rendered with the page, so the primary conversion path and
          the #quote-form deep link still work for crawlers and JS-off users. */}
      <section
        data-sticky-cta-suppress="true"
        aria-label="Request a vehicle assessment"
        className="grid-paper relative overflow-hidden py-16 sm:py-24 lg:py-28"
      >
        <span aria-hidden="true" className="shape left-6 top-8 h-24 w-24 rounded-full bg-peach sm:left-[8.5rem] sm:top-16 sm:h-36 sm:w-36" />
        <span aria-hidden="true" className="shape shape-triangle-right bottom-0 left-0 h-44 w-36 bg-chocolate sm:bottom-10 sm:h-80 sm:w-64" />
        <span aria-hidden="true" className="shape -right-16 top-16 h-16 w-52 rotate-[24deg] bg-sky sm:-right-14 sm:top-48 sm:h-28 sm:w-96" />

        <div
          id="quote-form"
          className="relative z-10 mx-4 scroll-mt-header bg-background px-5 py-10 sm:mx-auto sm:max-w-[40rem] sm:px-12 sm:py-14"
        >
          <HeroQuoteForm />

          <ul className="mt-8 flex flex-col gap-2.5 border-t border-border pt-6 sm:items-center">
            {promises.map((promise) => (
              <li
                key={promise}
                className="flex items-center gap-2.5 text-[0.9375rem] leading-5 text-foreground"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-accent text-accent-foreground">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </span>
                {promise}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground sm:text-center">
            Brisbane-based · ABN {BUSINESS.abn}
          </p>
        </div>
      </section>
    </>
  );
}
