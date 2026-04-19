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
  Car, DollarSign, ArrowRight, ArrowLeft, RotateCcw,
  CheckCircle2, Send, Loader2, PartyPopper, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/site";

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

const estimatorBenefits = [
  {
    title: "Instant starting price",
    detail: "A fast range based on your car details before anyone calls.",
  },
  {
    title: "Quote confirmed before pickup",
    detail: "We lock in the number before the truck is dispatched.",
  },
  {
    title: "No-pressure process",
    detail: "If the offer is not for you, you can walk away with no obligation.",
  },
  {
    title: "Pickup sorted quickly",
    detail: "Same-day or next-day windows when truck availability allows.",
  },
] as const;

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
      <section id="price-estimator" className="section-y bg-secondary/70" aria-label="Quote submitted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
            <div className="surface-dark p-6 sm:p-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                What happens next
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-primary-foreground">
                We&apos;ll call to confirm the final number and pickup window.
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-primary-foreground/78">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  Expect a call within the hour during business hours.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  We confirm the vehicle details and lock in the pickup time.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  If the offer does not suit, there is no obligation to proceed.
                </li>
              </ul>
              <a
                href={BUSINESS.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "estimator_success" })}
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/7 px-5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {BUSINESS.phoneFriendly}
              </a>
            </div>

            <div className="surface-card p-6 text-center sm:p-10" role="status" aria-live="polite" aria-atomic="true">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 sm:h-20 sm:w-20">
                <PartyPopper className="h-8 w-8 text-accent sm:h-10 sm:w-10" aria-hidden="true" />
              </div>
              <h3
                ref={successHeadingRef}
                tabIndex={-1}
                className="mb-2 rounded font-display text-xl font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-2xl"
              >
                Your quote request is in.
              </h3>
              <p className="mb-2 text-sm text-muted-foreground sm:text-base">
                We received your details for{" "}
                <strong>{year} {[make, model].filter(Boolean).join(" ")}</strong>.
              </p>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-6 py-2 text-lg font-bold text-accent sm:text-xl">
                <DollarSign className="h-5 w-5" aria-hidden="true" />
                ${result?.quote.toLocaleString()}
              </div>
              <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                This is your current estimate. We&apos;ll confirm the final price
                and pickup timing directly with you. No obligation if the offer
                doesn&apos;t work for you.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button type="button" onClick={handleReset} variant="outline" size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Estimate another
                </Button>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

  return (
    <section id="price-estimator" className="section-y relative overflow-hidden bg-secondary/70" aria-label="Instant price estimate">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.08),transparent_34%)]" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Instant quote</p>
            <h2 className="mt-5 text-3xl font-display font-bold leading-[1.04] tracking-[-0.02em] text-foreground text-balance sm:text-4xl md:text-[2.75rem]">
              See your likely price before you speak to anyone.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with the vehicle details. We turn that into a fast estimate,
              then confirm the final price and pickup window directly with you.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {estimatorBenefits.map((item) => (
                <div key={item.title} className="surface-card px-5 py-5">
                  <p className="text-sm font-semibold tracking-tight text-primary">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="surface-dark mt-8 p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                Prefer to talk it through?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/78">
                Call us and we can sanity-check the car details before you book
                the pickup.
              </p>
              <a
                href={BUSINESS.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "estimator_sidebar" })}
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/7 px-5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {BUSINESS.phoneFriendly}
              </a>
            </div>
          </div>

          <div>
            <div
              className="surface-card mb-6 px-5 py-5 sm:px-6"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quote progress"
              aria-valuetext={`Step ${step} of ${totalSteps}`}
            >
              <div className="mb-2 flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-1.5 sm:gap-2">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 sm:h-10 sm:w-10 sm:text-base",
                      step >= s
                        ? "bg-primary text-white"
                        : "bg-card border border-border/80 text-muted-foreground"
                    )}>
                      {step > s ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" /> : s}
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium transition-colors sm:text-xs",
                      step >= s ? "text-foreground" : "text-muted-foreground"
                    )}>
                      <span className="sm:hidden">
                        {s === 1 ? "Vehicle" : s === 2 ? "Quote" : "Claim"}
                      </span>
                      <span className="hidden sm:inline">
                        {s === 1 ? "Vehicle" : s === 2 ? "Your Quote" : "Claim It"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full border border-border/40 bg-muted">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="surface-card overflow-hidden">

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
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary">
                    <Car className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3
                    ref={step1HeadingRef}
                    tabIndex={-1}
                    className="font-display font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Tell us about your vehicle
                  </h3>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  We only need the basics to generate a fast starting price.
                </p>

                <fieldset className="space-y-5 sm:space-y-6">
                  <legend className="sr-only">Vehicle details</legend>
                  <div>
                    <label htmlFor="est-make" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                      <label htmlFor="est-model" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                    <label htmlFor="est-year" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                    <label htmlFor="est-condition" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                </fieldset>

                <div className="mt-6 flex justify-end sm:mt-8">
                  <Button
                    onClick={() => {
                      setYearTouched(true);
                      handleEstimate();
                    }}
                    disabled={!canCalculate || isCalculating}
                    variant="secondary"
                    size="lg"
                    className="font-bold group"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
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
                <p className="mt-4 text-sm text-muted-foreground">
                  No email needed at this stage. You only share contact details if the estimate looks right.
                </p>
              </div>
            </div>

            {/* Calculating */}
            {isCalculating && (
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary motion-reduce:animate-none" aria-hidden="true" />
                <p className="font-display font-bold text-foreground">Calculating your quote…</p>
              </div>
            )}

            {/* Step 2 — Your Quote */}
            <div className={cn("transition-all duration-300", step === 2 && !isCalculating ? "block" : "hidden")}>
              {result && (
                <div className="p-5 sm:p-8">
                  <div className="rounded-xl bg-accent/10 border border-accent/30 p-6 sm:p-8 text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent rounded-full px-3 py-1 text-xs font-semibold mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Your instant quote
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {year} {[make, model].filter(Boolean).join(" ")} · {condition ? CONDITION_LABELS[condition].split(" — ")[0] : ""}
                    </p>
                    <div
                      ref={step2HeadingRef}
                      tabIndex={-1}
                      className="flex items-baseline justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <span className="text-4xl sm:text-5xl font-display font-bold text-foreground">
                        ${result.quote.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      If the vehicle matches what you entered, this is the number we work from when we confirm pickup.
                    </p>
                  </div>

                  {result.factors.length > 0 && (
                    <div className="bg-muted rounded-xl p-4 mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What affects your price</p>
                      <ul className="space-y-1.5">
                        {result.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-6 rounded-xl border border-border/50 bg-card/60 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Before you continue
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Step 3 only asks for your phone number and pickup address so we can confirm the final quote and book the truck.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      onClick={() => goToStep(1)}
                      variant="outline"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" /> Back
                    </Button>
                    <Button
                      onClick={() => goToStep(3)}
                      variant="secondary"
                      size="lg"
                      className="font-bold group"
                    >
                      Continue — get my price
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 — Claim (contact details) */}
            <div className={cn("transition-all duration-300", step === 3 && !isCalculating ? "block" : "hidden")}>
              <div className="p-5 sm:p-8">
                {result && (
                  <div className="flex items-center justify-between bg-muted border border-border/40 rounded-xl px-4 py-3 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Your quote</p>
                      <p className="font-display font-bold text-foreground">
                        {year} {[make, model].filter(Boolean).join(" ")} · <span className="text-accent">${result.quote.toLocaleString()}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
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
                  <h3
                    ref={step3HeadingRef}
                    tabIndex={-1}
                    className="font-display font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Where should we send it?
                  </h3>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  We use these details only to confirm the quote and schedule your pickup.
                </p>

                <fieldset className="space-y-5 sm:space-y-6">
                  <legend className="sr-only">Contact details</legend>
                  <div>
                    <label htmlFor="est-name" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                    <label htmlFor="est-phone" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                    <label htmlFor="est-address" className="mb-2.5 block text-sm font-semibold text-foreground">
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
                </fieldset>

                {submitError && (
                  <div className="mt-4 flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3" role="alert">
                    <p className="text-sm text-destructive font-medium">{submitError}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    onClick={() => goToStep(2)}
                    variant="outline"
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    variant="secondary"
                    size="lg"
                    className="font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
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

                <p className="mt-4 text-sm text-muted-foreground">
                  Need help instead? Call{" "}
                  <a
                    href={BUSINESS.phoneHref}
                    onClick={() => trackEvent("phone_click", { location: "estimator_step3" })}
                    className="font-semibold text-primary underline decoration-accent/30 underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
                  >
                    {BUSINESS.phoneFriendly}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
