const reasons = [
  {
    title: "One quoted price, in writing",
    description:
      "Confirmed before pickup. Nothing is deducted on the day.",
  },
  {
    title: "Paid when we pick up",
    description: "We don't take the keys until you're paid.",
  },
  {
    title: "Rough to written off",
    description:
      "Damaged, unregistered or scrap. If it's not a fit, we'll say so.",
  },
] as const;

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="section-y scroll-mt-header border-t border-border"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Why Caraway</p>
          <h2
            id="why-us-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl"
          >
            One price. One pickup. Done.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Private buyers flake. Dealers lowball. We&apos;re a buyer, not an auction.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:mt-16 md:grid-cols-3">
          {reasons.map((reason) => (
            <li key={reason.title} className="border-t border-foreground pt-5">
              <h3 className="text-base font-semibold text-foreground">{reason.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{reason.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
