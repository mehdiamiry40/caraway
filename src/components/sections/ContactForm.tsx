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
      ? "text-primary"
      : "text-muted-foreground";

  const onSubmit = async (data: ContactFormInput) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true); // Fake success for bots
      return;
    }
    try {
      const result = await submitContact(data, await submission.getId());
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
      <div className="rounded border border-border bg-white p-5 sm:p-8">
        <div role="status" aria-live="polite" aria-atomic="true" className="flex flex-col items-start py-4">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Message received — thanks!</h2>
          <p className="mb-6 max-w-sm text-base text-muted-foreground">
            We aim to reply within one business day. If you don&apos;t see a response, please check your spam folder or call us directly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="link" className="w-full sm:w-auto">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-border bg-white p-5 sm:p-8">
      <h2 className="mb-1 text-xl font-semibold text-foreground">Send us a message</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Have a question? Fill out the form and we&apos;ll get back to you.
      </p>
      <LeadForm onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5 sm:space-y-6">
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
          <label htmlFor={fieldIds.name} className="mb-1.5 block text-sm text-foreground">
            Your name
            <span aria-hidden="true" className="ml-0.5 text-muted-foreground">*</span>
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
            <p id={`${fieldIds.name}-error`} className="mt-1.5 text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor={fieldIds.email} className="mb-1.5 block text-sm text-foreground">
              Email
              <span aria-hidden="true" className="ml-0.5 text-muted-foreground">*</span>
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
              <p id={`${fieldIds.email}-error`} className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={fieldIds.phone} className="mb-1.5 block text-sm text-foreground">
              Phone <span className="text-xs font-normal text-muted-foreground ml-2">(optional)</span>
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
              <p id={`${fieldIds.phone}-error`} className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label htmlFor={fieldIds.message} className="block text-sm text-foreground">
              Message
              <span aria-hidden="true" className="ml-0.5 text-muted-foreground">*</span>
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
            <p id={`${fieldIds.message}-error`} className="mt-1.5 text-sm text-destructive" role="alert">
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
          <label htmlFor="contact-marketing-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            I consent to receive occasional promotional emails from Caraway (offers, tips, updates). I can unsubscribe anytime via the link in any email.
          </label>
        </div>

        <div className="pt-1">
          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                Send message
              </>
            )}
          </Button>
        </div>

        {/* Trust line below CTA */}
        <div className="text-xs text-muted-foreground">
          <span>
            Your details are used to respond to this enquiry. See our{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </span>
        </div>

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
                className="ml-2 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 rounded-sm"
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
