"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import { quoteFormSchema, type QuoteCondition } from "@/lib/quote-schema";
import {
  parsePersistedState,
  type PersistedState,
  type Step,
} from "@/lib/persisted-estimator-state";
import { submitQuote } from "@/actions/quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";

const CURRENT_YEAR = new Date().getFullYear();
const STORAGE_KEY = "caraway-estimator-state";

export type { Step };

export function usePriceEstimator() {
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
      const parsed = parsePersistedState(raw);
      if (!parsed) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (parsed.make) setMake(parsed.make);
      if (parsed.model) setModel(parsed.model);
      if (parsed.year) setYear(parsed.year);
      if (parsed.condition) setCondition(parsed.condition);
      // Step 1 now holds all vehicle inputs, so rehydration simply refills the
      // fields — the user still needs to click "See my quote" to recalculate.
      // Step 2 (quote) and Step 3 (PII) are never restored: the quote result
      // lives only in memory and PII is never persisted.
    } catch {
      // sessionStorage may be unavailable (private mode / quota / SecurityError);
      // cache hydration is best-effort, so let the user start fresh silently.
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
      } catch {
        // sessionStorage may throw on quota/private-mode; persistence is
        // cosmetic, so drop silently rather than spamming the console.
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
    }, 600);
  }, [canCalculate, isCalculating, make, model, yearNumber, condition]);

  const validateName = useCallback((value: string): string | null => {
    const result = quoteFormSchema.shape.name.safeParse(value);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Enter your name";
  }, []);

  const validatePhone = useCallback((value: string): string | null => {
    const result = quoteFormSchema.shape.phone.safeParse(value);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Enter a valid Australian phone number";
  }, []);

  const validateAddress = useCallback((value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed.length < 5) return "Enter a pickup address";
    if (trimmed.length > 500) return "Address is too long";
    return null;
  }, []);

  const handleSubmit = useCallback(async () => {
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

    try {
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
    canSubmit,
    result,
    condition,
    honeypot,
    name,
    phone,
    address,
    make,
    model,
    yearNumber,
    validateName,
    validatePhone,
    validateAddress,
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
    setHoneypot("");
    setSubmitError("");
    setIsSuccess(false);
    estimatorStartedRef.current = false;
  }, []);

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
    honeypot,
    setHoneypot,
    // Submit
    canSubmit,
    isSubmitting,
    submitError,
    isSuccess,
    handleSubmit,
    handleReset,
    // Validators (for inline onChange/onBlur)
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
