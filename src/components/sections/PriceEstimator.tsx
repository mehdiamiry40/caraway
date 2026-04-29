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
      className="section-y scroll-mt-header bg-secondary border-t border-border relative"
      aria-label="Instant price estimate"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="site-container">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-4">Instant valuation</p>
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground leading-tight tracking-[var(--tracking-tight)] text-balance">
            How much is your car worth?
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Answer four quick questions. We&apos;ll send back a firm cash offer — no
            account, no spam.
          </p>
        </div>

        <ProgressBar step={step} totalSteps={totalSteps} progressPercent={progressPercent} />

        <div className="max-w-3xl">
          <div className="relative bg-card rounded-md border border-border overflow-hidden">
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <Step1Vehicle state={state} />

            {isCalculating && (
              <div
                className="p-8 sm:p-12 flex flex-col items-center justify-center text-center"
                role="status"
                aria-live="polite"
              >
                <Loader2 className="w-6 h-6 text-foreground animate-spin mb-3" aria-hidden="true" />
                <p className="text-foreground">Calculating your quote…</p>
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
