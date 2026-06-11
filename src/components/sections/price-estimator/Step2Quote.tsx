import { Button } from "@/components/ui/button";
import { CONDITION_LABELS } from "@/lib/quote-schema";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EstimatorState } from "./types";

export function Step2Quote({ state }: { state: EstimatorState }) {
  const { step, isCalculating, result, year, make, model, condition, goToStep, step2HeadingRef } =
    state;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        step === 2 && !isCalculating ? "block" : "hidden"
      )}
    >
      {result && (
        <div className="p-5 sm:p-8">
          <div className="quote-card p-4 sm:p-6 mb-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
              <span className="inline-flex items-center gap-2 text-[0.75rem] font-medium text-[hsl(var(--on-dark-hi))] border-b-2 border-[hsl(var(--primary))] pb-1">
                Your estimate
              </span>
              <span className="text-[0.75rem] font-medium text-[hsl(var(--on-dark))] pb-1">
                Your car
              </span>
            </div>
            <div
              ref={step2HeadingRef}
              tabIndex={-1}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--ink))] rounded"
            >
              <p className="text-[0.8125rem] text-[hsl(var(--on-dark))] mb-1">
                {year} {[make, model].filter(Boolean).join(" ")} ·{" "}
                {condition ? CONDITION_LABELS[condition].split(" — ")[0] : ""}
              </p>
              <p className="font-mono tabular-nums text-4xl sm:text-5xl font-medium text-[hsl(var(--on-dark-hi))] tracking-[-0.02em]">
                ${result.quote.toLocaleString()}
              </p>
              <p className="mt-1 text-[0.75rem] uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">
                Instant estimate · confirmed offer after review
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--on-dark))]">
                Final offers depend on the vehicle details and a pickup inspection.
              </p>
            </div>
          </div>

          {result.factors.length > 0 && (
            <div className="bg-muted rounded-xl p-4 mb-6 border border-border">
              <p className="text-xs uppercase tracking-[0.06em] text-foreground/75 mb-2">
                What affects your price
              </p>
              <ul className="space-y-1.5">
                {result.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <CheckCircle2
                      className="w-4 h-4 text-primary shrink-0 mt-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              type="button"
              onClick={() => goToStep(1)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
            </Button>
            <Button
              onClick={() => goToStep(3)}
              variant="default"
              size="lg"
              className="group w-full sm:w-auto"
            >
              Request confirmed offer
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
