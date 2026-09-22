import { preload } from "react-dom";
import { Check, MapPin, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";
import { BUSINESS } from "@/lib/site";

const promises = [
  "Human-reviewed vehicle assessment",
  "Pickup included when we buy",
  "Payment confirmed at pickup",
];

export function Hero() {
  preload("/images/tow-truck-hero.avif", {
    as: "image",
    fetchPriority: "high",
    type: "image/avif",
  });

  return (
    <section
      data-chat-launcher-suppress="true"
      data-sticky-cta-suppress="true"
      className="relative w-full overflow-hidden bg-primary text-on-dark-hi"
      aria-labelledby="hero-heading"
    >
      <div className="mt-header-safe mx-auto max-w-[96rem]">
        <div className="grid min-h-[34rem] grid-cols-1 lg:grid-cols-12">
          <div className="relative hidden overflow-hidden lg:order-1 lg:col-span-6 lg:block lg:min-h-[34rem]">
            <picture>
              <source media="(min-width: 1024px)" srcSet="/images/tow-truck-hero.avif" type="image/avif" />
              <source media="(min-width: 1024px)" srcSet="/images/tow-truck-hero.webp" type="image/webp" />
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                alt="Tilt-tray truck carrying a silver sedan"
                width={800}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink-deep/45 via-transparent to-transparent lg:hidden"
              aria-hidden="true"
            />
            <div
              className="hero-edge absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-b from-cta via-accent to-primary lg:block"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 order-1 flex items-center px-5 py-10 sm:px-8 sm:py-12 lg:order-2 lg:col-span-6 lg:px-10 xl:px-14">
            <div className="w-full max-w-xl">
              <h1
                id="hero-heading"
                /* text-pretty, not text-balance: with the line break below,
                   balance evens out each sentence separately and strands
                   "Cash for" alone on the first line at phone widths. */
                className="font-display text-[clamp(1.9rem,2.6vw,2.75rem)] font-bold leading-[1.08] tracking-display text-on-dark-hi text-pretty"
              >
                A clearer way to sell your car.
                <br />
                Request an assessment in minutes.
              </h1>

              {/* The three promises live in the checklist below, so this line
                  sets scope instead of restating them. */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-on-dark-hi/90 sm:text-lg">
                Vehicle buying and pickup across Greater Brisbane.
              </p>

              {/* The hero form is the primary call to action: a standalone
                  button would only scroll to the same fields. It carries the
                  #quote-form id so every "get a quote" link on the site still
                  lands on a form. */}
              <div id="quote-form" className="mt-6 scroll-mt-header">
                <HeroQuoteForm />
              </div>

              {/* One wrapping row rather than a stacked list — the form now
                  owns the hero's vertical space. */}
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-start gap-2 text-sm font-semibold leading-5 text-on-dark-hi/90"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <TrackedPhoneLink
                  href={BUSINESS.phoneTel}
                  location="hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-on-dark-hi/90 underline decoration-cta/70 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-cta sm:text-[0.9375rem]"
                  ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                  or call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>

                <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-2 border border-on-dark-hi/20 bg-on-dark-hi/8 px-3 py-2">
                  <MapPin className="h-4 w-4 text-cta-bright" aria-hidden="true" />
                  <span className="text-sm font-medium text-on-dark-hi">
                    Brisbane-based · ABN {BUSINESS.abn}
                  </span>
                </div>
              </div>

              {/* Below lg the photo closes the hero instead of pushing the
                  form down the page. */}
              <div className="mt-7 w-full overflow-hidden rounded-md border border-on-dark-hi/20 bg-on-dark-hi/10 shadow-sm lg:hidden">
                <picture>
                  <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
                  <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
                  <img
                    src="/images/tow-truck-hero.webp"
                    alt="Tilt-tray truck carrying a silver sedan"
                    width={800}
                    height={800}
                    decoding="async"
                    className="h-40 w-full object-cover sm:h-48"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
