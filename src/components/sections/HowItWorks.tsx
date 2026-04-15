import Link from "next/link";

const steps = [
  {
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
    title: "Confirm your quote",
    description:
      "We send a firm number straight back through the quote tool. Lock it in and book a pickup time that suits you.",
    timing: "Within the hour",
  },
  {
    title: "We pick up, you get paid",
    description:
      "Our truck arrives at the booked slot. Cash (or agreed payment method) before the vehicle leaves your place.",
    timing: "Same or next day",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-primary leading-[1.08] tracking-[-0.02em] text-balance">
            Three quiet steps.
            <br />
            No back-and-forth.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll
            say so — we&apos;d rather you know upfront than waste a day.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative bg-card border border-border/60 rounded-xl p-6 sm:p-8"
            >
              <span className="font-display text-xs font-semibold text-muted-foreground tabular-nums tracking-[0.18em]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-display font-semibold text-primary tracking-tight">
                {step.title}
              </h3>
              <div className="mt-3 text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </div>
              <p className="mt-6 text-xs text-muted-foreground/80 tracking-wide">
                {step.timing}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
