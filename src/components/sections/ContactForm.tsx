"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/lib/quote-schema";
import { submitContact } from "@/actions/contact";
import { CheckCircle2, Send, Shield } from "lucide-react";

const fieldIds = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  message: "contact-message",
} as const;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true); // Fake success for bots
      return;
    }
    const result = await submitContact(data);

    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      setErrorMessage(result.message || "An error occurred.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/40 shadow-lg shadow-primary/[0.03] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-accent" aria-hidden />
        <div role="status" aria-live="polite" aria-atomic="true" className="flex flex-col items-center justify-center text-center py-8 sm:py-10">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/15 to-accent/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-accent/10">
            <CheckCircle2 className="w-10 h-10 text-accent" aria-hidden />
          </div>
          <h3 className="text-2xl font-display font-bold text-primary mb-3">Message sent</h3>
          <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
            We&apos;ll get back to you as soon as possible.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="transition-all duration-200">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/40 shadow-lg shadow-primary/[0.03] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-accent" aria-hidden />
      <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1 pt-1">Send Us a Message</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Have a question? Fill out the form and we&apos;ll get back to you.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          </label>
          <Input
            autoComplete="name"
            placeholder="Jane Smith"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
            {...register("name")}
            id={fieldIds.name}
          />
          {errors.name && (
            <p id={`${fieldIds.name}-error`} className="flex items-center gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive shrink-0" aria-hidden />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={fieldIds.email} className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
              {...register("email")}
              id={fieldIds.email}
            />
            {errors.email && (
              <p id={`${fieldIds.email}-error`} className="flex items-center gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive shrink-0" aria-hidden />
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
              autoComplete="tel"
              placeholder="04xx xxx xxx"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
              {...register("phone")}
              id={fieldIds.phone}
            />
            {errors.phone && (
              <p id={`${fieldIds.phone}-error`} className="flex items-center gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive shrink-0" aria-hidden />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={fieldIds.message} className="block text-sm font-semibold text-foreground mb-2">
            Message
          </label>
          <Textarea
            placeholder="Tell us how we can help..."
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
            {...register("message")}
            id={fieldIds.message}
          />
          {errors.message && (
            <p id={`${fieldIds.message}-error`} className="flex items-center gap-1.5 text-destructive text-sm mt-2 font-medium" role="alert">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive shrink-0" aria-hidden />
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
          <Shield className="w-3.5 h-3.5 text-primary/40 shrink-0" aria-hidden />
          <span>Your information is safe and never shared.</span>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive font-medium" role="alert">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
