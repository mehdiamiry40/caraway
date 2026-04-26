"use client";

import { Loader2 } from "lucide-react";
import { usePriceEstimator } from "@/hooks/use-price-estimator";
import { Honeypot } from "./price-estimator/Honeypot";
import { ProgressBar } from "./price-estimator/ProgressBar";
import { Step1Vehicle } from "./price-estimator/Step1Vehicle";
import { Step2Quote } from "./price-estimator/Step2Quote";
import { Step3Claim } from "./price-estimator/Step3Claim";
import { Success } from "./price-estimator/Success";

export function PriceEstimator() {
  const state = usePriceEstimator();
  const {
    step,
    totalSteps,
    progressPercent,
    liveMessage,
    isCalculating,
    isSuccess,
    honeypot,
    setHoneypot,
  } = state;

  if (isSuccess) {
    return <Success state={state} />;
  }

  return (
    <section
      id="price-estimator"
      className="section-y scroll-mt-header bg-muted relative overflow-hidden"
      aria-label="Instant price estimate"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="site-container">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Instant valuation</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance">
            How much is your car worth?
          </h2>
          <p className="mt-4 text-foreground/80 text-base sm:text-lg leading-relaxed">
            Answer four quick questions. We&apos;ll send back a firm cash offer for your car — no
            account, no spam.
          </p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Actual offers depend on condition, completeness, location, demand, and current market
            value.
          </p>
        </div>

        <ProgressBar step={step} totalSteps={totalSteps} progressPercent={progressPercent} />

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card rounded-2xl border border-border shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06),0_32px_64px_-12px_hsl(var(--shadow-color)/0.1)] overflow-hidden">
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <Step1Vehicle state={state} />

            {isCalculating && (
              <div
                className="p-8 sm:p-12 flex flex-col items-center justify-center text-center"
                role="status"
                aria-live="polite"
              >
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" aria-hidden="true" />
                <p className="font-display text-foreground">Calculating your quote…</p>
              </div>
            )}

            <Step2Quote state={state} />
            <Step3Claim state={state} />
          </div>
        </div>
      </div>
    </section>
  );
}
