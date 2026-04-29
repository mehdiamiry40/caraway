"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

export function FinalCTA() {
  return (
    <section className="section-y bg-background border-t border-border" aria-label="Get your quote">
      <div className="site-container">
        <div className="max-w-2xl">
          <h2 className="font-medium text-3xl sm:text-4xl leading-tight tracking-[var(--tracking-tight)] text-foreground text-balance">
            See what your car is worth today.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg max-w-xl">
            One form. Firm price. Free pickup across Greater Brisbane.
            Cash on the spot — usually same- or next-day.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/#price-estimator"
              onClick={() => trackEvent("cta_click", { location: "final_cta" })}
              className={cn(buttonVariants({ size: "lg" }), "group w-full sm:w-auto")}
            >
              Get my quote
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full sm:w-auto",
              )}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </div>
        </div>
      </div>
    </section>
  );
}
