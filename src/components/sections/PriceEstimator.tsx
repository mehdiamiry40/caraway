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

  if (isSuccess) return <Success state={state} />;

  return (
    <section
      id="price-estimator"
      className="section-y relative scroll-mt-header bg-background"
      aria-label="Instant price estimate"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 lg:pt-5">
            <p className="eyebrow mb-5">Instant valuation</p>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-display text-primary">
              See what your car could be worth.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/70 lg:text-lg">
              Four quick questions. No account and no obligation.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ProgressBar
              step={step}
              totalSteps={totalSteps}
              progressPercent={progressPercent}
            />

            <div className="relative mt-5 overflow-hidden rounded-sm border border-border bg-card shadow-lg">
              <span className="absolute inset-x-0 top-0 h-1 bg-cta" aria-hidden="true" />
              <Honeypot value={honeypot} onChange={setHoneypot} />
              <Step1Vehicle state={state} />

              {isCalculating && (
                <div
                  className="flex flex-col items-center justify-center p-8 text-center sm:p-12"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
                  <p className="font-display text-foreground">Calculating your quote…</p>
                </div>
              )}

              <Step2Quote state={state} />
              <Step3Claim state={state} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
