import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      className="relative w-full bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="site-container mt-header-safe pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">Brisbane · Cash for cars</p>

          <h1
            id="hero-heading"
            className="font-medium text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[var(--tracking-display)] text-foreground text-balance"
          >
            Sell your car today, in Brisbane.
          </h1>

          <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed text-base sm:text-lg">
            Tell us your make and model, get a fair offer in under a minute,
            and we&apos;ll come to you — any condition.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/#price-estimator"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group w-full sm:w-auto",
              )}
            >
              Get my quote
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href={BUSINESS.phoneTel}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full sm:w-auto",
              )}
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Firm offer in 60 seconds · Free pickup across Brisbane · Cash on the spot
          </p>
        </div>
      </div>
    </section>
  );
}
