import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Estimate from four details",
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
          <div className="relative hidden overflow-hidden lg:order-1 lg:col-span-7 lg:block lg:min-h-[34rem]">
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
              className="hero-edge absolute inset-y-0 right-0 hidden w-16 bg-cta lg:block"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 order-1 flex items-center px-5 py-10 sm:px-8 sm:py-14 lg:order-2 lg:col-span-5 lg:px-10 xl:px-14">
            <div className="max-w-xl">
              <h1
                id="hero-heading"
                /* text-pretty, not text-balance: with the line break below,
                   balance evens out each sentence separately and strands
                   "Cash for" alone on the first line at phone widths. */
                className="font-display text-[clamp(2.45rem,4.5vw,4.25rem)] font-bold leading-[1.04] tracking-display text-on-dark-hi text-pretty"
              >
                A clearer way to sell your car.
                <br />
                Get an estimate in minutes.
              </h1>

              {/* The three promises live in the checklist below, so this line
                  sets scope instead of restating them. */}
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-dark-hi/90 sm:mt-6 sm:text-lg">
                Vehicle buying and pickup across Greater Brisbane.
              </p>

              {/* Full width of the copy column below lg — as a 14rem thumbnail
                  it read as an afterthought against the hero's width. */}
              <div className="mt-6 w-full overflow-hidden rounded-md border border-on-dark-hi/20 bg-on-dark-hi/10 shadow-sm lg:hidden">
                <picture>
                  <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
                  <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
                  <img
                    src="/images/tow-truck-hero.webp"
                    alt="Tilt-tray truck carrying a silver sedan"
                    width={800}
                    height={800}
                    fetchPriority="high"
                    decoding="async"
                    className="h-48 w-full object-cover sm:h-56"
                  />
                </picture>
              </div>

              <div className="mt-7 flex max-w-xl flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/#quote-form"
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-2 text-sm font-medium text-on-dark-hi/90 underline decoration-cta/70 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-cta sm:px-0 sm:text-[0.9375rem]"
                  ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                  or call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>

              <ul className="mt-7 grid max-w-xl gap-y-2.5 sm:mt-8">
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

              <div className="mt-7 inline-flex flex-wrap items-center gap-x-2 gap-y-2 border border-on-dark-hi/20 bg-on-dark-hi/8 px-3 py-2 sm:mt-8">
                <MapPin className="h-4 w-4 text-cta-bright" aria-hidden="true" />
                <span className="text-sm font-medium text-on-dark-hi">
                  Brisbane-based · ABN {BUSINESS.abn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
