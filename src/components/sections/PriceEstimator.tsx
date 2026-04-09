"use client";

import { useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import { BUSINESS } from "@/lib/site";
import {
  Car, DollarSign, ArrowRight, ArrowLeft, RotateCcw,
  TrendingUp, Phone, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "hatch", label: "Hatchback" },
  { value: "suv", label: "SUV" },
  { value: "ute", label: "Ute / Pickup" },
  { value: "4wd", label: "4WD" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "wagon", label: "Wagon" },
  { value: "coupe", label: "Coupe" },
  { value: "other", label: "Other" },
];

const CONDITIONS = [
  { value: "excellent", label: "Excellent — runs perfectly, no issues" },
  { value: "good", label: "Good — runs well, minor wear" },
  { value: "fair", label: "Fair — runs but needs some work" },
  { value: "poor", label: "Poor — major issues, barely runs" },
  { value: "not-running", label: "Not running / damaged / written off" },
];

const POPULAR_MAKES = [
  "Toyota", "Mazda", "Hyundai", "Kia", "Honda", "Ford",
  "Holden", "Mitsubishi", "Nissan", "Subaru", "Volkswagen",
  "BMW", "Mercedes", "Suzuki", "Isuzu", "Jeep",
];

type Step = 1 | 2 | 3;

export function PriceEstimator() {
  const [step, setStep] = useState<Step>(1);
  const [vehicleType, setVehicleType] = useState("");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("");
  const [result, setResult] = useState<EstimateResult | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => {
    const y = currentYear + 1 - i;
    return { value: String(y), label: String(y) };
  });

  const canProceedStep1 = vehicleType !== "" && make.trim() !== "";
  const canProceedStep2 = year !== "" && condition !== "";

  function handleEstimate() {
    if (!canProceedStep2) return;
    const est = estimatePrice({
      make,
      year: Number(year),
      condition,
      vehicleType,
    });
    setResult(est);
    setStep(3);
  }

  function handleReset() {
    setStep(1);
    setVehicleType("");
    setMake("");
    setYear("");
    setCondition("");
    setResult(null);
  }

  return (
    <section id="price-estimator" className="section-y bg-gradient-to-b from-muted/40 via-background to-muted/30" aria-label="Instant price estimate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent mb-2">Free instant estimate</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
            How Much Is Your Car Worth?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Get an instant price range in 30 seconds. No contact details required.
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300",
                  step >= s
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={cn(
                  "text-xs sm:text-sm font-medium hidden sm:inline transition-colors",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s === 1 ? "Vehicle" : s === 2 ? "Details" : "Estimate"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg shadow-primary/[0.03] overflow-hidden">

            {/* Step 1: Vehicle Type & Make */}
            <div className={cn(
              "transition-all duration-300",
              step === 1 ? "block" : "hidden"
            )}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Tell us about your vehicle</h3>
                    <p className="text-xs text-muted-foreground">Step 1 of 3</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-vehicle-type" className="block text-sm font-semibold text-foreground mb-2">Vehicle type</label>
                    <Select
                      id="est-vehicle-type"
                      options={VEHICLE_TYPES}
                      placeholder="Select type..."
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="est-make" className="block text-sm font-semibold text-foreground mb-2">Make / brand</label>
                    <Input
                      id="est-make"
                      placeholder="e.g. Toyota, Mazda, Ford..."
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      list="popular-makes"
                      autoComplete="off"
                    />
                    <datalist id="popular-makes">
                      {POPULAR_MAKES.map((m) => <option key={m} value={m} />)}
                    </datalist>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-end">
                  <Button
                    onClick={() => canProceedStep1 && setStep(2)}
                    disabled={!canProceedStep1}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold group"
                  >
                    Next
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2: Year & Condition */}
            <div className={cn(
              "transition-all duration-300",
              step === 2 ? "block" : "hidden"
            )}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Year and condition</h3>
                    <p className="text-xs text-muted-foreground">Step 2 of 3 — {make} {vehicleType}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-year" className="block text-sm font-semibold text-foreground mb-2">Year of manufacture</label>
                    <Select
                      id="est-year"
                      options={yearOptions}
                      placeholder="Select year..."
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="est-condition" className="block text-sm font-semibold text-foreground mb-2">Condition</label>
                    <Select
                      id="est-condition"
                      options={CONDITIONS}
                      placeholder="Select condition..."
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <Button
                    onClick={handleEstimate}
                    disabled={!canProceedStep2}
                    className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-bold group shadow-lg shadow-accent/20"
                  >
                    Get My Estimate
                    <DollarSign className="ml-1.5 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Results */}
            <div className={cn(
              "transition-all duration-300",
              step === 3 ? "block" : "hidden"
            )}>
              {result && (
                <div className="p-5 sm:p-8">
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Estimated value for your {year} {make}
                    </p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-3xl sm:text-5xl font-display font-bold text-primary">
                        ${result.low.toLocaleString()}
                      </span>
                      <span className="text-xl sm:text-2xl text-muted-foreground font-medium">—</span>
                      <span className="text-3xl sm:text-5xl font-display font-bold text-accent">
                        ${result.high.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on current Brisbane market conditions
                    </p>
                  </div>

                  {/* Factors */}
                  {result.factors.length > 0 && (
                    <div className="bg-muted/50 rounded-xl p-4 mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What affects your price</p>
                      <ul className="space-y-1.5">
                        {result.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 sm:p-6 border border-primary/10">
                    <p className="font-display font-bold text-foreground text-center mb-1">
                      Want an exact quote?
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4">
                      Call us or fill out the form — we&apos;ll confirm a final price before pickup.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={BUSINESS.phoneHref}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl bg-primary text-white font-bold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 touch-manipulation"
                      >
                        <Phone className="w-4 h-4" />
                        {BUSINESS.phoneFriendly}
                      </a>
                      <Link
                        href="/#quote-section"
                        className="flex-1 inline-flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl bg-accent text-white font-bold text-sm sm:text-base hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 touch-manipulation"
                      >
                        Get Exact Quote
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Reset */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Estimate another vehicle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            This is an indicative estimate only. Your final offer may differ based on a detailed assessment. No personal information required.
          </p>
        </div>
      </div>
    </section>
  );
}
