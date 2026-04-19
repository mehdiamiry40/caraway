import Link from "next/link";
import { ClipboardList, MessageCircleReply, Truck, ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your car",
    description: (
      <>
        Use our{" "}
        <Link
          href="/#price-estimator"
          className="text-primary font-medium underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          online quote tool
        </Link>
        {" — make, model, year, condition, suburb. Photos help if you have them."}
      </>
    ),
    timing: "60 seconds",
  },
  {
    icon: MessageCircleReply,
    title: "Confirm your quote",
    description:
      "We send a firm number straight back through the quote tool. Lock it in and book a pickup time that suits you.",
    timing: "Within the hour",
  },
  {
    icon: Truck,
    title: "We pick up, you get paid",
    description:
      "Our truck arrives at the booked slot. Cash (or agreed payment method) before the vehicle leaves your place.",
    timing: "Same or next day",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-background">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-5">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold text-foreground leading-[1.1] text-balance">
            Three quiet steps.
            <br />
            No back-and-forth.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll
            say so — we&apos;d rather you know upfront than waste a day.
          </p>
        </Reveal>

        <RevealGroup>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <RevealItem key={step.title} className="h-full">
                  <li className="group relative h-full bg-card border border-border rounded-2xl p-6 sm:p-8 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_8px_16px_hsl(var(--shadow-color)/0.08),0_32px_64px_-12px_hsl(var(--shadow-color)/0.14)] hover:border-primary/40">
                    <div className="flex items-center justify-between mb-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/[0.14]">
                        <StepIcon size={22} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums tracking-[0.1em] text-foreground/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                      {step.title}
                    </h3>
                    <div className="mt-3 text-foreground/75 leading-relaxed text-[0.9375rem]">
                      {step.description}
                    </div>
                    <p className="mt-6 pt-5 border-t border-border flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-foreground/80">
                      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" className="text-primary" />
                      {step.timing}
                    </p>
                  </li>
                </RevealItem>
              );
            })}
          </ol>
        </RevealGroup>
      </div>
    </section>
  );
}
