"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";

import { submitQuote } from "@/actions/quote";
import { LeadForm } from "@/components/sections/LeadForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MAKE_OPTIONS, YEAR_OPTIONS, getModelOptions } from "@/data/car-models";
import { useSubmissionId } from "@/hooks/use-submission-id";
import { trackEvent } from "@/lib/analytics";
import { quoteFormResolver } from "@/lib/quote-client-validation";
import type { QuoteFormInput } from "@/lib/quote-schema";
import { BUSINESS } from "@/lib/site";

/**
 * Compact hero version of the quote form, and the home page's only quote
 * surface. It carries every field the quote schema requires plus the optional
 * expected price — the free-text vehicle notes stay on the full form used by
 * the service and suburb pages — so the card fits beside the hero copy.
 *
 * Labels are visually hidden and the placeholder names the field: at this size
 * a label row per field doubles the card's height.
 */
const fieldIds = {
  name: "hero-quote-name",
  phone: "hero-quote-phone",
  make: "hero-quote-make",
  model: "hero-quote-model",
  year: "hero-quote-year",
  condition: "hero-quote-condition",
  suburb: "hero-quote-suburb",
  expectedPrice: "hero-quote-expected-price",
} as const;

const CONDITION_OPTIONS = [
  { value: "running", label: "Running" },
  { value: "needs_work", label: "Needs work" },
  { value: "not_running", label: "Not running" },
  { value: "damaged", label: "Accident / damaged" },
  { value: "scrap", label: "Scrap / junk" },
];

/** Visible label above every field. */
const labelClass = "mb-1.5 block text-sm text-foreground";
const controlClass = "";
/** Room for the leading "$" prefix. */
const pricePrefixClass = "pl-7";
const selectClass = "";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

