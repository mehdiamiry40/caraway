"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ContactFormInput } from "@/lib/quote-schema";
import { contactFormResolver } from "@/lib/contact-client-validation";
import { submitContact } from "@/actions/contact";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_MESSAGE_MAX, CONTACT_MESSAGE_WARN } from "@/data/constants";
import { BUSINESS } from "@/lib/site";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { LeadForm } from "./LeadForm";
import { useSubmissionId } from "@/hooks/use-submission-id";

const fieldIds = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  message: "contact-message",
} as const;

export function ContactForm() {
  const submission = useSubmissionId("contact");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage) errorAlertRef.current?.focus();
  }, [errorMessage]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: contactFormResolver,
    mode: "onBlur",
    defaultValues: {
      honeypot: "",
      marketingConsent: false,
    },
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";
  const messageLength = messageValue.length;
  const counterClass =
    messageLength >= CONTACT_MESSAGE_MAX
      ? "text-destructive"
      : messageLength > CONTACT_MESSAGE_WARN
      ? "text-accent-ink"
      : "text-muted-foreground";

  const onSubmit = async (data: ContactFormInput) => {
    setErrorMessage(null);
    try {
      const result = await submission.submit((id) => submitContact(data, id));
      if (result.success) {
        trackEvent("contact_form_submitted");
        trackEvent("lead_submitted", { source: "contact" });
        setIsSuccess(true);
        submission.reset();
        reset();
        return;
      }
      setErrorMessage(
        result.message ||
          `We couldn't send your message. Please try again or call ${BUSINESS.phoneDisplay}.`,
      );
    } catch {
      setErrorMessage(
        `We couldn't send your message. Please try again or call ${BUSINESS.phoneDisplay}.`,
      );
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
      <div className="rounded-xl border border-border border-t-4 border-t-primary bg-card p-5 shadow-lg sm:p-8">
        <div role="status" aria-live="polite" aria-atomic="true" className="flex flex-col items-start py-6 sm:py-8">
          <CheckCircle2 className="h-9 w-9 text-accent" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-4 font-display text-[1.5rem] font-semibold leading-tight text-primary">Message received — thanks!</h2>
          <p className="mb-7 mt-2 max-w-sm text-base leading-relaxed text-foreground/80">
            We aim to reply within one business day. If you don&apos;t see a response, please check your spam folder or call us directly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full sm:w-auto">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border border-t-4 border-t-primary bg-card p-5 shadow-lg sm:p-8">
      <h2 className="font-display text-[1.5rem] font-semibold leading-tight text-primary sm:text-[1.625rem]">Send us a message</h2>
      <p className="mb-6 mt-1.5 text-[0.9375rem] text-muted-foreground">
        Have a question? Fill out the form and we&apos;ll get back to you.
      </p>
      <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        {/* Honeypot — hidden from real users, traps bots */}
        <div hidden aria-hidden="true">
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
          <label htmlFor={fieldIds.name} className="mb-1.5 block text-sm font-semibold text-foreground">
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
            <p id={`${fieldIds.name}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
              <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <div>
            <label htmlFor={fieldIds.email} className="mb-1.5 block text-sm font-semibold text-foreground">
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
              <p id={`${fieldIds.email}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={fieldIds.phone} className="mb-1.5 block text-sm font-semibold text-foreground">
              Phone <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
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
              <p id={`${fieldIds.phone}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor={fieldIds.message} className="block text-sm font-semibold text-foreground">
              Message
              <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
            </label>
            <span
              className={`text-xs tabular-nums ${counterClass}`}
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
            <p id={`${fieldIds.message}-error`} className="flex items-start gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
              <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="contact-marketing-consent"
            className="mt-0.5"
            {...register("marketingConsent")}
          />
          <label htmlFor="contact-marketing-consent" className="cursor-pointer text-sm leading-relaxed text-muted-foreground">
            I consent to receive occasional promotional emails from Caraway (offers, tips, updates). I can unsubscribe anytime via the link in any email.
          </label>
        </div>

        <div className="pt-1">
          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              "Send message"
            )}
          </Button>
        </div>

        {/* Privacy line below the button */}
        <p className="text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
          <span>
            Your details are used to respond to this enquiry. See our{" "}
            <Link href="/privacy" className="font-medium text-accent-ink underline underline-offset-2">
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
      </LeadForm>
    </div>
  );
}
