import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BanknoteArrowDown, Wrench } from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const reasons: Reason[] = [
  {
    title: "One quoted price, locked in writing",
    description:
      "Confirmed before the truck is booked. If the vehicle matches the details you gave, nothing is deducted on the day.",
    icon: BadgeCheck,
  },
  {
    title: "Paid when we pick up",
    description:
      "We don't drive away with your keys until you've been paid the agreed amount.",
    icon: BanknoteArrowDown,
  },
  {
    title: "Rough to written off",
    description:
      "Old daily drivers, damaged, unregistered, scrap, fleet. If it's not a fit, we'll say so upfront.",
    icon: Wrench,
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="section-y scroll-mt-header bg-background"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 bg-cta" aria-hidden="true" />
              Why Caraway
            </p>
            <h2
              id="why-us-heading"
              className="font-display text-[clamp(2.4rem,5vw,4.25rem)] font-medium leading-[1.02] tracking-display text-primary"
            >
              Straight answers.
              <br />
              A fairer way to sell.
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-foreground/75 lg:pb-1 lg:text-lg">
            We&apos;re a direct Brisbane buyer, not an auction or lead-selling
            marketplace.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reasons.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonCard({ reason }: { reason: Reason }) {
  const Icon = reason.icon;

  return (
    <article className="bg-secondary p-7 sm:p-8">
      <Icon className="h-8 w-8 text-cta" strokeWidth={1.5} aria-hidden="true" />
      <h3 className="mt-8 font-display text-xl font-medium leading-snug text-primary sm:text-2xl">
        {reason.title}
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/70">
        {reason.description}
      </p>
    </article>
  );
}
