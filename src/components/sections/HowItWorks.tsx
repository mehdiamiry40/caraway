const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description:
      "Share make, model, year and condition — photos help. Takes about a minute.",
  },
  {
    number: "02",
    title: "Get a firm cash offer",
    description:
      "We send a locked-in price. No haggling, no bait-and-switch.",
  },
  {
    number: "03",
    title: "We come to you",
    description:
      "Free pickup anywhere in Greater Brisbane — usually same- or next-day.",
  },
  {
    number: "04",
    title: "Get paid on the spot",
    description:
      "Cash or transfer before the wheels leave your driveway. Paperwork handled.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-background border-t border-border">
      <div className="site-container">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="font-medium text-3xl sm:text-4xl leading-tight tracking-[var(--tracking-tight)] text-foreground text-balance">
            Four simple steps. Cash in your hand.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg max-w-xl">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll
            say so upfront.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col">
              <span className="text-xs font-medium tracking-[0.08em] text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mt-3 font-medium text-base text-foreground leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
