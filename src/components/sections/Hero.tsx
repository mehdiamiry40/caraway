import Link from "next/link";
import { preload } from "react-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  preload("/images/tow-truck-hero.avif", {
    as: "image",
    fetchPriority: "high",
    type: "image/avif",
  });

  return (
    <section
      className="mt-header-safe relative min-h-[34rem] overflow-hidden bg-primary sm:min-h-[39rem]"
      aria-labelledby="hero-heading"
    >
      <picture className="absolute inset-0">
        <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
        <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
        <img
          src="/images/tow-truck-hero.webp"
          alt="Caraway tow truck collecting a customer's car in Brisbane"
          width={800}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <span className="absolute inset-0 bg-primary/20" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="w-full border-t border-on-dark-hi/90 bg-[hsl(var(--primary)/0.88)] px-5 py-8 text-on-dark-hi backdrop-blur-[2px] sm:w-[64%] sm:border-r sm:px-10 sm:py-10 lg:w-[52%] lg:px-12 lg:py-12">
            <h1
              id="hero-heading"
              className="max-w-xl font-display text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-display text-on-dark-hi"
            >
              Cash for cars Brisbane.
              <br />
              Made clear and simple.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-on-dark-hi/85 sm:text-lg">
              Sell any make or condition with a confirmed offer, pickup across
              Greater Brisbane, and payment before your car leaves.
            </p>
            <Link
              href="/#price-estimator"
              className={cn(
                buttonVariants({ size: "default" }),
                "group mt-7 rounded-none px-6",
              )}
            >
              Get my quote
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
        </div>
      </div>
    </section>
  );
}
