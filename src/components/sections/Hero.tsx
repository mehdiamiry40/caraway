import { preload } from "react-dom";
import { Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { BUSINESS, SHARED_PICKUP_IMAGE_ALT } from "@/lib/site";

const promises = [
  "Human-reviewed vehicle assessment",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
];

export function Hero() {
  preload("/images/hero-pickup.avif", {
    as: "image",
    fetchPriority: "high",
    type: "image/avif",
  });

  return (
    <section
      data-chat-launcher-suppress="true"
      data-sticky-cta-suppress="true"
      className="relative isolate w-full overflow-hidden bg-primary text-on-dark-hi"
      aria-labelledby="hero-heading"
    >
      <picture>
        <source srcSet="/images/hero-pickup.avif" type="image/avif" />
        <source srcSet="/images/hero-pickup.webp" type="image/webp" />
        <img
          src="/images/hero-pickup.webp"
          alt={SHARED_PICKUP_IMAGE_ALT}
          width={1200}
          height={630}
          fetchPriority="high"
          decoding="async"
          className="hero-drift absolute inset-0 -z-20 h-full w-full object-cover object-[35%_center]"
        />
      </picture>
      {/* Navy wash: darker at the top so the overlaid header stays legible,
          slate through the middle, deepest behind the copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(var(--primary)/0.74)_0%,hsl(var(--ink-raised)/0.5)_32%,hsl(var(--ink-raised)/0.66)_62%,hsl(var(--primary)/0.92)_100%)]"
      />

      <div className="site-container grid min-h-[clamp(38rem,52vw,46rem)] grid-cols-1 items-end gap-10 pt-[calc(var(--header-h)+2.5rem)] pb-12 sm:pb-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-20">
        <div>
          <h1
            id="hero-heading"
            /* text-pretty, not text-balance: with the line break below,
               balance evens out each sentence separately. */
            className="max-w-[15em] font-display text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.14] text-on-dark-hi text-pretty"
          >
            A clearer way to sell your car.
            <br />
            Request an assessment in minutes.
          </h1>

          {/* The three promises live in the checklist below, so this line
              sets scope instead of restating them. */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark-hi/90 sm:text-lg">
            Vehicle buying and pickup across Greater Brisbane.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5">
            {promises.map((promise) => (
              <li
                key={promise}
                className="flex items-center gap-2.5 text-sm text-on-dark-hi/90"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-3.5 -translate-y-0.5 -rotate-45 border-b-2 border-l-2 border-cta-bright"
                />
                {promise}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="hero"
              className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-[0.9375rem] text-on-dark-hi/90 underline decoration-accent/80 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-accent"
              ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
              or call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
            <span className="text-sm text-on-dark-hi/75">
              Brisbane-based · ABN {BUSINESS.abn}
            </span>
          </div>
        </div>

        {/* The hero form is the primary call to action. It carries the
            #quote-form id so every "get a quote" link on the site still lands
            on a form. */}
        <div id="quote-form" className="w-full scroll-mt-header lg:justify-self-end">
          <HeroQuoteForm />
        </div>
      </div>
    </section>
  );
}
