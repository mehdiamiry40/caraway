import type { LucideIcon } from "lucide-react";
import { BadgeCheck, ShieldCheck, BanknoteArrowDown, Wrench } from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const featureReason: Reason = {
  title: "One quoted price, locked in writing",
  description:
    "The agreed offer is confirmed before the truck is booked. If the vehicle matches the details you gave, there are no surprise towing deductions on the day.",
  icon: BadgeCheck,
};

const supportingReasons: Reason[] = [
  {
    title: "Pickup details confirmed",
    description:
      "We confirm the assigned operator, access plan, timing, and applicable insurance details before collection.",
    icon: ShieldCheck,
  },
  {
    title: "Paid when we pick up",
    description:
      "We don't drive away with your keys until you've been paid the agreed amount in your preferred method.",
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
      className="section-y scroll-mt-header bg-secondary border-t border-b border-border"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="eyebrow mb-5">Why Caraway</p>
          <h2
            id="why-us-heading"
            className="font-display text-3xl font-bold leading-[1.1] text-primary text-balance sm:text-4xl md:text-[2.5rem]"
          >
            One price.
            <br />
            One pickup. Done.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            Private buyers flake. Dealers lowball trade-ins. We&apos;re a buyer,
            not an auction — just a straightforward offer and a truck at your door.
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Featured card spans the full row on mobile, half on desktop */}
            <div className="lg:col-span-6 lg:row-span-2">
              <FeatureReasonCard reason={featureReason} />
            </div>

            {supportingReasons.map((reason, idx) => (
              <div
                key={reason.title}
                className={
                  // first two share a row on lg, third spans full width below
                  idx < 2
                    ? "lg:col-span-6"
                    : "lg:col-span-6"
                }
              >
                <SupportingReasonCard reason={reason} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureReasonCard({ reason }: { reason: Reason }) {
  const Icon = reason.icon;
  return (
    <article className="relative h-full overflow-hidden border border-primary bg-primary p-7 text-on-dark-hi sm:p-9">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[hsl(var(--accent)/0.32)] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-[hsl(var(--cta)/0.28)] blur-3xl"
      />
      <div className="relative flex h-full flex-col">
        <span className="flex h-12 w-12 items-center justify-center bg-[hsl(var(--on-dark-hi)/0.14)] text-on-dark-hi ring-1 ring-[hsl(var(--on-dark-hi)/0.18)]">
          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-dark-hi/80">
          The Caraway promise
        </p>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl leading-tight text-on-dark-hi text-balance">
          {reason.title}
        </h3>
        <p className="mt-4 max-w-md text-[0.9375rem] sm:text-base leading-relaxed text-on-dark-hi/85">
          {reason.description}
        </p>
        <ul className="mt-auto pt-8 flex flex-wrap gap-2">
          {["No bait-and-switch", "No tow deductions", "Confirmed in writing"].map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-full border border-[hsl(var(--on-dark-hi)/0.22)] bg-[hsl(var(--on-dark-hi)/0.08)] px-3 py-1 text-xs font-medium text-on-dark-hi"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SupportingReasonCard({ reason }: { reason: Reason }) {
  const Icon = reason.icon;
  return (
    <article className="group relative h-full overflow-hidden border border-border bg-card p-6 transition-[box-shadow,border-color] duration-300 hover:border-primary hover:shadow-md sm:p-7">
      <div className="flex items-start gap-4 sm:gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary/15 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg sm:text-xl text-foreground leading-snug">
            {reason.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/75">
            {reason.description}
          </p>
        </div>
      </div>
    </article>
  );
}
