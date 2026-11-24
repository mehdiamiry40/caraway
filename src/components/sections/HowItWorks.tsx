import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Tell us about your car", description: "Make, model, year and photos." },
  { title: "Get a confirmed offer", description: "In writing, before pickup." },
  { title: "We come to you", description: "Pickup included when we buy." },
  { title: "Get paid", description: "As agreed, with a receipt." },
] as const;

interface HowItWorksProps {
  /**
   * Hide the section's own kicker/heading block when the page already
   * introduces the process (e.g. /how-it-works renders it under a PageShell
   * hero that carries the H1).
   */
  showHeader?: boolean;
}

/** The four steps as a numbered run under one rule: the numeral does the work. */
export function HowItWorks({ showHeader = true }: HowItWorksProps) {
  const StepHeading = showHeader ? "h3" : "h2";

  return (
    <section id="how-it-works" className="section-y scroll-mt-header relative border-y border-border bg-secondary">
      <div className="site-container">
        {showHeader && (
          <div className="mb-10 md:mb-12">
            <p className="eyebrow">How it works</p>
            <h2 className="type-h2 mt-3">
              Four simple steps.
            </h2>
          </div>
        )}

        <ol className="grid grid-cols-1 border-t-2 border-primary sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description }, index) => (
            <li
              key={title}
              className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-2 border-b border-border py-5 sm:block sm:border-b-0 sm:py-7 sm:pr-8 lg:border-l lg:border-border lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span
                aria-hidden="true"
                className="font-display text-[2.5rem] font-semibold leading-none text-accent sm:block sm:text-[3.25rem]"
              >
                {index + 1}
              </span>
              <div className="sm:mt-5">
                <StepHeading className="font-sans text-xl font-bold leading-snug tracking-[-0.006em] text-foreground">
                  {title}
                </StepHeading>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 sm:mt-10">
          <Link
            href="/#quote-form"
            className={cn(buttonVariants(), "group ring-offset-secondary")}
          >
            Start your quote
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          {showHeader && (
            <Link href="/how-it-works" className="link-arrow text-base ring-offset-secondary">
              Read the full quote, pickup and payment process
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
