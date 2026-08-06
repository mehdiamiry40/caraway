import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const assurances = [
  "Any make or condition",
  "Pickup included when we buy",
  "Open seven days",
] as const;

export function Hero() {
  preload("/images/tow-truck-hero.avif", {
    as: "image",
    fetchPriority: "high",
    type: "image/avif",
  });

  return (
    <section
      className="mt-header-safe overflow-hidden bg-secondary"
      aria-labelledby="hero-heading"
    >
      <div className="site-container py-8 sm:py-12 lg:py-16">
        <div className="grid items-center gap-9 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5">Brisbane vehicle buyers</p>
            <h1
              id="hero-heading"
              className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-display text-primary"
            >
              Cash for cars.
              <br />
              Handled with care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
              A clear quote, pickup across Greater Brisbane, and payment
              confirmed before your car leaves.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/#price-estimator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group w-full rounded-full px-8 sm:w-auto",
                )}
              >
                Get my quote
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="hero"
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent-ink sm:justify-start"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
            </div>

            <ul className="mt-8 flex flex-col gap-2 text-sm text-foreground/70 sm:flex-row sm:flex-wrap sm:gap-x-5">
              {assurances.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cta/25 text-cta-ink">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
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
                className="aspect-[4/3] w-full rounded-[1.75rem] object-cover lg:aspect-[5/6]"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
