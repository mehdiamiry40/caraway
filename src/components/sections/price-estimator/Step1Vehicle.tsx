import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MAKE_OPTIONS, YEAR_OPTIONS, getModelOptions } from "@/data/car-models";
import {
  CONDITION_LABELS,
  quoteConditionValues,
  type QuoteCondition,
} from "@/lib/quote-schema";
import { Car, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredMark } from "./RequiredMark";
import type { EstimatorState } from "./types";

const CONDITIONS: Array<{ value: QuoteCondition; label: string }> =
  quoteConditionValues.map((value) => ({ value, label: CONDITION_LABELS[value] }));

export function Step1Vehicle({ state }: { state: EstimatorState }) {
  const {
    step,
    isCalculating,
    make,
    setMake,
    model,
    setModel,
    year,
    setYear,
    setYearTouched,
    condition,
    setCondition,
    canCalculate,
    handleEstimate,
    step1HeadingRef,
  } = state;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        step === 1 && !isCalculating ? "block" : "hidden"
      )}
    >
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-7">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
            <Car className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3
            ref={step1HeadingRef}
            tabIndex={-1}
            className="font-display text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Tell us about your vehicle
          </h3>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="est-make" className="block text-sm text-foreground mb-2.5">
              Make
              <RequiredMark />
            </label>
            <Select
              id="est-make"
              placeholder="Select make..."
              options={MAKE_OPTIONS}
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel("");
              }}
              aria-required="true"
            />
          </div>
          {make && make !== "Other" && (
            <div>
              <label htmlFor="est-model" className="block text-sm text-foreground mb-2.5">
                Model
                <RequiredMark />
              </label>
              <Select
                id="est-model"
                placeholder="Select model..."
                options={getModelOptions(make)}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                aria-required="true"
              />
            </div>
          )}
          <div>
            <label htmlFor="est-year" className="block text-sm text-foreground mb-2.5">
              Year of manufacture
              <RequiredMark />
            </label>
            <Select
              id="est-year"
              placeholder="Select year..."
              options={YEAR_OPTIONS}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onBlur={() => setYearTouched(true)}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="est-condition" className="block text-sm text-foreground mb-2.5">
              Condition
              <RequiredMark />
            </label>
            <Select
              id="est-condition"
              options={CONDITIONS}
              placeholder="Select condition..."
              value={condition}
              onChange={(e) => setCondition(e.target.value as QuoteCondition)}
              aria-required="true"
            />
          </div>
        </div>

        <div className="mt-7 sm:mt-9 flex sm:justify-end">
          <Button
            onClick={() => {
              setYearTouched(true);
              handleEstimate();
            }}
            disabled={!canCalculate || isCalculating}
            variant="default"
            size="lg"
            className="group w-full sm:w-auto"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                Calculating…
              </>
            ) : (
              <>
                See my quote
                <ArrowRight
                  className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
