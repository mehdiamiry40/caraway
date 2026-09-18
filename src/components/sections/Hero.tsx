import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

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
      className="relative min-h-[650px] w-full overflow-hidden bg-ink-deep text-on-dark-hi lg:min-h-[760px]"
      aria-labelledby="hero-heading"
    >
      <picture className="absolute inset-0">
        <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
        <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
        <img
          src="/images/tow-truck-hero.webp"
          alt="Tilt-tray truck carrying a silver sedan"
          width={800}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <span
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,26,57,0.38),rgba(6,26,57,0.1)_62%,transparent),linear-gradient(0deg,rgba(6,26,57,0.34),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="site-container relative z-10 flex min-h-[650px] items-end py-8 pt-[calc(var(--header-h)+2rem)] sm:py-12 sm:pt-[calc(var(--header-h)+3rem)] lg:min-h-[760px] lg:py-16 lg:pt-[calc(var(--header-h)+4rem)]">
        <div className="max-w-[680px] border-2 border-on-dark-hi bg-ink-deep/70 p-7 backdrop-blur-[2px] sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-cta-bright">
                Brisbane vehicle buyers · Pickup included
              </p>
              <h1
                id="hero-heading"
                className="mt-5 max-w-[12ch] font-display text-5xl font-medium leading-[1.02] tracking-tight text-on-dark-hi text-balance sm:text-6xl lg:text-[4.6rem]"
              >
                A simpler way to sell your car in Brisbane.
              </h1>

              <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-on-dark-hi/90 sm:text-lg">
                Share a few vehicle details, receive a clear offer, and arrange pickup across Greater Brisbane when Caraway buys.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#quote-form"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group w-full px-7 sm:w-auto",
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-on-dark-hi bg-transparent px-7 py-3 text-sm font-bold text-on-dark-hi transition hover:bg-on-dark-hi hover:text-ink-deep sm:text-[0.9375rem]"
                  ariaLabel={`or call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>
        </div>
      </div>
    </section>
  );
}
