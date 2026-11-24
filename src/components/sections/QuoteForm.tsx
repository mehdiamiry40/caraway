"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { QuoteFormInput } from "@/lib/quote-schema";
import { quoteFormResolver } from "@/lib/quote-client-validation";
import { MAKE_OPTIONS, YEAR_OPTIONS, getModelOptions } from "@/data/car-models";
import { submitQuote } from "@/actions/quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";
import { CheckCircle2 } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { LeadForm } from "./LeadForm";
import { useSubmissionId } from "@/hooks/use-submission-id";

const fieldIds = {
  name: "quote-name",
  phone: "quote-phone",
  make: "quote-make",
  model: "quote-model",
  year: "quote-year",
  condition: "quote-condition",
  expectedPrice: "quote-expected-price",
  suburb: "quote-suburb",
  details: "quote-details",
} as const;

export function QuoteForm({ source = "quote_form" }: { source?: string }) {
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
      details: "",
      expectedPrice: "",
      honeypot: "",
    },
  });

  // `useWatch` is the React Compiler-safe alternative to the `watch()`
  // function returned by `useForm()`, which cannot be memoized safely.
  const selectedMake = useWatch({ control, name: "make" });

  const onSubmit = async (data: QuoteFormInput) => {
    setErrorMessage(null);
    try {
      const result = await submission.submit((id) => submitQuote(data, id));
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

  const resetMutation = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section
      id="quote-form"
      className="section-y scroll-mt-header bg-background"
      aria-label="Get a quote"
      data-chat-launcher-suppress="true"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="type-h2 text-balance">
              Tell us about the car.
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-foreground">
              We use your details to see if we can make an offer, then call or text you about next steps. There is no obligation.
            </p>
            <div className="mt-6 max-w-md border-l-4 border-accent bg-secondary px-4 py-4">
              <h3 className="text-lg font-bold text-accent-ink">How we work out your offer</h3>
              <p className="mt-1.5 text-base leading-relaxed text-foreground">
                Your offer depends on the make, model, year, condition, location, whether the car is complete, whether it rolls, and current demand for parts or resale.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border border-t-4 border-t-primary bg-card p-5 shadow-lg sm:p-8 lg:col-span-7">

              {isSuccess ? (
                <div role="status" aria-live="polite" aria-atomic="true" className="flex h-full flex-col items-start py-6 sm:py-8">
                  <CheckCircle2 className="h-9 w-9 text-accent" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 text-xl font-bold text-primary sm:text-2xl">Thanks — we&apos;ve got your details</h3>
                  <p className="mb-7 mt-2 max-w-sm text-base leading-relaxed text-foreground">
                    We&apos;ll review your details and call you during business hours.
                  </p>
                  <Button onClick={() => resetMutation()} variant="outline" className="w-full sm:w-auto">
                    Quote another car
                  </Button>
                </div>
              ) : (
                <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
                  <div hidden aria-hidden="true">
                    <label htmlFor="quote-website">Website</label>
                    <input
                      type="text"
                      id="quote-website"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("honeypot")}
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[0.9375rem] font-bold text-accent-ink lg:hidden">
                    <span>No obligation</span>
                    <span className="text-border" aria-hidden="true">|</span>
                    <span>Reviewed in business hours</span>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor={fieldIds.make} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Make
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Select
                        placeholder="Select make"
                        options={MAKE_OPTIONS}
                        aria-required="true"
                        aria-invalid={!!errors.make}
                        aria-describedby={errors.make ? `${fieldIds.make}-error` : undefined}
                        {...register("make", {
                          onChange: () => setValue("model", ""),
                        })}
                        id={fieldIds.make}
                      />
                      {errors.make && (
                        <p id={`${fieldIds.make}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.make.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.model} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Model
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Select
                        placeholder="Select model"
                        options={selectedMake && selectedMake !== "Other" ? getModelOptions(selectedMake) : [{ value: "Other", label: "Other" }]}
                        disabled={!selectedMake}
                        aria-required="true"
                        aria-invalid={!!errors.model}
                        aria-describedby={errors.model ? `${fieldIds.model}-error` : undefined}
                        {...register("model")}
                        id={fieldIds.model}
                      />
                      {errors.model && (
                        <p id={`${fieldIds.model}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.model.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor={fieldIds.year} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Year
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Select
                        placeholder="Select year"
                        options={YEAR_OPTIONS}
                        aria-required="true"
                        aria-invalid={!!errors.year}
                        aria-describedby={errors.year ? `${fieldIds.year}-error` : undefined}
                        {...register("year")}
                        id={fieldIds.year}
                      />
                      {errors.year && (
                        <p id={`${fieldIds.year}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.year.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.condition} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Condition
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Select
                        placeholder="Select condition"
                        options={[
                          { value: "running", label: "Running" },
                          { value: "needs_work", label: "Needs work" },
                          { value: "not_running", label: "Not running" },
                          { value: "damaged", label: "Accident / damaged" },
                          { value: "scrap", label: "Scrap / junk" },
                        ]}
                        aria-required="true"
                        aria-invalid={!!errors.condition}
                        aria-describedby={errors.condition ? `${fieldIds.condition}-error` : undefined}
                        {...register("condition")}
                        id={fieldIds.condition}
                      />
                      {errors.condition && (
                        <p id={`${fieldIds.condition}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.condition.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.expectedPrice} className="mb-1.5 block text-sm font-semibold text-foreground">
                      Expected price <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <div className="relative">
                      <span
                        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-base text-muted-foreground"
                        aria-hidden
                      >
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        enterKeyHint="next"
                        maxLength={12}
                        placeholder="3500"
                        className="pl-7"
                        aria-invalid={!!errors.expectedPrice}
                        aria-describedby={
                          errors.expectedPrice
                            ? `${fieldIds.expectedPrice}-error quote-expected-price-help`
                            : "quote-expected-price-help"
                        }
                        {...register("expectedPrice")}
                        id={fieldIds.expectedPrice}
                      />
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm" id="quote-expected-price-help">
                      Whole Australian dollars. Tell us what you hope to get and we&apos;ll say if it&apos;s realistic. Leave it blank if you&apos;d rather we suggest a figure.
                    </p>
                    {errors.expectedPrice && (
                      <p id={`${fieldIds.expectedPrice}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {errors.expectedPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor={fieldIds.name} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Your name
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Input
                        autoComplete="name"
                        inputMode="text"
                        enterKeyHint="next"
                        maxLength={200}
                        placeholder="Jane Smith"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
                        {...register("name")}
                        id={fieldIds.name}
                      />
                      {errors.name && (
                        <p id={`${fieldIds.name}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.phone} className="mb-1.5 block text-sm font-semibold text-foreground">
                        Phone
                        <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                      </label>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        enterKeyHint="next"
                        maxLength={20}
                        placeholder="04xx xxx xxx"
                        aria-required="true"
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? `${fieldIds.phone}-error` : "quote-phone-help"
                        }
                        {...register("phone")}
                        id={fieldIds.phone}
                      />
                      <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm" id="quote-phone-help">
                        Australian numbers only, e.g. 0412 345 678
                      </p>
                      {errors.phone && (
                        <p id={`${fieldIds.phone}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.suburb} className="mb-1.5 block text-sm font-semibold text-foreground">
                      Suburb
                      <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
                    </label>
                    <Input
                      autoComplete="address-level2"
                      inputMode="text"
                      enterKeyHint="next"
                      maxLength={100}
                      placeholder="Toowong"
                      aria-required="true"
                      aria-invalid={!!errors.suburb}
                      aria-describedby={
                        errors.suburb ? `${fieldIds.suburb}-error quote-suburb-help` : "quote-suburb-help"
                      }
                      {...register("suburb")}
                      id={fieldIds.suburb}
                    />
                    <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm" id="quote-suburb-help">
                      Where the car is now. We check if we can pick up from the suburb, car and access details. We ask for the exact address once an offer is agreed.
                    </p>
                    {errors.suburb && (
                      <p id={`${fieldIds.suburb}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {errors.suburb.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={fieldIds.details} className="mb-1.5 block text-sm font-semibold text-foreground">
                      Car and access details <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      id={fieldIds.details}
                      rows={4}
                      maxLength={2000}
                      placeholder="Kilometres; whether it starts, rolls, steers and brakes; damage or missing parts; driveway slope, clearance or obstacles."
                      aria-invalid={!!errors.details}
                      aria-describedby={
                        errors.details ? `${fieldIds.details}-error quote-details-help` : "quote-details-help"
                      }
                      {...register("details")}
                      className="w-full resize-y rounded-md border border-input bg-card px-3.5 py-3 text-base leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 aria-[invalid=true]:border-destructive"
                    />
                    <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm" id="quote-details-help">
                      This helps us assess the car and the pickup access before we call.
                    </p>
                    {errors.details ? (
                      <p id={`${fieldIds.details}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {errors.details.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                      {isSubmitting ? "Sending your details..." : "Get my quote"}
                    </Button>
                  </div>

                  <p className="text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
                    <span>
                      Free quote. Your details are used to respond to this enquiry. See our{" "}
                      <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </p>

                  {errorMessage && (
                    <div
                      ref={errorAlertRef}
                      tabIndex={-1}
                      className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-3 text-sm font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive sm:px-4"
                      role="alert"
                      aria-live="assertive"
                      aria-atomic="true"
                    >
                      <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                      <div className="flex-1">
                        <span>{errorMessage}</span>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="ml-2 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
                    By submitting, you agree we may contact you about this enquiry. You can opt out anytime. See our{" "}
                    <Link href="/privacy" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </LeadForm>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
