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
   * Hide the section's own heading block when the page already introduces
   * the process (e.g. /how-it-works renders it under a PageShell hero that
   * carries the H1).
   */
  showHeader?: boolean;
}

/** The four steps as a centred row of numbered points. */
export function HowItWorks({ showHeader = true }: HowItWorksProps) {
  const StepHeading = showHeader ? "h3" : "h2";

  return (
    <section id="how-it-works" className="section-y scroll-mt-header relative bg-background">
      <div className="site-container">
        {showHeader && (
          <div className="section-head">
            <h2 className="type-h2">
              Four simple steps.
            </h2>
            <p className="eyebrow mt-1">How it works</p>
          </div>
        )}

        <ol className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description }, index) => (
            <li
              key={title}
              className="grid grid-cols-[3.25rem_1fr] items-start gap-x-4 lg:block lg:text-center"
            >
              <span
                aria-hidden="true"
                className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-md bg-accent text-[1.75rem] font-bold leading-none text-accent-foreground lg:mx-auto"
              >
                {index + 1}
              </span>
              <div className="lg:mt-4">
                <StepHeading className="text-xl font-bold normal-case leading-snug text-primary">
                  {title}
                </StepHeading>
                <p className="mt-1 text-[1.0625rem] leading-relaxed text-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-9 flex flex-col items-center gap-x-8 gap-y-3 sm:flex-row sm:justify-center">
          <Link
            href="/#quote-form"
            className={cn(buttonVariants(), "group")}
          >
            Start your quote
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          {showHeader && (
            <Link href="/how-it-works" className="link-arrow text-center text-[1.0625rem]">
              Read the full quote, pickup and payment process
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
