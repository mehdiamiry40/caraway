import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const reasons = [
  {
    title: "Quoted price guarantee",
    description:
      "The number we quote is the number you're paid — in writing before pickup, with no surprise deductions on the day.",
  },
  {
    title: "Fully insured pickups",
    description:
      "Public liability and goods-in-transit cover. If we scratch it loading, we wear it — not you.",
  },
  {
    title: "Paid when we pick up",
    description:
      "We don't drive away with your keys until you've been paid the agreed amount in your preferred method.",
  },
  {
    title: "Rough to written off",
    description:
      "Old daily drivers, damaged, unregistered, scrap, fleet. If it's not a fit, we'll say so upfront.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="section-y bg-secondary border-t border-b border-border">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))]">
            <p className="eyebrow mb-5">Why Caraway</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground mb-6 leading-[1.1] text-balance">
              One price.
              <br />
              One pickup. Done.
            </h2>
            <p className="text-foreground/80 leading-relaxed text-base sm:text-lg max-w-md">
              Private buyers flake. Dealers lowball trade-ins. We&apos;re a
              buyer, not an auction — just a straightforward offer and a truck
              at your door.
            </p>
          </Reveal>

          <RevealGroup className="lg:col-span-7">
            <dl className="divide-y divide-border border-t border-border">
              {reasons.map((reason) => (
                <RevealItem
                  key={reason.title}
                  className="relative py-6 sm:py-8 grid grid-cols-12 gap-2 sm:gap-4 md:gap-6 group"
                >
                  <span aria-hidden="true" className="absolute left-0 top-8 bottom-8 w-[2px] bg-primary/0 group-hover:bg-primary transition-colors duration-300" />
                  <dt className="col-span-12 md:col-span-5 pl-3 font-display text-foreground text-base sm:text-lg">
                    {reason.title}
                  </dt>
                  <dd className="col-span-12 md:col-span-7 pl-3 md:pl-0 text-foreground/80 text-[0.9375rem] sm:text-base leading-relaxed">
                    {reason.description}
                  </dd>
                </RevealItem>
              ))}
            </dl>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
