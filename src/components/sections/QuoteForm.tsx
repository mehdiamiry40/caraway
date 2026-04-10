"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/quote-schema";
import { submitQuote } from "@/actions/quote";
import { CheckCircle2, Shield, Clock, BadgeCheck, Sparkles } from "lucide-react";

const fieldIds = {
  name: "quote-name",
  phone: "quote-phone",
  make: "quote-make",
  year: "quote-year",
  condition: "quote-condition",
} as const;

const benefits = [
  { icon: Clock, title: "Same-day response", desc: "We usually reply within a few hours during business hours." },
  { icon: Shield, title: "No obligation", desc: "Not happy with the offer? No worries — there's zero pressure to accept." },
];

export function QuoteForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setErrorMessage(null);
    if (data.honeypot) {
      setIsSuccess(true);
      return;
    }
    const result = await submitQuote(data);

    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      setErrorMessage(result.message || "An error occurred.");
    }
  };

  const resetMutation = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section id="quote-section" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-muted rounded-lg p-4 sm:p-8 md:p-12 lg:p-16 border border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 w-fit">
                <Sparkles className="w-4 h-4 text-accent" aria-hidden />
                <span className="text-accent">Free instant quote</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4 md:mb-6 text-balance leading-tight">
                Get Your Cash for Cars Brisbane Quote
              </h2>
              <p className="text-muted-foreground mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg">
                Tell us about the car. We&apos;ll call or text back with a price range and next steps — usually within one business day. No obligation.
              </p>

              <div className="hidden lg:flex flex-col gap-6">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-white border border-border/60 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors duration-200">
                      <b.icon className="w-5 h-5 text-primary/70" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-sm">{b.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-8 border border-border/40 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" aria-hidden />

              {isSuccess ? (
                <div role="status" aria-live="polite" aria-atomic="true" className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" aria-hidden />
                  </div>
                  <h3 className="text-xl sm:text-3xl font-display font-bold text-primary mb-3">Thanks — we&apos;ve got your details</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
                    Our team will contact you using the number you provided — usually within one business day.
                  </p>
                  <Button onClick={() => resetMutation()} variant="outline" className="w-full sm:w-auto">
                    Submit another vehicle
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
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
                      <Shield className="w-4 h-4 text-primary/50" aria-hidden />
                      <span>No obligation</span>
                    </div>
                    <span className="text-border">|</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary/50" aria-hidden />
                      <span>Same-day reply</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                        <p id={`${fieldIds.name}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                          <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.phone} className="block text-sm font-semibold text-foreground mb-2">
                        Phone
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
                        <p id={`${fieldIds.phone}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                          <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.make} className="block text-sm font-semibold text-foreground mb-2">
                      Make &amp; model
                    </label>
                    <Input
                      autoComplete="off"
                      placeholder="e.g. Toyota Corolla"
                      aria-invalid={errors.make ? true : undefined}
                      aria-describedby={errors.make ? `${fieldIds.make}-error` : undefined}
                      {...register("make")}
                      id={fieldIds.make}
                    />
                    {errors.make && (
                      <p id={`${fieldIds.make}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                        <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor={fieldIds.year} className="block text-sm font-semibold text-foreground mb-2">
                        Year
                      </label>
                      <Input
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="e.g. 2012"
                        aria-invalid={errors.year ? true : undefined}
                        aria-describedby={errors.year ? `${fieldIds.year}-error` : undefined}
                        {...register("year")}
                        id={fieldIds.year}
                      />
                      {errors.year && (
                        <p id={`${fieldIds.year}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                          <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.year.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.condition} className="block text-sm font-semibold text-foreground mb-2">
                        Condition
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
                        aria-invalid={errors.condition ? true : undefined}
                        aria-describedby={errors.condition ? `${fieldIds.condition}-error` : undefined}
                        {...register("condition")}
                        id={fieldIds.condition}
                      />
                      {errors.condition && (
                        <p id={`${fieldIds.condition}-error`} className="flex items-start gap-1.5 text-destructive text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium" role="alert">
                          <span className="inline-block w-1 h-1 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                          {errors.condition.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button type="submit" size="lg" className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold tracking-wide rounded-xl" isLoading={isSubmitting}>
                      {isSubmitting ? "Sending your details..." : "Get my free quote"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-0.5">
                    <BadgeCheck className="w-4 h-4 text-primary/40 shrink-0" aria-hidden />
                    <span>Free, no-obligation quote. We never share your info.</span>
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-lg px-3 sm:px-4 py-3 text-xs sm:text-sm text-destructive font-medium" role="alert">
                      <span className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0" aria-hidden />
                      {errorMessage}
                    </div>
                  )}
                  <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
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
      </div>
    </section>
  );
}
