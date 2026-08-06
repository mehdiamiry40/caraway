import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { buttonVariants } from "@/components/ui/button";
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
      className="border-b border-border bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="mt-header-safe site-container">
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:min-h-[34rem] lg:grid-cols-12 lg:gap-14 lg:py-20">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">Brisbane vehicle buyers</p>
            <h1
              id="hero-heading"
              className="max-w-3xl font-display text-[clamp(2.65rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-display text-primary text-pretty"
            >
              Cash for cars Brisbane, made simple.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-xl">
              Get an instant estimate, free pickup across Greater Brisbane,
              and payment confirmed at pickup.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-accent-ink sm:justify-start"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
            </div>

            <p className="mt-7 text-sm font-medium text-foreground/65">
              Any make · Any condition · Open seven days
            </p>
          </div>

          <div className="lg:col-span-5">
            <picture>
              <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
              <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
              <img
                src="/images/tow-truck-hero.webp"
                alt="Caraway tow truck collecting a customer's car in Brisbane"
                width={800}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
