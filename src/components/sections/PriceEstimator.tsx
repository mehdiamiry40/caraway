"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import { submitQuote } from "@/actions/quote";
import { BUSINESS } from "@/lib/site";
import {
  Car, DollarSign, ArrowRight, ArrowLeft, RotateCcw,
  TrendingUp, Phone, CheckCircle2, Send, Loader2, PartyPopper,
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

type Step = 1 | 2 | 3 | 4;

export function PriceEstimator() {
  const [step, setStep] = useState<Step>(1);
  const [vehicleType, setVehicleType] = useState("");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("");
  const [result, setResult] = useState<EstimateResult | null>(null);

  // Step 4: contact details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => {
    const y = currentYear + 1 - i;
    return { value: String(y), label: String(y) };
  });

  const canProceedStep1 = vehicleType !== "" && make.trim() !== "";
  const canProceedStep2 = year !== "" && condition !== "";
  const canSubmit = name.trim().length >= 2 && phone.trim().length >= 8;

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

  async function handleSubmit() {
    if (!canSubmit || !result) return;
    setIsSubmitting(true);
    setSubmitError("");

    const conditionLabel = CONDITIONS.find((c) => c.value === condition)?.label ?? condition;
    const typeLabel = VEHICLE_TYPES.find((t) => t.value === vehicleType)?.label ?? vehicleType;

    const res = await submitQuote({
      name: name.trim(),
      phone: phone.trim(),
      make: `${make.trim()} (${typeLabel})`,
      year: Number(year),
      condition: `${conditionLabel} — Estimate: $${result.low.toLocaleString()}–$${result.high.toLocaleString()}`,
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setSubmitError(res.message ?? "Something went wrong. Please try again.");
    }
  }

  function handleReset() {
    setStep(1);
    setVehicleType("");
    setMake("");
    setYear("");
    setCondition("");
    setResult(null);
    setName("");
    setPhone("");
    setSubmitError("");
    setIsSuccess(false);
  }

  const totalSteps = 4;
  const progressPercent = step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 66 : 100;

  if (isSuccess) {
    return (
      <section id="price-estimator" className="section-y bg-gradient-to-b from-muted/40 via-background to-muted/30" aria-label="Quote submitted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg shadow-primary/[0.03] p-6 sm:p-10 text-center">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 mx-auto mb-5">
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2">
              Your quote is on its way!
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-2">
              We&apos;ve received your details for your <strong>{year} {make}</strong>.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent font-bold text-lg sm:text-xl rounded-full px-6 py-2 mb-4">
              <DollarSign className="w-5 h-5" />
              ${result?.low.toLocaleString()} – ${result?.high.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;ll call you shortly to confirm a final price. No obligation — if the offer doesn&apos;t work for you, no worries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all touch-manipulation"
              >
                <Phone className="w-4 h-4" />
                Call us now
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-all touch-manipulation"
              >
                <RotateCcw className="w-4 h-4" />
                Estimate another
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="price-estimator" className="section-y bg-gradient-to-b from-muted/40 via-background to-muted/30" aria-label="Instant price estimate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent mb-2">Instant quote</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
            How Much Is Your Car Worth?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Get an instant quote in under a minute. See your price before we ask for any details.
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-1.5 sm:gap-2">
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold transition-all duration-300",
                  step >= s
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : s}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs font-medium hidden sm:inline transition-colors",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s === 1 ? "Vehicle" : s === 2 ? "Details" : s === 3 ? "Your Quote" : "Claim It"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg shadow-primary/[0.03] overflow-hidden">

            {/* Step 1: Vehicle Type & Make */}
            <div className={cn("transition-all duration-300", step === 1 ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Tell us about your vehicle</h3>
                    <p className="text-xs text-muted-foreground">Step 1 of {totalSteps}</p>
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
            <div className={cn("transition-all duration-300", step === 2 ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Year and condition</h3>
                    <p className="text-xs text-muted-foreground">Step 2 of {totalSteps} — {make} {vehicleType}</p>
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
                    See My Quote
                    <DollarSign className="ml-1.5 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Instant Quote */}
            <div className={cn("transition-all duration-300", step === 3 ? "block" : "hidden")}>
              {result && (
                <div className="p-5 sm:p-8">
                  {/* Quote display */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-semibold mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Your instant quote
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {year} {make} · {VEHICLE_TYPES.find((t) => t.value === vehicleType)?.label} · {CONDITIONS.find((c) => c.value === condition)?.label?.split(" — ")[0]}
                    </p>
                    <div className="flex items-baseline justify-center gap-2 sm:gap-3">
                      <span className="text-4xl sm:text-6xl font-display font-bold text-primary">
                        ${result.low.toLocaleString()}
                      </span>
                      <span className="text-2xl sm:text-3xl text-muted-foreground/50 font-medium">–</span>
                      <span className="text-4xl sm:text-6xl font-display font-bold text-accent">
                        ${result.high.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cash paid on pickup · Free towing · Same-day service
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

                  {/* Accept CTA */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <Button
                      onClick={() => setStep(4)}
                      className="h-14 px-10 bg-accent hover:bg-accent/90 text-white font-bold text-base group shadow-lg shadow-accent/25"
                    >
                      Accept This Quote
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Contact Details & Submit */}
            <div className={cn("transition-all duration-300", step === 4 ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                {/* Mini quote reminder */}
                {result && (
                  <div className="flex items-center justify-between bg-accent/5 border border-accent/15 rounded-xl px-4 py-3 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Your quote</p>
                      <p className="font-display font-bold text-foreground">
                        {year} {make} · <span className="text-accent">${result.low.toLocaleString()}–${result.high.toLocaleString()}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-primary hover:text-primary/80 font-medium min-h-[44px] px-2 touch-manipulation"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Claim your quote</h3>
                    <p className="text-xs text-muted-foreground">Step 4 of {totalSteps} — we&apos;ll call to confirm & arrange pickup</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-name" className="block text-sm font-semibold text-foreground mb-2">Your name</label>
                    <Input
                      id="est-name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="est-phone" className="block text-sm font-semibold text-foreground mb-2">Phone number</label>
                    <Input
                      id="est-phone"
                      type="tel"
                      placeholder="04XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                )}

                <div className="mt-6 sm:mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="h-14 px-10 bg-accent hover:bg-accent/90 text-white font-bold text-base shadow-lg shadow-accent/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Claim My Quote
                        <CheckCircle2 className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  We&apos;ll call to confirm the price and arrange free pickup. No obligation.
                </p>
              </div>
            </div>
          </div>

          {/* Trust note */}
          {step < 4 && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              {step < 3
                ? "No personal information required to see your quote."
                : "This is an indicative estimate. Your final offer is confirmed before pickup."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
