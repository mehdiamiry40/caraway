"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

import { submitQuote } from "@/actions/quote";
import { LeadForm } from "@/components/sections/LeadForm";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
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
 * Compact hero version of the quote form. It carries only the fields the
 * quote schema requires — expected price and the free-text vehicle notes stay
 * on the full form below the fold — so the card fits beside the hero copy.
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
  address: "hero-quote-address",
} as const;

const CONDITION_OPTIONS = [
  { value: "running", label: "Running" },
  { value: "needs_work", label: "Needs work" },
  { value: "not_running", label: "Not running" },
  { value: "damaged", label: "Accident / damaged" },
  { value: "scrap", label: "Scrap / junk" },
];

/** 16px text keeps iOS from zooming on focus; only the box shrinks. */
const controlClass = "h-11 sm:h-11 px-3";
// py-0: the shared select sets py-3, which clips its text at this height.
const selectClass = "h-11 sm:h-11 py-0 pl-3 pr-9";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-destructive">
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
    trigger,
  } = useForm<QuoteFormInput>({
    resolver: quoteFormResolver,
    mode: "onBlur",
    defaultValues: {
      address: "",
      honeypot: "",
    },
  });

  const selectedMake = useWatch({ control, name: "make" });
  const addressValue = useWatch({ control, name: "address" }) ?? "";

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
    <div className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-left text-card-foreground shadow-[0_28px_56px_-30px_hsl(var(--shadow-color)/0.85)] sm:p-5">
      <h2 className="font-display text-lg font-bold leading-tight text-foreground sm:text-xl">
        Get a free quote
      </h2>
      <p className="mt-1 text-xs leading-snug text-muted-foreground">
        Seven details, no obligation. We review every enquiry and reply during
        business hours.
      </p>

      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 flex flex-col items-center gap-3 py-6 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden />
          </span>
          <h3 className="font-display text-lg text-primary">
            Thanks — we&apos;ve got your details
          </h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            Our team will review the supplied details and contact you by phone
            during business hours.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setErrorMessage(null);
            }}
            variant="outline"
            size="sm"
          >
            Submit another vehicle
          </Button>
        </div>
      ) : (
        <>
          <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="mt-4 space-y-3">
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={fieldIds.name} className="sr-only">
                  Your name (required)
                </label>
                <Input
                  autoComplete="name"
                  inputMode="text"
                  enterKeyHint="next"
                  maxLength={200}
                  placeholder="Your name*"
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
                <label htmlFor={fieldIds.phone} className="sr-only">
                  Phone (required)
                </label>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  maxLength={20}
                  placeholder="Phone*"
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

            <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-3">
              <div>
                <label htmlFor={fieldIds.make} className="sr-only">
                  Car make (required)
                </label>
                <Select
                  placeholder="Car make*"
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
                <label htmlFor={fieldIds.model} className="sr-only">
                  Car model (required)
                </label>
                <Select
                  placeholder="Model*"
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

            <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-3">
              <div>
                <label htmlFor={fieldIds.year} className="sr-only">
                  Year (required)
                </label>
                <Select
                  placeholder="Year*"
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
                <label htmlFor={fieldIds.condition} className="sr-only">
                  Condition (required)
                </label>
                <Select
                  placeholder="Condition*"
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

            <div>
              <label htmlFor={fieldIds.address} className="sr-only">
                Pickup address (required)
              </label>
              <AddressAutocomplete
                id={fieldIds.address}
                name="address"
                value={addressValue}
                onChange={(next) => {
                  setValue("address", next, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: !!errors.address,
                  });
                }}
                onBlur={() => {
                  void trigger("address");
                }}
                autoComplete="street-address"
                enterKeyHint="go"
                placeholder="Pickup address or suburb*"
                className={controlClass}
                aria-required="true"
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? `${fieldIds.address}-error` : undefined}
              />
              <FieldError id={`${fieldIds.address}-error`} message={errors.address?.message} />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              {isSubmitting ? "Sending your details..." : "Get a free quote"}
            </Button>

            {errorMessage && (
              <div
                ref={errorAlertRef}
                tabIndex={-1}
                className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <span
                  className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive"
                  aria-hidden
                />
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

            <p className="text-center text-xs leading-snug text-muted-foreground">
              By submitting, you agree we may contact you about this enquiry. See
              our{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </LeadForm>

          <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
            Want to add a price expectation or access notes?{" "}
            <Link
              href="/#quote-form"
              prefetch={false}
              className="font-medium text-primary underline underline-offset-2"
            >
              Get my quote on the full form
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
