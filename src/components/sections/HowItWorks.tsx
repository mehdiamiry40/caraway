import Link from "next/link";

const steps = [
  {
    title: "Tell us about your car",
    description: (
      <>
        Use our{" "}
        <Link
          href="/#price-estimator"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          online quote tool
        </Link>
        {" with your make, model, year, condition, and suburb. Photos help if you have them."}
      </>
    ),
    timing: "About 60 seconds",
  },
  {
    title: "Lock in the number",
    description:
      "We send a firm quote back quickly. If it works for you, we confirm the pickup window before anyone is on the road.",
    timing: "Usually within the hour",
  },
  {
    title: "Pickup and payment",
    description:
      "Our truck arrives, checks the vehicle matches the quote, and you get paid before the car leaves your property.",
    timing: "Same or next day",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-5 text-3xl font-display font-bold leading-[1.04] tracking-[-0.02em] text-primary text-balance sm:text-4xl md:text-[2.75rem]">
              Simple enough to finish in a lunch break.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Direct buyer, direct process. No auction listing, no inspection
            roulette, no “we&apos;ll see when we arrive.”
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="surface-card relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent"
              />
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 font-display text-base font-bold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {step.timing}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold tracking-tight text-primary">
                {step.title}
              </h3>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.description}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
