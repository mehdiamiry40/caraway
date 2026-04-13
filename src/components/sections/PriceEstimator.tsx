"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { Button } from "@/components/ui/button";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import {
  CONDITION_LABELS,
  quoteConditionValues,
  quoteFormSchema,
  type QuoteCondition,
} from "@/lib/quote-schema";
import { MAKE_OPTIONS, YEAR_OPTIONS, getModelOptions } from "@/data/car-models";
import { submitQuote } from "@/actions/quote";
import { trackEvent } from "@/lib/analytics";
import {
  Car, DollarSign, ArrowRight, ArrowLeft, RotateCcw,
  TrendingUp, CheckCircle2, Send, Loader2, PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const STORAGE_KEY = "caraway-estimator-state";

const CONDITIONS: Array<{ value: QuoteCondition; label: string }> =
  quoteConditionValues.map((value) => ({ value, label: CONDITION_LABELS[value] }));

type Step = 1 | 2 | 3 | 4;

type PersistedState = {
  step?: Step;
  make?: string;
  model?: string;
  year?: string;
  condition?: QuoteCondition | "";
  name?: string;
  phone?: string;
  address?: string;
};

function RequiredMark() {
  return <span aria-hidden="true" className="text-destructive ml-0.5">*</span>;
}

export function PriceEstimator() {
  const [step, setStep] = useState<Step>(1);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [yearTouched, setYearTouched] = useState(false);
  const [condition, setCondition] = useState<QuoteCondition | "">("");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const stepHeadingRefs = useRef<Array<HTMLElement | null>>([null, null, null, null]);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const estimatorStartedRef = useRef(false);
  const hydratedRef = useRef(false);
  const hasMountedRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable ref callbacks — created once, never trigger extra reconciliation.
  const headingRefCallbacks = useMemo(
    () => [0, 1, 2, 3].map((i) => (el: HTMLElement | null) => {
      stepHeadingRefs.current[i] = el;
    }),
    []
  );

  const liveMessage = isSuccess
    ? "Your quote request was submitted successfully."
    : isCalculating
      ? "Calculating your instant quote…"
      : step === 1
        ? "Step 1 of 4. Tell us about your vehicle."
        : step === 2
          ? "Step 2 of 4. Enter the year and condition."
          : step === 3
            ? "Step 3 of 4. Your instant quote is ready."
            : "Step 4 of 4. Enter your contact details to claim your quote.";

  const yearNumber = useMemo(() => Number(year), [year]);
  const yearIsValid = useMemo(
    () =>
      year !== "" &&
      Number.isFinite(yearNumber) &&
      yearNumber >= 1950 &&
      yearNumber <= CURRENT_YEAR + 1,
    [year, yearNumber]
  );
  const showYearError = useMemo(
    () => yearTouched && year !== "" && !yearIsValid,
    [yearTouched, year, yearIsValid]
  );

  const canProceedStep1 = useMemo(
    () => make.trim() !== "" && (make === "Other" || model.trim() !== ""),
    [make, model]
  );
  const canProceedStep2 = useMemo(
    () => yearIsValid && condition !== "",
    [yearIsValid, condition]
  );
  const canSubmit = useMemo(
    () => name.trim().length >= 2 && phone.trim().length >= 8 && address.trim().length >= 5,
    [name, phone, address]
  );

  const totalSteps = 4;
  const progressPercent = useMemo(
    () => (step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100),
    [step]
  );

  // Hydrate from sessionStorage on mount.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.make) setMake(parsed.make);
      if (parsed.model) setModel(parsed.model);
      if (parsed.year) setYear(parsed.year);
      if (parsed.condition) setCondition(parsed.condition);
      if (parsed.name) setName(parsed.name);
      if (parsed.phone) setPhone(parsed.phone);
      if (parsed.address) setAddress(parsed.address);
      // Only restore the step if everything that step depends on is present.
      if (parsed.step && parsed.step >= 2 && parsed.make) {
        setStep(2);
      }
    } catch (error) {
      // Corrupt/stale storage. Clear it so we don't get stuck on retry.
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // storage may be fully blocked — nothing we can do.
      }
      console.error("[PriceEstimator] hydrate failed:", error);
    }
  }, []);

  // Persist state on change — debounced so keystroke-level typing doesn't
  // run JSON.stringify + sessionStorage.setItem on every character.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      try {
        const payload: PersistedState = {
          step,
          make,
          model,
          year,
          condition,
          name,
          phone,
          address,
        };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore quota / disabled storage
      }
    }, 400);
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [step, make, model, year, condition, name, phone, address]);

  // Clear stored state on success.
  useEffect(() => {
    if (!isSuccess) return;
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [isSuccess]);

  // Fire estimator_started once on first make input.
  useEffect(() => {
    if (estimatorStartedRef.current) return;
    if (make.trim() !== "") {
      estimatorStartedRef.current = true;
      trackEvent("estimator_started", { make: make.trim() });
    }
  }, [make]);

  // Fire estimator_abandoned when the user leaves mid-flow.
  useEffect(() => {
    if (!estimatorStartedRef.current || isSuccess) return;

    const handleLeave = () => {
      trackEvent("estimator_abandoned", {
        step,
        make: make.trim(),
        model: model.trim(),
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleLeave();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [step, make, model, isSuccess]);

  const goToStep = useCallback((next: Step) => {
    setStep(next);
    trackEvent("estimator_step_completed", { step: next - 1 });
  }, []);

  function handleEstimate() {
    if (!canProceedStep2 || isCalculating) return;
    setIsCalculating(true);
    const est = estimatePrice({
      make,
      model,
      year: yearNumber,
      condition,
    });
    setResult(est);
    // Small artificial delay so the result feels deliberate, not random.
    window.setTimeout(() => {
      setIsCalculating(false);
      setStep(3);
      trackEvent("estimator_step_completed", { step: 3 });
      trackEvent("estimator_quote_shown", {
        estimateQuote: est.quote,
        make: make.trim(),
        model: model.trim(),
        year: yearNumber,
        condition: condition || null,
      });
    }, 600);
  }

  function validateName(value: string): string | null {
    const result = quoteFormSchema.shape.name.safeParse(value);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Enter your name";
  }

  function validatePhone(value: string): string | null {
    const result = quoteFormSchema.shape.phone.safeParse(value);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Enter a valid Australian phone number";
  }

  function validateAddress(value: string): string | null {
    const trimmed = value.trim();
    if (trimmed.length < 5) return "Enter a pickup address";
    if (trimmed.length > 500) return "Address is too long";
    return null;
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    if (!canSubmit || !result || condition === "") return;

    // Honeypot — silently pretend success, same pattern as QuoteForm.
    if (honeypot.trim() !== "") {
      setIsSuccess(true);
      return;
    }

    // Blur-level validation before submission.
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const addressErr = validateAddress(address);
    setNameTouched(true);
    setPhoneTouched(true);
    setAddressTouched(true);
    setNameError(nameErr);
    setPhoneError(phoneErr);
    setAddressError(addressErr);
    if (nameErr || phoneErr || addressErr) {
      const firstErrorId = nameErr
        ? "est-name"
        : phoneErr
          ? "est-phone"
          : "est-address";
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const res = await submitQuote({
      name: name.trim(),
      phone: phone.trim(),
      make: make.trim(),
      model: model.trim(),
      year: yearNumber,
      condition,
      address: address.trim(),
      quoteAmount: result.quote,
      honeypot: "",
      marketingConsent: false,
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      trackEvent("estimator_submitted", {
        estimateQuote: result.quote,
        make: make.trim(),
        model: model.trim(),
        year: yearNumber,
        condition,
      });
    } else {
      const reason = res.message ?? "unknown";
      setSubmitError(res.message ?? "Something went wrong. Please try again.");
      trackEvent("estimator_submit_failed", { reason });
    }
  }

  function handleReset() {
    setStep(1);
    setMake("");
    setModel("");
    setYear("");
    setYearTouched(false);
    setCondition("");
    setResult(null);
    setIsCalculating(false);
    setName("");
    setNameTouched(false);
    setNameError(null);
    setPhone("");
    setPhoneTouched(false);
    setPhoneError(null);
    setAddress("");
    setAddressTouched(false);
    setAddressError(null);
    setHoneypot("");
    setSubmitError("");
    setIsSuccess(false);
    estimatorStartedRef.current = false;
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (isSuccess) {
      successHeadingRef.current?.focus();
      return;
    }
    stepHeadingRefs.current[step - 1]?.focus();
  }, [isSuccess, step]);

  if (isSuccess) {
    return (
      <section id="price-estimator" className="section-y bg-muted" aria-label="Quote submitted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-border/60 shadow-md p-6 sm:p-10 text-center" role="status" aria-live="polite" aria-atomic="true">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 mx-auto mb-5">
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-accent" aria-hidden="true" />
            </div>
            <h3
              ref={successHeadingRef}
              tabIndex={-1}
              className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Your quote is on its way!
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-2">
              We received your details for your <strong>{year} {[make, model].filter(Boolean).join(" ")}</strong>. We&apos;ll confirm your final price within the hour.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent font-bold text-lg sm:text-xl rounded-full px-6 py-2 mb-4">
              <DollarSign className="w-5 h-5" aria-hidden="true" />
              ${result?.quote.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;ll contact you shortly to confirm a final price. No obligation — if the offer doesn&apos;t work for you, no worries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all touch-manipulation"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Estimate another
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="price-estimator" className="section-y bg-muted" aria-label="Instant price estimate">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
            How Much Is Your Car Worth?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Get an instant quote in under a minute. See your price before we ask for any details.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="max-w-2xl mx-auto mb-8"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quote progress"
          aria-valuetext={`Step ${step} of ${totalSteps}`}
        >
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-1.5 sm:gap-2">
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-bold transition-colors duration-200",
                  step >= s
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" /> : s}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs font-medium transition-colors",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  <span className="sm:hidden">
                    {s === 1 ? "Vehicle" : s === 2 ? "Details" : s === 3 ? "Quote" : "Claim"}
                  </span>
                  <span className="hidden sm:inline">
                    {s === 1 ? "Vehicle" : s === 2 ? "Details" : s === 3 ? "Your Quote" : "Claim It"}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden border border-border/40">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-border/60 shadow-md overflow-hidden">

            {/* Honeypot — visually hidden, aria-hidden, out of tab order. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="est-website">Website</label>
              <input
                type="text"
                id="est-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Step 1 */}
            <div className={cn("transition-all duration-300", step === 1 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary">
                    <Car className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      ref={headingRefCallbacks[0]}
                      tabIndex={-1}
                      className="font-display font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      Tell us about your vehicle
                    </h3>
                    <p className="text-xs text-muted-foreground">Step 1 of {totalSteps}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-make" className="block text-sm font-semibold text-foreground mb-2">
                      Make<RequiredMark />
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
                      <label htmlFor="est-model" className="block text-sm font-semibold text-foreground mb-2">
                        Model<RequiredMark />
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
                </div>

                <div className="mt-6 sm:mt-8 flex justify-end">
                  <Button
                    onClick={() => canProceedStep1 && goToStep(2)}
                    disabled={!canProceedStep1}
                    className="h-12 px-8 group"
                  >
                    Next
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={cn("transition-all duration-300", step === 2 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary">
                    <TrendingUp className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      ref={headingRefCallbacks[1]}
                      tabIndex={-1}
                      className="font-display font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      Year and condition
                    </h3>
                    <p className="text-xs text-muted-foreground">Step 2 of {totalSteps} — {[make, model].filter(Boolean).join(" ")}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-year" className="block text-sm font-semibold text-foreground mb-2">
                      Year of manufacture<RequiredMark />
                    </label>
                    <Select
                      id="est-year"
                      placeholder="Select year..."
                      options={YEAR_OPTIONS}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      onBlur={() => setYearTouched(true)}
                      aria-required="true"
                      aria-invalid={year !== "" && !yearIsValid}
                      aria-describedby="est-year-error"
                    />
                    {showYearError && (
                      <p id="est-year-error" className="mt-1 text-xs text-destructive" role="alert">
                        Enter a year between 1950 and {CURRENT_YEAR + 1}.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-condition" className="block text-sm font-semibold text-foreground mb-2">
                      Condition<RequiredMark />
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

                <div className="mt-6 sm:mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                  </button>
                  <Button
                    onClick={() => {
                      setYearTouched(true);
                      handleEstimate();
                    }}
                    disabled={!canProceedStep2 || isCalculating}
                    variant="secondary"
                    className="h-12 px-8 font-bold group"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        See My Quote
                        <DollarSign className="ml-1.5 w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Calculating */}
            {isCalculating && (
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" aria-hidden="true" />
                <p className="font-display font-bold text-foreground">Calculating your quote…</p>
                <p className="text-xs text-muted-foreground mt-1">Crunching market data for your {[make, model].filter(Boolean).join(" ")}</p>
              </div>
            )}

            {/* Step 3 */}
            <div className={cn("transition-all duration-300", step === 3 && !isCalculating ? "block" : "hidden")}>
              {result && (
                <div className="p-5 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-semibold mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Your instant quote
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {year} {[make, model].filter(Boolean).join(" ")} · {condition ? CONDITION_LABELS[condition].split(" — ")[0] : ""}
                    </p>
                    <div
                      ref={headingRefCallbacks[2]}
                      tabIndex={-1}
                      className="flex items-baseline justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <span className="text-5xl sm:text-7xl font-display font-bold text-accent">
                        ${result.quote.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Final price confirmed before pickup · Free towing · Same-day slots
                    </p>
                  </div>

                  {result.factors.length > 0 && (
                    <div className="bg-muted rounded-lg p-4 mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What affects your price</p>
                      <ul className="space-y-1.5">
                        {result.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                    </button>
                    <Button
                      onClick={() => goToStep(4)}
                      variant="secondary"
                      className="h-14 px-10 font-bold text-base group"
                    >
                      Continue — get my price
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div className={cn("transition-all duration-300", step === 4 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                {result && (
                  <div className="flex items-center justify-between bg-muted border border-border/40 rounded-lg px-4 py-3 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Your quote</p>
                      <p className="font-display font-bold text-foreground">
                        {year} {[make, model].filter(Boolean).join(" ")} · <span className="text-accent">${result.quote.toLocaleString()}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="text-xs text-primary hover:text-primary/80 font-medium min-h-[44px] px-2 touch-manipulation"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
                    <Send className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      ref={headingRefCallbacks[3]}
                      tabIndex={-1}
                      className="font-display font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      Where should we send it?
                    </h3>
                    <p className="text-xs text-muted-foreground">Step 4 of {totalSteps} — we&apos;ll call to confirm & arrange pickup</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="est-name" className="block text-sm font-semibold text-foreground mb-2">
                      Your name<RequiredMark />
                    </label>
                    <Input
                      id="est-name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameTouched) setNameError(validateName(e.target.value));
                      }}
                      onBlur={() => {
                        setNameTouched(true);
                        setNameError(validateName(name));
                      }}
                      autoComplete="name"
                      enterKeyHint="next"
                      maxLength={200}
                      aria-required="true"
                      aria-invalid={nameTouched && nameError ? true : undefined}
                      aria-describedby={nameTouched && nameError ? "est-name-error" : undefined}
                    />
                    {nameTouched && nameError && (
                      <p id="est-name-error" className="mt-1 text-xs text-destructive" role="alert">
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-phone" className="block text-sm font-semibold text-foreground mb-2">
                      Phone number<RequiredMark />
                    </label>
                    <Input
                      id="est-phone"
                      type="tel"
                      placeholder="04XX XXX XXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneTouched) setPhoneError(validatePhone(e.target.value));
                      }}
                      onBlur={() => {
                        setPhoneTouched(true);
                        setPhoneError(validatePhone(phone));
                      }}
                      autoComplete="tel"
                      enterKeyHint="send"
                      maxLength={20}
                      aria-required="true"
                      aria-describedby={
                        phoneTouched && phoneError ? "est-phone-error est-phone-help" : "est-phone-help"
                      }
                      aria-invalid={phoneTouched && phoneError ? true : undefined}
                    />
                    <p className="text-xs text-muted-foreground mt-1" id="est-phone-help">
                      Australian numbers only, e.g. 0412 345 678
                    </p>
                    {phoneTouched && phoneError && (
                      <p id="est-phone-error" className="mt-1 text-xs text-destructive" role="alert">
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-address" className="block text-sm font-semibold text-foreground mb-2">
                      Pickup address<RequiredMark />
                    </label>
                    <AddressAutocomplete
                      id="est-address"
                      placeholder="Start typing your address..."
                      value={address}
                      onChange={(next) => {
                        setAddress(next);
                        if (addressTouched) setAddressError(validateAddress(next));
                      }}
                      onPlaceSelected={(picked) => {
                        setAddressTouched(true);
                        setAddressError(validateAddress(picked));
                      }}
                      onBlur={() => {
                        setAddressTouched(true);
                        setAddressError(validateAddress(address));
                      }}
                      autoComplete="street-address"
                      enterKeyHint="send"
                      maxLength={500}
                      aria-required="true"
                      aria-invalid={addressTouched && addressError ? true : undefined}
                      aria-describedby={
                        addressTouched && addressError ? "est-address-error est-address-help" : "est-address-help"
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1" id="est-address-help">
                      Where should we collect the vehicle? Select from suggestions or type manually.
                    </p>
                    {addressTouched && addressError && (
                      <p id="est-address-error" className="mt-1 text-xs text-destructive" role="alert">
                        {addressError}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3" role="alert">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                )}

                <div className="mt-6 sm:mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px] touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                  </button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    variant="secondary"
                    className="h-14 px-10 font-bold text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Claim My Quote
                        <CheckCircle2 className="ml-2 w-5 h-5" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  We only use your details to confirm your quote. Read our{" "}
                  <Link href="/privacy" className="underline">privacy policy</Link>.
                </p>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  We&apos;ll call to confirm the price and arrange free pickup. No obligation.
                </p>
              </div>
            </div>
          </div>

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
