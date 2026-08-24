import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BanknoteArrowDown, Wrench } from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const featureReason: Reason = {
  title: "One quoted price, locked in writing",
  description:
    "Confirmed before the truck is booked. If the vehicle matches the details you gave, nothing is deducted on the day.",
  icon: BadgeCheck,
};

/* Two supporting cards, not three: "Pickup details confirmed" repeated the
   Stats card almost word for word, and dropping it also squares the grid —
   the feature card spans two rows, so a third card left a half-empty one. */
const supportingReasons: Reason[] = [
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
      className="section-y scroll-mt-header border-b border-border bg-muted"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="eyebrow mb-5">Why Caraway</p>
          <h2
            id="why-us-heading"
            className="font-display text-[clamp(2.7rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-foreground"
          >
            One price.
            <br />
            One pickup. Done.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            Private buyers flake. Dealers lowball. We&apos;re a buyer, not an auction.
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-12">
            {/* Featured card spans the full row on mobile, half on desktop */}
            <div className="lg:col-span-6 lg:row-span-2">
              <FeatureReasonCard reason={featureReason} />
            </div>

            {supportingReasons.map((reason) => (
              <div key={reason.title} className="lg:col-span-6">
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
    <article className="relative h-full min-h-80 overflow-hidden bg-primary p-7 text-on-dark-hi sm:p-10">
      <span
        aria-hidden="true"
        className="hidden"
      />
      <span
        aria-hidden="true"
        className="hidden"
      />
      <div className="relative flex h-full flex-col">
        <span className="flex h-12 w-12 items-center justify-center border border-[hsl(var(--on-dark-hi)/0.28)] text-on-dark-hi">
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
              className="inline-flex items-center border border-[hsl(var(--on-dark-hi)/0.22)] bg-[hsl(var(--on-dark-hi)/0.08)] px-3 py-1 text-xs font-medium text-on-dark-hi"
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
    <article className="group relative flex h-full min-h-40 items-center overflow-hidden bg-card p-6 transition-colors duration-300 hover:bg-background sm:p-8">
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
