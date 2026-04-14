"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "@/lib/quote-schema";
import { submitContact } from "@/actions/contact";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_MESSAGE_MAX, CONTACT_MESSAGE_WARN } from "@/data/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Send, Shield } from "lucide-react";
import type { FieldErrors } from "react-hook-form";

const fieldIds = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  message: "contact-message",
} as const;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-reset success state after 60 seconds so returning users see a fresh form
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setIsSuccess(false), 60_000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";
  const messageLength = messageValue.length;
  const counterClass =
    messageLength >= CONTACT_MESSAGE_MAX
      ? "text-destructive"
      : messageLength > CONTACT_MESSAGE_WARN
      ? "text-accent"
      : "text-muted-foreground";

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true); // Fake success for bots
      return;
    }
    const result = await submitContact(data);

    if (result.success) {
      trackEvent("contact_form_submitted");
      trackEvent("lead_submitted", { source: "contact" });
      setIsSuccess(true);
      reset();
    } else {
      setErrorMessage(result.message || "An error occurred.");
    }
  };

  const onError = (formErrors: FieldErrors<ContactFormInput>) => {
    const firstErrorKey = Object.keys(formErrors)[0] as keyof typeof fieldIds | undefined;
    if (firstErrorKey && fieldIds[firstErrorKey]) {
      document.getElementById(fieldIds[firstErrorKey])?.focus();
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-8 border border-border/60 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" aria-hidden />
        <div role="status" aria-live="polite" aria-atomic="true" className="flex flex-col items-center justify-center text-center py-8 sm:py-10 px-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" aria-hidden />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Message sent — thanks!</h3>
          <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
            We&apos;ll reply within 1 business day. If you don&apos;t see a response, please check your spam folder or call us directly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full sm:w-auto transition-all duration-200">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-8 border border-border/60 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" aria-hidden />
      <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1 pt-1">Send Us a Message</h2>
      <p className="text-sm text-muted-foreground mb-5 sm:mb-6">
        Have a question? Fill out the form and we&apos;ll get back to you.
      </p>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 sm:space-y-5" noValidate>
        {/* Honeypot — hidden from real users, traps bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            type="text"
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </div>
        <div>
          <label htmlFor={fieldIds.name} className="block text-sm font-semibold text-foreground mb-2">
            Your name
            <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
          </label>
          <Input
            autoComplete="name"
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
            <p id={`${fieldIds.name}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
              <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor={fieldIds.email} className="block text-sm font-semibold text-foreground mb-2">
              Email
              <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
            </label>
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="next"
              maxLength={320}
              placeholder="jane@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
              {...register("email")}
              id={fieldIds.email}
            />
            {errors.email && (
              <p id={`${fieldIds.email}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={fieldIds.phone} className="block text-sm font-semibold text-foreground mb-2">
              Phone <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="next"
              maxLength={20}
              placeholder="04xx xxx xxx"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
              {...register("phone")}
              id={fieldIds.phone}
            />
            {errors.phone && (
              <p id={`${fieldIds.phone}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={fieldIds.message} className="block text-sm font-semibold text-foreground">
              Message
              <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
            </label>
            <span
              className={`text-xs tabular-nums ${counterClass}`}
              aria-live="polite"
              aria-atomic="true"
              id={`${fieldIds.message}-counter`}
            >
              {messageLength}/{CONTACT_MESSAGE_MAX}
            </span>
          </div>
          <Textarea
            autoComplete="off"
            enterKeyHint="send"
            maxLength={CONTACT_MESSAGE_MAX}
            placeholder="Tell us how we can help..."
            rows={4}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message
                ? `${fieldIds.message}-error ${fieldIds.message}-counter`
                : `${fieldIds.message}-counter`
            }
            {...register("message")}
            id={fieldIds.message}
          />
          {errors.message && (
            <p id={`${fieldIds.message}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
              <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="pt-1">
          <Button type="submit" size="lg" className="w-full h-14 text-base sm:text-lg font-bold" isLoading={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" aria-hidden />
                Send message
              </>
            )}
          </Button>
        </div>

        {/* Trust line below CTA */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary/70 shrink-0" aria-hidden />
          <span>Your information is safe and never shared.</span>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="contact-marketing-consent"
            className="mt-0.5"
            {...register("marketingConsent")}
          />
          <label htmlFor="contact-marketing-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            I consent to receive occasional promotional emails from Caraway (offers, tips, updates). I can unsubscribe anytime via the link in any email.
          </label>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-lg px-3 sm:px-4 py-3 text-xs sm:text-sm text-destructive font-medium" role="alert">
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
      </form>
    </div>
  );
}
