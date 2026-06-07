import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description:
      "Drop in your plate or share make, model and year. Photos help if you have them.",
    timing: "60 seconds",
  },
  {
    number: "02",
    title: "Get a firm cash offer",
    description:
      "We send a locked-in number - no haggle games, no bait-and-switch. Accept and we book a time.",
    timing: "Within 1 business day",
  },
  {
    number: "03",
    title: "We come to you",
    description:
      "Our truck arrives at the booked slot, anywhere in Greater Brisbane. Free towing, always.",
    timing: "Usually same- or next-day",
  },
  {
    number: "04",
    title: "Get paid on the spot",
    description:
      "Cash or transfer before the wheels leave your driveway. All paperwork handled by us.",
    timing: "Paid that day",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y scroll-mt-header relative bg-background">
      <div className="site-container">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="eyebrow mb-5">How it works</p>
          <h2 className="font-display text-[clamp(2.15rem,5vw,3.4rem)] font-bold leading-[1.08] tracking-display text-primary text-balance">
            From quote to collection in four clear steps.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll say so - we&apos;d
            rather you know upfront than waste a day.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative flex flex-col overflow-hidden border border-border bg-card transition-[border-color,box-shadow] duration-300 hover:border-primary hover:shadow-md"
            >
              <div
                className="h-1 bg-gradient-to-r from-cta via-accent to-primary"
                aria-hidden="true"
              />
              <div className="flex flex-1 flex-col p-6">
                <span className="font-display text-4xl font-bold leading-none text-primary/25">
                  {step.number}
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/75">
                  {step.description}
                </p>
                <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-[0.1em] text-accent-ink">
                  {step.timing}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Link
            href="/#price-estimator"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent-ink"
          >
            Start with your plate
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
