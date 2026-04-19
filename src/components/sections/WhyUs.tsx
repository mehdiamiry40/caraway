const reasons = [
  {
    title: "Quoted price guarantee",
    description:
      "The number we quote is the number you&apos;re paid, in writing before pickup, with no surprise deductions on the day.",
  },
  {
    title: "Fully insured pickups",
    description:
      "Public liability and goods-in-transit cover. If we mark something up while loading, that is our problem, not yours.",
  },
  {
    title: "Paid before the vehicle leaves",
    description:
      "We do not load up and sort payment later. Funds are confirmed before the car leaves your property.",
  },
  {
    title: "Useful even for rough cars",
    description:
      "Old daily drivers, damaged, unregistered, scrap, flood-affected, written off, or parked for years. If it is not a fit, we say so early.",
  },
] as const;

export function WhyUs() {
  return (
    <section id="why-us" className="section-y bg-secondary/65">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Why Caraway</p>
            <h2 className="mt-5 text-3xl font-display font-bold leading-[1.04] tracking-[-0.02em] text-primary text-balance sm:text-4xl md:text-[2.75rem]">
              Designed to feel straightforward, because it is.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Private buyers flake. Dealers price against what suits them.
              We&apos;re a direct buyer with a truck, a written quote, and a
              clear pickup process.
            </p>

            <div className="surface-dark mt-8 p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                The working rule
              </p>
              <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-primary-foreground">
                Quote first. Confirm it. Then send the truck.
              </p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <div key={reason.title} className="surface-card px-6 py-6 sm:px-7 sm:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  0{index + 1}
                </p>
                <dt className="mt-4 font-display text-xl font-semibold tracking-tight text-primary">
                  {reason.title}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {reason.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
