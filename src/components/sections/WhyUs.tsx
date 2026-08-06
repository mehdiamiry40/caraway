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
      className="section-y scroll-mt-header bg-primary text-on-dark-hi"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow-on-dark mb-5">Why Caraway</p>
            <h2
              id="why-us-heading"
              className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-on-dark-hi"
            >
              Straight answers.
              <br />
              A fairer way to sell.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-on-dark-hi/75 lg:col-span-4 lg:text-lg">
            We&apos;re a direct Brisbane buyer, not an auction or lead-selling
            marketplace.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
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
    <article className="rounded-[1.5rem] border border-[hsl(var(--on-dark-hi)/0.15)] bg-on-dark-hi/8 p-6 sm:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cta text-cta-foreground">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="mt-8 font-display text-xl font-semibold leading-snug text-on-dark-hi sm:text-2xl">
        {reason.title}
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-dark-hi/75">
        {reason.description}
      </p>
    </article>
  );
}
