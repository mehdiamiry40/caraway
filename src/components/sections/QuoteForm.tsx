"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  quoteFormSchema,
  type QuoteFormInput,
} from "@/lib/quote-schema";
import { MAKE_OPTIONS, YEAR_OPTIONS, getModelOptions } from "@/data/car-models";
import { submitQuote } from "@/actions/quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";
import { CheckCircle2, Shield, Clock, BadgeCheck } from "lucide-react";
import type { FieldErrors } from "react-hook-form";

const fieldIds = {
  name: "quote-name",
  phone: "quote-phone",
  make: "quote-make",
  model: "quote-model",
  year: "quote-year",
  condition: "quote-condition",
  address: "quote-address",
} as const;

export function QuoteForm() {
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
    resolver: zodResolver(quoteFormSchema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      honeypot: "",
      marketingConsent: false,
    },
  });

  // `useWatch` is the React Compiler-safe alternative to the `watch()`
  // function returned by `useForm()`, which cannot be memoized safely.
  const selectedMake = useWatch({ control, name: "make" });
  const addressValue = useWatch({ control, name: "address" }) ?? "";

  const onSubmit = async (data: QuoteFormInput) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true);
      return;
    }
    const result = await submitQuote(data);

    if (result.success) {
      trackEvent("quote_form_submitted");
      trackEvent("lead_submitted", { source: "quote_form" });
      setIsSuccess(true);
      reset();
    } else {
      setErrorMessage(
        result.message ||
          `We couldn't send your quote. Please try again or call ${BUSINESS.phoneFriendly}.`,
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
    <section id="quote-section" className="section-y bg-background">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:pt-4">
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-foreground/75">
              Your quote
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display text-primary leading-[1.08] tracking-[-0.02em] text-balance mb-5">
              Tell us about the car.
            </h2>
            <p className="text-foreground/80 leading-relaxed text-base sm:text-lg max-w-md">
              We&apos;ll call or text back with a straightforward price range and next steps — usually within one business day. No obligation, no follow-up pressure.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-[0_20px_44px_-28px_hsl(var(--shadow-color)/0.5)]">

              {isSuccess ? (
                <div role="status" aria-live="polite" aria-atomic="true" className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" aria-hidden />
                  </div>
                  <h3 className="text-xl sm:text-3xl font-display text-primary mb-3">Thanks — we&apos;ve got your details</h3>
                  <p className="text-foreground/80 mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
                    Our team will call or text you within 1 business day. Please keep an eye on your phone — and check your spam folder if we reach out by email.
                  </p>
                  <Button onClick={() => resetMutation()} variant="outline" className="w-full sm:w-auto">
                    Submit another vehicle
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5 sm:space-y-6" noValidate>
                  <div className="absolute -left-[9999px]" aria-hidden="true">
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
                      <span>Same-day reply</span>
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.condition.message}
                        </p>
                      )}
                    </div>
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
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
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.address} className="block text-sm text-foreground mb-2.5 cursor-pointer">
                      Pickup address
                      <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
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
                      enterKeyHint="send"
                      placeholder="Start typing your pickup address..."
                      aria-required="true"
                      aria-invalid={!!errors.address}
                      aria-describedby={
                        errors.address ? `${fieldIds.address}-error quote-address-help` : "quote-address-help"
                      }
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-snug" id="quote-address-help">
                      Brisbane pickup suburbs only. You can also type the full address manually.
                    </p>
                    {errors.address && (
                      <p id={`${fieldIds.address}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                      {isSubmitting ? "Sending your details..." : "Get my free quote"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-0.5">
                    <BadgeCheck className="w-4 h-4 text-primary/70 shrink-0" aria-hidden />
                    <span>Free, no-obligation quote. We never share your info.</span>
                  </div>

                  <div className="flex items-start gap-3 pt-3 sm:pt-4">
                    <Checkbox
                      id="quote-marketing-consent"
                      className="mt-0.5"
                      {...register("marketingConsent")}
                    />
                    <label htmlFor="quote-marketing-consent" className="block text-xs text-muted-foreground leading-relaxed cursor-pointer py-1 -my-1">
                      I consent to receive occasional promotional emails from Caraway (offers, tips, updates). I can unsubscribe anytime via the link in any email.
                    </label>
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
                      <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                      <div className="flex-1">
                        <span>{errorMessage}</span>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="ml-2 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded-sm"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    By submitting, you agree we may contact you about this enquiry. You can opt out anytime. See our{" "}
                    <Link href="/privacy" className="text-primary/80 underline underline-offset-2 hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
