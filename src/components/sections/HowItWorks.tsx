import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description: "Make, model, year. Photos help if you have them.",
    timing: "A few key details",
  },
  {
    number: "02",
    title: "Get a confirmed offer",
    description: "In writing, before any pickup is booked.",
    timing: "After assessment",
  },
  {
    number: "03",
    title: "We come to you",
    description: "Pickup is included when we buy and the supplied access details match.",
    timing: "Window confirmed",
  },
  {
    number: "04",
    title: "Complete payment and records",
    description: "Use the agreed payment arrangement and retain the buyer and receipt details.",
    timing: "Terms agreed first",
  },
] as const;

interface HowItWorksProps {
  /**
   * Hide the section's own eyebrow/heading block when the page already
   * introduces the process (e.g. /how-it-works renders it under a PageShell
   * hero that carries the H1).
   */
  showHeader?: boolean;
}

export function HowItWorks({ showHeader = true }: HowItWorksProps) {
  const StepHeading = showHeader ? "h3" : "h2";

  return (
    <section id="how-it-works" className="section-y-tight scroll-mt-header relative bg-background">
      <div className="site-container">
        {/* No sub-paragraph under the heading: the four steps below already say
            it, and the "we'll tell you if we're not a fit" line is WhyUs's. */}
        {showHeader && (
          <div className="mb-10 max-w-2xl md:mb-14">
            <p className="eyebrow mb-5">How it works</p>
            <h2 className="font-display text-[clamp(2.15rem,5vw,3.4rem)] font-bold leading-[1.08] tracking-display text-primary text-balance">
              From quote to collection in four clear steps.
            </h2>
          </div>
        )}

        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative flex flex-col overflow-hidden border border-border bg-card transition-[border-color,box-shadow] duration-300 hover:border-primary hover:shadow-md"
            >
              <div
                className="h-1 bg-gradient-to-r from-cta via-accent to-primary"
                aria-hidden="true"
              />
              <div className="grid flex-1 grid-cols-[3.25rem_1fr] gap-x-4 p-5 sm:flex sm:flex-col sm:p-6">
                <span className="row-span-3 font-display text-3xl font-bold leading-none text-primary/75 sm:text-4xl">
                  {step.number}
                </span>
                <StepHeading className="font-display text-lg font-semibold leading-snug text-primary sm:mt-6">
                  {step.title}
                </StepHeading>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/75">
                  {step.description}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-accent-ink sm:mt-auto sm:pt-5">
                  {step.timing}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          {showHeader && (
            <Link
              href="/how-it-works"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent-ink"
            >
              Read the full quote, pickup and payment process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/#quote-form"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent-ink"
          >
            Start your quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
