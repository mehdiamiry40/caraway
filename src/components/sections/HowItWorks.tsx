import Link from "next/link";
import {
  ArrowRight,
  BanknoteArrowDown,
  ClipboardList,
  FileSignature,
  Truck,
} from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Tell us about your car", description: "Make, model, year and photos." },
  { icon: FileSignature, title: "Get a confirmed offer", description: "In writing, before pickup." },
  { icon: Truck, title: "We come to you", description: "Pickup included when we buy." },
  { icon: BanknoteArrowDown, title: "Get paid", description: "As agreed, with a receipt." },
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
        {showHeader && (
          <div className="mb-10 text-center md:mb-14">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1.1] text-primary text-balance">
              Four simple steps.
            </h2>
          </div>
        )}

        <div className="relative">
          {/* Connector line behind the icons on desktop. */}
          <span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-border lg:block"
          />
          <ol className="relative grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-20 w-20 items-center justify-center border border-border bg-secondary text-primary">
                  <Icon className="h-9 w-9" strokeWidth={1.75} aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center bg-cta font-display text-xs font-bold text-cta-foreground"
                  >
                    {index + 1}
                  </span>
                </span>
                <StepHeading className="mt-5 font-display text-base font-semibold leading-snug text-primary sm:text-lg">
                  {title}
                </StepHeading>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
