import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Arches } from "@/components/decor/Arches";

const steps = [
  {
    number: "1",
    title: "Tell us about your car",
    description: "Make, model, year. Photos help if you have them.",
    timing: "A few key details",
  },
  {
    number: "2",
    title: "Get a confirmed offer",
    description: "In writing, before any pickup is booked.",
    timing: "After assessment",
  },
  {
    number: "3",
    title: "We come to you",
    description: "Pickup is included when we buy and the supplied access details match.",
    timing: "Window confirmed",
  },
  {
    number: "4",
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
    <section
      id="how-it-works"
      className="relative scroll-mt-header overflow-hidden bg-background pt-16 pb-44 sm:pt-20 sm:pb-52 lg:pt-28 lg:pb-64"
    >
      <div className="site-container relative z-10">
        <div
          className={
            showHeader
              ? "grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_repeat(4,1fr)] lg:gap-10"
              : "grid grid-cols-1"
          }
        >
          {/* No sub-paragraph under the heading: the four steps below already say
              it, and the "we'll tell you if we're not a fit" line is WhyUs's. */}
          {showHeader && (
            <div>
              <p className="eyebrow mb-4">How it works</p>
              <h2 className="font-display text-[clamp(2.1rem,3.3vw,2.9rem)] leading-[1.15] text-primary text-balance">
                Let&apos;s make it happen
              </h2>
            </div>
          )}

          <ol className={
            showHeader
              ? "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4 lg:gap-10"
              : "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12"
          }>
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col">
                <span className="block border-b border-primary pb-3 font-display text-2xl leading-none text-primary">
                  {step.number}
                </span>
                <StepHeading className="mt-5 font-display text-[1.3rem] leading-snug text-primary">
                  {step.title}
                </StepHeading>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/80">
                  {step.description}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">
                  {step.timing}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/#quote-form"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cta px-7 font-bold text-[0.9375rem] text-cta-foreground transition-colors hover:bg-cta-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Start your quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {showHeader && (
            <Link
              href="/how-it-works"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-primary link-underline"
            >
              Read the full quote, pickup and payment process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      <Arches className="absolute bottom-0 left-0 w-[13rem] sm:w-[17rem] lg:w-[22rem]" />
    </section>
  );
}
