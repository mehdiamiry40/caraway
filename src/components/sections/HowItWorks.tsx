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
    <section id="how-it-works" className="section-y scroll-mt-header relative bg-muted">
      <div className="site-container">
        {/* No sub-paragraph under the heading: the four steps below already say
            it, and the "we'll tell you if we're not a fit" line is WhyUs's. */}
        {showHeader && (
          <div className="mb-12 max-w-3xl">
            <p className="t-index text-accent-ink">Four straightforward steps</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl">
              From first details to final pickup.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">A clear process, so you always know what happens next.</p>
          </div>
        )}

        <ol className="relative grid grid-cols-1 gap-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative flex h-full flex-col overflow-hidden border border-accent/25 bg-card transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-md"
            >
              <div className="grid flex-1 grid-cols-[3.5rem_1fr] gap-x-4 p-7 sm:flex sm:flex-col">
                <span className="row-span-3 flex h-14 w-14 items-center justify-center bg-accent font-mono text-sm font-bold text-accent-foreground">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold leading-snug text-foreground sm:mt-5">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-accent-ink sm:mt-auto sm:pt-5">
                  {step.timing}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
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
