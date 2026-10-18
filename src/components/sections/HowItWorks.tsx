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
    <section id="how-it-works" className="section-y scroll-mt-header relative bg-background">
      <div className="site-container">
        {showHeader && (
          <div className="mb-10 max-w-3xl md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              How it works
            </p>
            <h2 className="font-display text-[2rem] font-medium leading-[1.15] text-foreground sm:text-5xl sm:leading-[3.5rem]">
              Four simple steps.
            </h2>
          </div>
        )}

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative flex aspect-auto flex-col justify-between bg-secondary/60 p-6 transition-colors duration-300 hover:bg-secondary sm:aspect-square sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  className="font-display text-6xl font-medium leading-none text-foreground/15 sm:text-7xl"
                >
                  {index + 1}
                </span>
                <Icon className="h-7 w-7 text-foreground" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="mt-8">
                <StepHeading className="font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
                  {title}
                </StepHeading>
                <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2">
          {showHeader && (
            <Link
              href="/how-it-works"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink link-underline"
            >
              Read the full quote, pickup and payment process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/#quote-form"
            className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink link-underline"
          >
            Start your quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
