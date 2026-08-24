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
  return (
    <section id="how-it-works" className="section-y scroll-mt-header relative border-b border-border bg-background">
      <div className="site-container">
        {/* No sub-paragraph under the heading: the four steps below already say
            it, and the "we'll tell you if we're not a fit" line is WhyUs's. */}
        {showHeader && (
          <div className="mb-12 max-w-3xl md:mb-16">
            <p className="eyebrow mb-5">How it works</p>
            <h2 className="font-display text-[clamp(2.7rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-foreground">
              From quote to collection in four clear steps.
            </h2>
          </div>
        )}

        <ol className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative flex min-h-64 flex-col overflow-hidden bg-card transition-colors duration-300 hover:bg-muted"
            >
              <div
                className="hidden"
                aria-hidden="true"
              />
              <div className="grid flex-1 grid-cols-[3.25rem_1fr] gap-x-4 p-6 sm:flex sm:flex-col sm:p-7">
                <span className="row-span-3 font-mono text-xs font-semibold leading-none tracking-[0.12em] text-primary">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold leading-snug text-foreground sm:mt-12">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/75">
                  {step.description}
                </p>
                <p className="mt-3 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-accent-ink sm:mt-auto sm:pt-8">
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