export function HeroQuoteForm({ source = "hero_quote_form" }: { source?: string }) {
  const submission = useSubmissionId("quote");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage) errorAlertRef.current?.focus();
  }, [errorMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<QuoteFormInput>({
    resolver: quoteFormResolver,
    mode: "onBlur",
    defaultValues: {
      suburb: "",
      expectedPrice: "",
      honeypot: "",
    },
  });

  const selectedMake = useWatch({ control, name: "make" });

  const onSubmit = async (data: QuoteFormInput) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true);
      return;
    }
    try {
      const result = await submitQuote(data, await submission.getId());
      if (result.success) {
        trackEvent("quote_form_submitted", { source });
        trackEvent("lead_submitted", { source });
        setIsSuccess(true);
        submission.reset();
        reset();
        return;
      }
      setErrorMessage(
        result.message ||
          `We couldn't send your quote. Please try again or call ${BUSINESS.phoneDisplay}.`,
      );
    } catch {
      setErrorMessage(
        `We couldn't send your quote. Please try again or call ${BUSINESS.phoneDisplay}.`,
      );
    }
  };

  const onError = (formErrors: FieldErrors<QuoteFormInput>) => {
    const firstErrorKey = Object.keys(formErrors)[0] as keyof typeof fieldIds | undefined;
    if (firstErrorKey && fieldIds[firstErrorKey]) {
      document.getElementById(fieldIds[firstErrorKey])?.focus();
    }
  };

  return (
    // The card sits on the dark hero band, which sets white text: without an
    // explicit card foreground, inputs and selects render white on white.
    <div className="w-full rounded border border-border bg-white p-5 text-left text-foreground sm:p-8">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
        Get a free quote
      </h2>

      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-6 flex flex-col items-start gap-2 py-4"
        >
          <h3 className="text-base font-semibold text-foreground">
            Thanks — we&apos;ve got your details
          </h3>
          <p className="text-sm text-muted-foreground">
            We&apos;ll call you during business hours.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setErrorMessage(null);
            }}
            variant="link"
            size="sm"
          >
            Submit another vehicle
          </Button>
        </div>
      ) : (
        <>
          <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="mt-6 space-y-4">
            <div hidden aria-hidden="true">
              <label htmlFor="hero-quote-website">Website</label>
              <input
                type="text"
                id="hero-quote-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("honeypot")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={fieldIds.name} className={labelClass}>
                  Your name<span className="sr-only"> (required)</span>
                </label>
                <Input
                  autoComplete="name"
                  inputMode="text"
                  enterKeyHint="next"
                  maxLength={200}
                  placeholder="Jane Smith"
                  className={controlClass}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
                  {...register("name")}
                  id={fieldIds.name}
                />
                <FieldError id={`${fieldIds.name}-error`} message={errors.name?.message} />
              </div>
              <div>
                <label htmlFor={fieldIds.phone} className={labelClass}>
                  Phone<span className="sr-only"> (required)</span>
                </label>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  maxLength={20}
                  placeholder="04xx xxx xxx"
                  className={controlClass}
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
                  {...register("phone")}
                  id={fieldIds.phone}
                />
                <FieldError id={`${fieldIds.phone}-error`} message={errors.phone?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={fieldIds.make} className={labelClass}>
                  Car make<span className="sr-only"> (required)</span>
                </label>
                <Select
                  placeholder="Select"
                  options={MAKE_OPTIONS}
                  className={selectClass}
                  aria-required="true"
                  aria-invalid={!!errors.make}
                  aria-describedby={errors.make ? `${fieldIds.make}-error` : undefined}
                  {...register("make", { onChange: () => setValue("model", "") })}
                  id={fieldIds.make}
                />
                <FieldError id={`${fieldIds.make}-error`} message={errors.make?.message} />
              </div>
              <div>
                <label htmlFor={fieldIds.model} className={labelClass}>
                  Car model<span className="sr-only"> (required)</span>
                </label>
                <Select
                  placeholder="Select"
                  options={
                    selectedMake && selectedMake !== "Other"
                      ? getModelOptions(selectedMake)
                      : [{ value: "Other", label: "Other" }]
                  }
                  disabled={!selectedMake}
                  className={selectClass}
                  aria-required="true"
                  aria-invalid={!!errors.model}
                  aria-describedby={errors.model ? `${fieldIds.model}-error` : undefined}
                  {...register("model")}
                  id={fieldIds.model}
                />
                <FieldError id={`${fieldIds.model}-error`} message={errors.model?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={fieldIds.year} className={labelClass}>
                  Year<span className="sr-only"> (required)</span>
                </label>
                <Select
                  placeholder="Select"
                  options={YEAR_OPTIONS}
                  className={selectClass}
                  aria-required="true"
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? `${fieldIds.year}-error` : undefined}
                  {...register("year")}
                  id={fieldIds.year}
                />
                <FieldError id={`${fieldIds.year}-error`} message={errors.year?.message} />
              </div>
              <div>
                <label htmlFor={fieldIds.condition} className={labelClass}>
                  Condition<span className="sr-only"> (required)</span>
                </label>
                <Select
                  placeholder="Select"
                  options={CONDITION_OPTIONS}
                  className={selectClass}
                  aria-required="true"
                  aria-invalid={!!errors.condition}
                  aria-describedby={
                    errors.condition ? `${fieldIds.condition}-error` : undefined
                  }
                  {...register("condition")}
                  id={fieldIds.condition}
                />
                <FieldError
                  id={`${fieldIds.condition}-error`}
                  message={errors.condition?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={fieldIds.suburb} className={labelClass}>
                  Suburb<span className="sr-only"> (required)</span>
                </label>
                <Input
                  autoComplete="address-level2"
                  inputMode="text"
                  enterKeyHint="next"
                  maxLength={100}
                  placeholder="Toowong"
                  className={controlClass}
                  aria-required="true"
                  aria-invalid={!!errors.suburb}
                  aria-describedby={errors.suburb ? `${fieldIds.suburb}-error` : undefined}
                  {...register("suburb")}
                  id={fieldIds.suburb}
                />
                <FieldError id={`${fieldIds.suburb}-error`} message={errors.suburb?.message} />
              </div>
              <div>
                <label htmlFor={fieldIds.expectedPrice} className={labelClass}>
                  Expected price<span className="sr-only"> in Australian dollars (optional)</span>
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                    aria-hidden
                  >
                    $
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    enterKeyHint="go"
                    maxLength={12}
                    placeholder="Optional"
                    className={pricePrefixClass}
                    aria-invalid={!!errors.expectedPrice}
                    aria-describedby={
                      errors.expectedPrice ? `${fieldIds.expectedPrice}-error` : undefined
                    }
                    {...register("expectedPrice")}
                    id={fieldIds.expectedPrice}
                  />
                </div>
                <FieldError
                  id={`${fieldIds.expectedPrice}-error`}
                  message={errors.expectedPrice?.message}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
              {isSubmitting ? "Sending..." : "Get my quote"}
            </Button>

            {errorMessage && (
              <div
                ref={errorAlertRef}
                tabIndex={-1}
                className="flex items-start gap-2 rounded border border-destructive/40 px-3 py-2 text-sm text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="ml-2 rounded-sm underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              No obligation ·{" "}
              <Link
                href="/privacy"
                className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </p>
          </LeadForm>
        </>
      )}
    </div>
  );
}
