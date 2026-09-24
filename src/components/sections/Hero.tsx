import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS, SHARED_PICKUP_IMAGE_ALT } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  "Estimate from four details",
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
      className="relative isolate flex min-h-[clamp(36rem,56vw,48rem)] w-full items-end overflow-hidden bg-primary text-on-dark-hi"
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
          className="hero-drift absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
        />
      </picture>
      {/* Navy wash: darker at the top so the overlaid header stays legible,
          slate through the middle, deepest behind the headline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(var(--primary)/0.72)_0%,hsl(var(--ink-raised)/0.45)_30%,hsl(var(--ink-raised)/0.62)_62%,hsl(var(--primary)/0.9)_100%)]"
      />

      <div className="site-container w-full pt-[calc(var(--header-h)+3rem)] pb-14 sm:pb-20 lg:pb-24">
        <h1
          id="hero-heading"
          className="max-w-[15em] font-display text-[clamp(2.1rem,4.6vw,4rem)] leading-[1.14] text-on-dark-hi text-pretty"
        >
          A clearer way to sell your car.
          <br />
          Get an estimate in minutes.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark-hi/90 sm:text-lg">
          Vehicle buying and pickup across Greater Brisbane.
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/#price-estimator"
            className={cn(buttonVariants({ size: "lg" }), "group w-full px-9 sm:w-auto")}
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
            className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-[0.9375rem] text-on-dark-hi/90 underline decoration-accent/80 underline-offset-4 transition-colors hover:text-on-dark-hi hover:decoration-accent"
            ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
          >
            <Phone aria-hidden="true" className="h-4 w-4 text-cta-bright" />
            or call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2.5">
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
          <li className="flex items-center gap-2.5 text-sm text-on-dark-hi/75">
            Brisbane-based · ABN {BUSINESS.abn}
          </li>
        </ul>
      </div>
    </section>
  );
}
