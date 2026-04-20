import Link from "next/link";
import { ClipboardList, MessageCircleReply, Truck, ArrowRight, Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your car",
    description: (
      <>
        Share the make, model, year, condition and suburb with our{" "}
        <Link
          href="/#price-estimator"
          className="text-primary font-medium underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
        >
          online quote tool
        </Link>
        . Photos help, but aren't required.
      </>
    ),
    timing: "60 seconds",
  },
  {
    icon: MessageCircleReply,
    title: "Confirm your firm offer",
    description:
      "We send a written, guaranteed price back the same hour. Lock it in and book a pickup time that suits you — no pressure.",
    timing: "Within the hour",
  },
  {
    icon: Truck,
    title: "We pick up, you get paid",
    description:
      "Our flatbed arrives on schedule. You're paid in full — cash or bank transfer — before the keys leave your hand.",
    timing: "Same or next day",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-background">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-14 md:mb-16">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            Three simple steps, no back-and-forth.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg max-w-xl">
            We buy the car directly, so you skip the listings, the tyre-kickers
            and the lowball trade-ins. Every offer is firm and in writing.
          </p>
        </Reveal>

        <RevealGroup>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <RevealItem
                  as="li"
                  key={step.title}
                  className="group relative h-full rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_2px_6px_hsl(var(--shadow-color)/0.06),0_18px_40px_-14px_hsl(var(--shadow-color)/0.2)] hover:border-border-strong"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.06] text-primary ring-1 ring-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                      <StepIcon size={22} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-mono tabular-nums text-[0.8125rem] font-semibold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <div className="mt-3 text-muted-foreground leading-relaxed text-[0.9375rem]">
                    {step.description}
                  </div>
                  <p className="mt-7 pt-5 border-t border-border inline-flex items-center gap-2 text-[0.8125rem] font-medium text-foreground">
                    <Clock size={14} strokeWidth={2} aria-hidden="true" className="text-accent" />
                    {step.timing}
                  </p>
                </RevealItem>
              );
            })}
          </ol>
        </RevealGroup>

        <Reveal className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
          <Link
            href="/#price-estimator"
            className="inline-flex items-center gap-1.5 font-semibold text-primary link-underline"
          >
            Start your quote
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
          <span className="text-muted-foreground">·</span>
          <p className="text-muted-foreground">Free, no obligation to accept.</p>
        </Reveal>
      </div>
    </section>
  );
}
