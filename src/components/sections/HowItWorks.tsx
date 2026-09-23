import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description: "Make, model, year and condition.",
  },
  {
    number: "02",
    title: "Get a confirmed offer",
    description: "In writing, before any pickup is booked.",
  },
  {
    number: "03",
    title: "We come to you",
    description: "Pickup is included when we buy.",
  },
  {
    number: "04",
    title: "Complete payment and records",
    description: "Paid as agreed. You keep the receipt.",
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
    <section id="how-it-works" className="section-y scroll-mt-header border-t border-border">
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {showHeader && (
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-foreground text-balance">
              From quote to collection in four clear steps.
            </h2>
          </div>
        )}

        <div className={showHeader ? "lg:col-span-8" : "lg:col-span-12"}>
          <ol className="border-t border-border">
            {steps.map((step) => (
              <li
                key={step.number}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-border py-6 sm:grid-cols-[4rem_1fr_1.25fr] sm:gap-x-8"
              >
                <span className="text-sm text-muted-foreground tabular-nums">{step.number}</span>
                <StepHeading className="text-base font-semibold text-foreground">
                  {step.title}
                </StepHeading>
                <p className="col-start-2 mt-1 text-base text-muted-foreground sm:col-start-3 sm:mt-0">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-x-6">
            <Link href="/#quote-form" className={buttonVariants({ variant: "link" })}>
              Start your quote
            </Link>
            {showHeader && (
              <Link href="/how-it-works" className={buttonVariants({ variant: "link" })}>
                Read the full quote, pickup and payment process
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
