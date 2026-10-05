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
import { CheckCircle2, Shield, Clock, BadgeCheck } from "lucide-react";
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

  const resetMutation = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section
      id="quote-form"
      className="section-y scroll-mt-header bg-background"
      aria-label="Request a quote"
      data-chat-launcher-suppress="true"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:pt-4">
            <p className="eyebrow mb-5">
              Your quote
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance mb-5">
              Tell us about the car.
            </h2>
            <p className="text-foreground/80 leading-relaxed text-base sm:text-lg max-w-md">
              We&apos;ll use the supplied details to assess whether we can make an offer, then call or text about the next steps. There is no obligation to proceed.
            </p>
            <div className="mt-6 rounded-xl border border-border/70 bg-muted/60 p-4 max-w-md">
              <h3 className="text-sm font-display text-foreground mb-2">How we calculate your car offer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your offer depends on the vehicle&apos;s make, model, year, condition, location, whether it is complete, whether it can roll, and current parts or resale demand.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-md border border-border bg-card p-6 sm:p-8 shadow-[0_20px_44px_-28px_hsl(var(--shadow-color)/0.5)]">

              {isSuccess ? (
                <div role="status" aria-live="polite" aria-atomic="true" className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-none flex items-center justify-center mb-5 sm:mb-6">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" aria-hidden />
                  </div>
                  <h3 className="text-xl sm:text-3xl font-display text-primary mb-3">Thanks — we&apos;ve got your details</h3>
                  <p className="text-foreground/80 mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
                    Our team will review the supplied details and contact you by phone during business hours.
                  </p>
                  <Button onClick={() => resetMutation()} variant="outline" className="w-full sm:w-auto">
                    Submit another vehicle
                  </Button>
                </div>
              ) : (
                <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5 sm:space-y-6">
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

                  <div className="flex items-center gap-3 text-sm text-muted-foreground pb-1 lg:hidden">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-primary" aria-hidden />
                      <span>No obligation</span>
                    </div>
                    <span className="text-border">|</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" aria-hidden />
                      <span>Business-hours review</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor={fieldIds.make} className="block text-sm text-foreground mb-2.5">
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.make.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.model} className="block text-sm text-foreground mb-2.5">
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.model.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor={fieldIds.year} className="block text-sm text-foreground mb-2.5">
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.year.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.condition} className="block text-sm text-foreground mb-2.5">
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.condition.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.expectedPrice} className="block text-sm text-foreground mb-2.5">
                      Expected price <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <div className="relative">
                      <span
                        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-muted-foreground"
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
                        className="pl-8"
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
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-snug" id="quote-expected-price-help">
                      Whole Australian dollars. Tell us what you hope to get and we&apos;ll say whether it is realistic — leave it blank if you&apos;d rather we suggest a figure.
                    </p>
                    {errors.expectedPrice && (
                      <p id={`${fieldIds.expectedPrice}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                        {errors.expectedPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor={fieldIds.name} className="block text-sm text-foreground mb-2.5">
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.phone} className="block text-sm text-foreground mb-2.5">
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
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-snug" id="quote-phone-help">
                        Australian numbers only, e.g. 0412 345 678
                      </p>
                      {errors.phone && (
                        <p id={`${fieldIds.phone}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.suburb} className="block text-sm text-foreground mb-2.5 cursor-pointer">
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
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-snug" id="quote-suburb-help">
                      Where the car is right now. Availability is confirmed from the suburb, vehicle, and access details; we take the exact address once an offer is agreed.
                    </p>
                    {errors.suburb && (
                      <p id={`${fieldIds.suburb}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                        {errors.suburb.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={fieldIds.details} className="block text-sm text-foreground mb-2.5">
                      Vehicle and access details <span className="text-muted-foreground">(optional)</span>
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
                      className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-snug" id="quote-details-help">
                      These details help us assess the vehicle and suitable collection access before follow-up.
                    </p>
                    {errors.details ? (
                      <p id={`${fieldIds.details}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                        {errors.details.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                      {isSubmitting ? "Sending your details..." : "Get my quote"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-muted-foreground pt-0.5">
                    <BadgeCheck className="w-4 h-4 text-primary/70 shrink-0" aria-hidden />
                    <span>
                      Free quote. Your details are used to respond to this enquiry. See our{" "}
                      <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </div>

                  {errorMessage && (
                    <div
                      ref={errorAlertRef}
                      tabIndex={-1}
                      className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-lg px-3 sm:px-4 py-3 text-xs sm:text-sm text-destructive font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                      role="alert"
                      aria-live="assertive"
                      aria-atomic="true"
                    >
                      <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-none bg-destructive shrink-0" aria-hidden />
                      <div className="flex-1">
                        <span>{errorMessage}</span>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="ml-2 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    By submitting, you agree we may contact you about this enquiry. You can opt out anytime. See our{" "}
                    <Link href="/privacy" className="text-primary underline underline-offset-2 hover:no-underline">
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
