import Link from "next/link";
import {
  ArrowRight,
  BanknoteArrowDown,
  ChevronRight,
  ClipboardList,
  FileSignature,
  Truck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <section id="how-it-works" className="section-y scroll-mt-header relative border-y border-border bg-secondary">
      <div className="site-container">
        {showHeader && (
          <div className="mb-10 max-w-3xl md:mb-12">
            <p className="eyebrow">How it works</p>
            <h2 className="display-impact mt-4 text-[2.5rem] text-foreground sm:text-[3.5rem]">
              Four simple steps.
            </h2>
          </div>
        )}

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative flex flex-col border border-border bg-card p-6 sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center bg-cta font-display text-[2.25rem] font-extrabold leading-none text-cta-foreground"
                >
                  {index + 1}
                </span>
                <Icon className="h-9 w-9 text-foreground/25 transition-colors duration-300 group-hover:text-foreground" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="mt-7">
                <StepHeading className="font-display text-2xl font-bold leading-[1.1] text-foreground sm:text-[1.75rem]">
                  {title}
                </StepHeading>
                <p className="mt-2 text-[0.9375rem] leading-6 text-muted-foreground">{description}</p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight
                  aria-hidden="true"
                  className="absolute -right-[1.0625rem] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 bg-ink p-1 text-cta-bright lg:block"
                  strokeWidth={3}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/#quote-form"
            className={cn(buttonVariants(), "group")}
          >
            Start your quote
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {showHeader && (
            <Link
              href="/how-it-works"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink link-underline"
            >
              Read the full quote, pickup and payment process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
