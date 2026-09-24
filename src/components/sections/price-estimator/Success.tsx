import { Button, buttonVariants } from "@/components/ui/button";
import { PartyPopper, RotateCcw, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { EstimatorState } from "./types";

export function Success({ state }: { state: EstimatorState }) {
  const { result, year, make, model, handleReset, successHeadingRef } = state;
  return (
    <section
      id="price-estimator"
      className="section-y scroll-mt-header relative overflow-hidden border-y border-border bg-secondary"
      aria-label="Offer request submitted"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="site-container">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-sm border border-border bg-card p-6 text-center shadow-md before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-accent sm:p-10"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-primary/10 mx-auto mb-5">
            <PartyPopper
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-display text-xl sm:text-2xl text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Your offer request is in.
          </h3>
          <p className="text-foreground/80 text-sm sm:text-base mb-5">
            We received your details for your{" "}
            <strong className="text-foreground">
              {year} {[make, model].filter(Boolean).join(" ")}
            </strong>
            . We&apos;ll review the supplied details and contact you about the assessment.
          </p>
          <div className="quote-card max-w-xs mx-auto px-5 py-4 text-left mb-5">
            <div className="flex items-center">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">
                {result?.status === "manual_review"
                  ? "Buyer assessment requested"
                  : "Estimate submitted"}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[0.8125rem] text-[hsl(var(--on-dark))]">
                {result?.status === "manual_review" ? "Assessment" : "Your estimate"}
              </span>
              <span className="font-mono tabular-nums text-xl font-medium text-[hsl(var(--on-dark-hi))]">
                {result?.quote === null || result?.quote === undefined
                  ? "Manual review"
                  : `$${result.quote.toLocaleString()}`}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            We&apos;ll contact you shortly to confirm a final price. No obligation — if the offer
            doesn&apos;t work for you, no worries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="estimator_success"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call Caraway: {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
            <Button type="button" onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Assess another vehicle
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
