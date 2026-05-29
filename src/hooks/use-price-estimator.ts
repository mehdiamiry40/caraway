"use client";

import { useCallback, useMemo, useState } from "react";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import { type QuoteCondition } from "@/lib/quote-schema";
import {
  validateName,
  validatePhone,
  validateAddress,
} from "@/lib/estimator-validators";
import { type Step } from "@/lib/persisted-estimator-state";
import { submitQuote } from "@/actions/quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";
import { useEstimatorPersistence } from "@/hooks/use-estimator-persistence";
import { useEstimatorAnalytics } from "@/hooks/use-estimator-analytics";
import { useEstimatorFocus } from "@/hooks/use-estimator-focus";

const CURRENT_YEAR = new Date().getFullYear();
const CALCULATE_DELAY_MS = 600;

export type { Step };

export function usePriceEstimator() {
  const [step, setStep] = useState<Step>(1);

  // Vehicle (Step 1)
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [yearTouched, setYearTouched] = useState(false);
  const [condition, setCondition] = useState<QuoteCondition | "">("");

  // Quote (Step 2)
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Contact (Step 3)
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
    () =>
      name.trim().length >= 2 &&
      phone.trim().length >= 8 &&
      address.trim().length >= 5,
    [name, phone, address]
  );

  const totalSteps = 3;
  const progressPercent = useMemo(
    () => (step === 1 ? 33 : step === 2 ? 66 : 100),
    [step]
  );

  const liveMessage = isSuccess
    ? "Your quote request was submitted successfully."
    : isCalculating
      ? "Calculating your instant quote…"
      : step === 1
        ? "Step 1 of 3. Tell us about your vehicle."
        : step === 2
          ? "Step 2 of 3. Your instant quote is ready."
          : "Step 3 of 3. Enter your contact details to claim your quote.";

  const persistedPayload = useMemo(
    () => ({ step, make, model, year, condition }),
    [step, make, model, year, condition]
  );

  useEstimatorPersistence({
    payload: persistedPayload,
    isSuccess,
    onHydrated: useCallback((parsed) => {
      // Step 1 holds all vehicle inputs, so rehydration simply refills the
      // fields — the user still needs to click "See my quote" to recalculate.
      // Step 2 (quote) and Step 3 (PII) are never restored: the quote result
      // lives only in memory and PII is never persisted.
      if (parsed.make) setMake(parsed.make);
      if (parsed.model) setModel(parsed.model);
      if (parsed.year) setYear(parsed.year);
      if (parsed.condition) setCondition(parsed.condition);
    }, []),
  });

  const analytics = useEstimatorAnalytics({ step, make, model, isSuccess });

  const {
    step1HeadingRef,
    step2HeadingRef,
    step3HeadingRef,
    successHeadingRef,
  } = useEstimatorFocus({ step, isSuccess });

  const goToStep = useCallback((next: Step) => {
    setStep(next);
    trackEvent("estimator_step_completed", { step: next - 1 });
  }, []);

  const handleEstimate = useCallback(() => {
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
    }, CALCULATE_DELAY_MS);
  }, [canCalculate, isCalculating, make, model, yearNumber, condition]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    // Note: we intentionally do NOT gate on canSubmit here — the validation
    // block below runs on click and focuses the first invalid field, so the
    // submit button can stay enabled (disabled buttons give no feedback).
    if (!result || condition === "") return;

    // Honeypot — silently pretend success, same pattern as QuoteForm.
    if (honeypot.trim() !== "") {
      setIsSuccess(true);
      return;
    }

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

    try {
      const res = await submitQuote({
        name: name.trim(),
        phone: phone.trim(),
        make: make.trim(),
        // "Other" make hides the model field, so default the empty model to
        // "Other" — the server schema requires a non-empty model, and without
        // this every "Other"-make lead silently failed validation.
        model: model.trim() || "Other",
        year: yearNumber,
        condition,
        address: address.trim(),
        quoteAmount: result.quote,
        honeypot: "",
        marketingConsent,
      });

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
        setSubmitError(
          res.message ??
            `Something went wrong. Please try again or call ${BUSINESS.phoneDisplay}.`,
        );
        trackEvent("estimator_submit_failed", { reason });
      }
    } catch {
      setSubmitError(
        `Something went wrong. Please try again or call ${BUSINESS.phoneDisplay}.`,
      );
      trackEvent("estimator_submit_failed", { reason: "transport_error" });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    result,
    condition,
    honeypot,
    name,
    phone,
    address,
    make,
    model,
    yearNumber,
    marketingConsent,
  ]);

  const handleReset = useCallback(() => {
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
    setMarketingConsent(false);
    setHoneypot("");
    setSubmitError("");
    setIsSuccess(false);
    analytics.resetStartedFlag();
  }, [analytics]);

  return {
    // Step
    step,
    goToStep,
    totalSteps,
    progressPercent,
    liveMessage,
    // Vehicle
    make,
    setMake,
    model,
    setModel,
    year,
    setYear,
    yearTouched,
    setYearTouched,
    yearIsValid,
    showYearError,
    condition,
    setCondition,
    // Quote
    result,
    isCalculating,
    canCalculate,
    handleEstimate,
    // Claim
    name,
    setName,
    nameTouched,
    setNameTouched,
    nameError,
    setNameError,
    phone,
    setPhone,
    phoneTouched,
    setPhoneTouched,
    phoneError,
    setPhoneError,
    address,
    setAddress,
    addressTouched,
    setAddressTouched,
    addressError,
    setAddressError,
    marketingConsent,
    setMarketingConsent,
    honeypot,
    setHoneypot,
    // Submit
    canSubmit,
    isSubmitting,
    submitError,
    isSuccess,
    handleSubmit,
    handleReset,
    // Validators (re-exported for inline onChange/onBlur)
    validateName,
    validatePhone,
    validateAddress,
    // Refs
    step1HeadingRef,
    step2HeadingRef,
    step3HeadingRef,
    successHeadingRef,
    // Constants
    currentYear: CURRENT_YEAR,
  };
}
