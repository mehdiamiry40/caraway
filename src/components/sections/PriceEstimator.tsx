"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Car, ArrowRight, ArrowLeft, RotateCcw,
  CheckCircle2, Send, Loader2, PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const STORAGE_KEY = "caraway-estimator-state";

const CONDITIONS: Array<{ value: QuoteCondition; label: string }> =
  quoteConditionValues.map((value) => ({ value, label: CONDITION_LABELS[value] }));

type Step = 1 | 2 | 3;

// Persisted state intentionally excludes PII (name, phone, address) so that
// only Step 1 vehicle inputs survive a refresh; Step 3 contact details are
// never written to sessionStorage. No personal information leaves the
// in-memory component state before submit.
type PersistedState = {
  step?: Step;
  make?: string;
  model?: string;
  year?: string;
  condition?: QuoteCondition | "";
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
  // One ref per step heading, kept as individual refs (not an array of
  // callback refs) so react-hooks/refs is satisfied without any
  // ref-callback indexing during render.
  const step1HeadingRef = useRef<HTMLHeadingElement>(null);
  const step2HeadingRef = useRef<HTMLDivElement>(null);
  const step3HeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const estimatorStartedRef = useRef(false);
  const hydratedRef = useRef(false);
  const hasMountedRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const liveMessage = isSuccess
    ? "Your quote request was submitted successfully."
    : isCalculating
      ? "Calculating your instant quote…"
      : step === 1
        ? "Step 1 of 3. Tell us about your vehicle."
        : step === 2
          ? "Step 2 of 3. Your instant quote is ready."
          : "Step 3 of 3. Enter your contact details to claim your quote.";

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

  const canCalculate = useMemo(
    () =>
      make.trim() !== "" &&
      (make === "Other" || model.trim() !== "") &&
      yearIsValid &&
      condition !== "",
    [make, model, yearIsValid, condition]
  );
  const canSubmit = useMemo(
    () => name.trim().length >= 2 && phone.trim().length >= 8 && address.trim().length >= 5,
    [name, phone, address]
  );

  const totalSteps = 3;
  const progressPercent = useMemo(
    () => (step === 1 ? 33 : step === 2 ? 66 : 100),
    [step]
  );

  // Hydrate from sessionStorage on mount. We can't use lazy state
  // initializers here because reading storage during render would cause
  // a hydration mismatch (server has no window.sessionStorage, client
  // does) — the setState flush is intentional and happens exactly once
  // per mount, guarded by `hydratedRef`.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount hydration; see block comment above.
      if (parsed.make) setMake(parsed.make);
      if (parsed.model) setModel(parsed.model);
      if (parsed.year) setYear(parsed.year);
      if (parsed.condition) setCondition(parsed.condition);
      // Step 1 now holds all vehicle inputs, so rehydration simply refills the
      // fields — the user still needs to click "See my quote" to recalculate.
      // Step 2 (quote) and Step 3 (PII) are never restored: the quote result
      // lives only in memory and PII is never persisted.
    } catch (error) {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch (innerError) {
        console.warn(
          "[PriceEstimator] hydrate cleanup failed:",
          innerError instanceof Error ? innerError.message : String(innerError),
        );
      }
      console.warn(
        "[PriceEstimator] hydrate failed:",
        error instanceof Error ? error.message : String(error),
      );
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
        };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn(
          "[PriceEstimator] persist failed:",
          err instanceof Error ? err.message : String(err),
        );
      }
    }, 400);
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [step, make, model, year, condition]);

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
    if (!canCalculate || isCalculating) return;
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
      setStep(2);
      trackEvent("estimator_step_completed", { step: 2 });
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
      document.getElementById(firstErrorId)?.focus({ preventScroll: true });
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
      trackEvent("lead_submitted", {
        source: "estimator",
        estimate_quote: result.quote,
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
    // Use preventScroll so focusing a step heading for accessibility
    // doesn't yank the page — combined with `scroll-behavior: smooth`
    // this was causing a "drag" while the user scrolled past the
    // "How Much Is Your Car Worth?" section, e.g. when sessionStorage
    // hydration moves the form from step 1 to step 2 mid-mount.
    if (isSuccess) {
      successHeadingRef.current?.focus({ preventScroll: true });
      return;
    }
    const refs = [step1HeadingRef, step2HeadingRef, step3HeadingRef];
    refs[step - 1]?.current?.focus({ preventScroll: true });
  }, [isSuccess, step]);

  if (isSuccess) {
    return (
      <section id="price-estimator" className="section-y bg-background relative overflow-hidden" aria-label="Quote submitted">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--grad-violet)/0.14),transparent_60%)]" />
        <div className="site-container">
          <div className="bg-card rounded-2xl border border-border shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06),0_32px_64px_-12px_hsl(var(--shadow-color)/0.1)] p-6 sm:p-10 text-center max-w-2xl mx-auto" role="status" aria-live="polite" aria-atomic="true">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 mx-auto mb-5">
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3
              ref={successHeadingRef}
              tabIndex={-1}
              className="font-display font-semibold text-xl sm:text-2xl text-foreground mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Your quote is on its way.
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-5">
              We received your details for your <strong className="text-foreground font-semibold">{year} {[make, model].filter(Boolean).join(" ")}</strong>. We&apos;ll confirm your final price within the hour.
            </p>
            <div className="quote-card max-w-xs mx-auto px-5 py-4 text-left mb-5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                <span className="ml-auto text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">Offer sent</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-[0.8125rem] text-[hsl(var(--on-dark))]">Your quote</span>
                <span className="font-mono tabular-nums text-xl font-medium text-[hsl(var(--on-dark-hi))]">
                  ${result?.quote.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;ll contact you shortly to confirm a final price. No obligation — if the offer doesn&apos;t work for you, no worries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Estimate another
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="price-estimator" className="section-y bg-background relative overflow-hidden" aria-label="Instant price estimate">
      <div aria-hidden="true" className="absolute inset-x-0 top-16 -z-10 h-[55%] bg-[radial-gradient(ellipse_at_center,hsl(var(--grad-violet)/0.16),transparent_65%)]" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="site-container">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Instant valuation</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            How much is your car worth?
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Answer four quick questions. We&apos;ll send back a firm cash offer for your car — no account, no spam.
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
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-[0.8125rem] font-medium transition-[background-color,color,border-color] duration-300",
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} aria-hidden="true" /> : s}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors hidden sm:inline",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s === 1 ? "Vehicle" : s === 2 ? "Your quote" : "Claim it"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-border/70 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--grad-violet)))]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06),0_32px_64px_-12px_hsl(var(--shadow-color)/0.1)] overflow-hidden">

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

            {/* Step 1 — Vehicle (make, model, year, condition) */}
            <div className={cn("transition-all duration-300", step === 1 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-7">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                    <Car className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3
                    ref={step1HeadingRef}
                    tabIndex={-1}
                    className="font-display font-semibold text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Tell us about your vehicle
                  </h3>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="est-make" className="block text-sm font-semibold text-foreground mb-2.5">
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
                      <label htmlFor="est-model" className="block text-sm font-semibold text-foreground mb-2.5">
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
                  <div>
                    <label htmlFor="est-year" className="block text-sm font-semibold text-foreground mb-2.5">
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
                      <p id="est-year-error" className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium" role="alert">
                        <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        Enter a year between 1950 and {CURRENT_YEAR + 1}.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-condition" className="block text-sm font-semibold text-foreground mb-2.5">
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

                <div className="mt-7 sm:mt-9 flex justify-end">
                  <Button
                    onClick={() => {
                      setYearTouched(true);
                      handleEstimate();
                    }}
                    disabled={!canCalculate || isCalculating}
                    variant="default"
                    size="lg"
                    className="group"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                        Calculating…
                      </>
                    ) : (
                      <>
                        See my quote
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
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
              </div>
            )}

            {/* Step 2 — Your Quote (Stripe-style dark "quote result" card) */}
            <div className={cn("transition-all duration-300", step === 2 && !isCalculating ? "block" : "hidden")}>
              {result && (
                <div className="p-5 sm:p-8">
                  <div className="quote-card p-5 sm:p-6 mb-6">
                    <div className="flex items-center gap-1.5 mb-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-3 inline-flex items-center gap-2 text-[0.75rem] font-medium text-[hsl(var(--on-dark-hi))] border-b-2 border-[hsl(var(--grad-violet))] pb-1">
                        Your quote
                      </span>
                      <span className="text-[0.75rem] font-medium text-[hsl(var(--on-dark))] pb-1">
                        Your car
                      </span>
                    </div>
                    <div
                      ref={step2HeadingRef}
                      tabIndex={-1}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--grad-violet))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--ink))] rounded"
                    >
                      <p className="text-[0.8125rem] text-[hsl(var(--on-dark))] mb-1">
                        {year} {[make, model].filter(Boolean).join(" ")} · {condition ? CONDITION_LABELS[condition].split(" — ")[0] : ""}
                      </p>
                      <p className="font-mono tabular-nums text-4xl sm:text-5xl font-medium text-[hsl(var(--on-dark-hi))] tracking-[-0.02em]">
                        ${result.quote.toLocaleString()}
                      </p>
                      <p className="mt-1 text-[0.75rem] uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">
                        Instant estimate · firm offer within the hour
                      </p>
                    </div>
                  </div>

                  {result.factors.length > 0 && (
                    <div className="bg-muted/60 rounded-xl p-4 mb-6 border border-border/60">
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground mb-2">What affects your price</p>
                      <ul className="space-y-1.5">
                        {result.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      onClick={() => goToStep(1)}
                      variant="outline"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                    </Button>
                    <Button
                      onClick={() => goToStep(3)}
                      variant="default"
                      size="lg"
                      className="group"
                    >
                      Claim my quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 — Claim (contact details) */}
            <div className={cn("transition-all duration-300", step === 3 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                {result && (
                  <div className="flex items-center justify-between gap-3 bg-muted/60 border border-border/60 rounded-xl px-4 py-3 mb-7">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Your quote</p>
                      <p className="font-medium text-foreground truncate">
                        {year} {[make, model].filter(Boolean).join(" ")} · <span className="font-mono tabular-nums text-primary">${result.quote.toLocaleString()}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="text-xs text-primary hover:text-primary/80 font-medium min-h-[44px] px-3 rounded-md touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-7">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                    <Send className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3
                    ref={step3HeadingRef}
                    tabIndex={-1}
                    className="font-display font-semibold text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Where should we send it?
                  </h3>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="est-name" className="block text-sm font-semibold text-foreground mb-2.5">
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
                      inputMode="text"
                      enterKeyHint="next"
                      maxLength={200}
                      aria-required="true"
                      aria-invalid={nameTouched && nameError ? true : undefined}
                      aria-describedby={nameTouched && nameError ? "est-name-error" : undefined}
                    />
                    {nameTouched && nameError && (
                      <p id="est-name-error" className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium" role="alert">
                        <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-phone" className="block text-sm font-semibold text-foreground mb-2.5">
                      Phone number<RequiredMark />
                    </label>
                    <Input
                      id="est-phone"
                      type="tel"
                      inputMode="tel"
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
                        phoneTouched && phoneError ? "est-phone-error" : undefined
                      }
                      aria-invalid={phoneTouched && phoneError ? true : undefined}
                    />
                    {phoneTouched && phoneError && (
                      <p id="est-phone-error" className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium" role="alert">
                        <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="est-address" className="block text-sm font-semibold text-foreground mb-2.5">
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
                        addressTouched && addressError ? "est-address-error" : undefined
                      }
                    />
                    {addressTouched && addressError && (
                      <p id="est-address-error" className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium" role="alert">
                        <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {addressError}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
                    <p className="text-sm text-destructive font-medium">{submitError}</p>
                  </div>
                )}

                <div className="mt-7 sm:mt-9 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    onClick={() => goToStep(2)}
                    variant="outline"
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    variant="default"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Claim my quote
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
