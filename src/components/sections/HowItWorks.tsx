import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description: "Make, model, year. Photos help if you have them.",
    timing: "About 60 seconds",
  },
  {
    number: "02",
    title: "Get a confirmed offer",
    description: "In writing, before any pickup is booked.",
    timing: "Within 1 business day",
  },
  {
    number: "03",
    title: "We come to you",
    description: "Our truck arrives at the booked slot. Towing is included.",
    timing: "Usually same- or next-day",
  },
  {
    number: "04",
    title: "Get paid on the spot",
    description: "Payment lands before the wheels leave, with a signed receipt.",
    timing: "Paid that day",
  },
] as const;

interface HowItWorksProps {
  showHeader?: boolean;
}

export function HowItWorks({ showHeader = true }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className="section-y scroll-mt-header bg-secondary"
      aria-labelledby={showHeader ? "process-heading" : undefined}
    >
      <div className="site-container">
        {showHeader && (
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-5">How it works</p>
              <h2
                id="process-heading"
                className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-display text-primary"
              >
                From quote to collection, without the runaround.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/#price-estimator"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary transition-colors hover:text-accent-ink"
              >
                Start your quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-primary/25 pt-5">
              <span className="font-mono text-sm font-semibold text-accent-ink">
                {step.number}
              </span>
              <h3 className="mt-8 font-display text-xl font-semibold text-primary">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/65">
                {step.description}
              </p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                {step.timing}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
