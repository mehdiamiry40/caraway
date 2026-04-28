import { Button } from "@/components/ui/button";
import { PartyPopper, RotateCcw } from "lucide-react";
import type { EstimatorState } from "./types";

export function Success({ state }: { state: EstimatorState }) {
  const { result, year, make, model, handleReset, successHeadingRef } = state;
  return (
    <section
      id="price-estimator"
      className="section-y scroll-mt-header bg-muted relative overflow-hidden"
      aria-label="Quote submitted"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="site-container">
        <div
          className="bg-card rounded-2xl border border-border shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06),0_32px_64px_-12px_hsl(var(--shadow-color)/0.1)] p-6 sm:p-10 text-center max-w-3xl mx-auto"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 mx-auto mb-5">
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
            Your quote is on its way.
          </h3>
          <p className="text-foreground/80 text-sm sm:text-base mb-5">
            We received your details for your{" "}
            <strong className="text-foreground">
              {year} {[make, model].filter(Boolean).join(" ")}
            </strong>
            . We&apos;ll confirm your final price within the hour.
          </p>
          <div className="quote-card max-w-xs mx-auto px-5 py-4 text-left mb-5">
            <div className="flex items-center">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">
                Offer sent
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[0.8125rem] text-[hsl(var(--on-dark))]">Your quote</span>
              <span className="font-mono tabular-nums text-xl font-medium text-[hsl(var(--on-dark-hi))]">
                ${result?.quote.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            We&apos;ll contact you shortly to confirm a final price. No obligation — if the offer
            doesn&apos;t work for you, no worries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button type="button" onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Estimate another
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
