import Link from "next/link";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description:
      "Drop in your plate or share make, model and year. Photos help if you have them.",
    timing: "60 seconds",
    image: "/images/tow-truck-hero.webp",
    tint: "bg-primary",
  },
  {
    number: "02",
    title: "Get a firm cash offer",
    description:
      "We send a locked-in number — no haggle games, no bait-and-switch. Accept and we book a time.",
    timing: "Within the hour",
    image: "/images/tow-truck-hero.webp",
    tint: "bg-primary",
  },
  {
    number: "03",
    title: "We come to you",
    description:
      "Our truck arrives at the booked slot, anywhere in Greater Brisbane. Free towing, always.",
    timing: "Same or next day",
    image: "/images/tow-truck-hero.webp",
    tint: "bg-primary",
  },
  {
    number: "04",
    title: "Get paid on the spot",
    description:
      "Cash or transfer before the wheels leave your driveway. All paperwork handled by us.",
    timing: "Paid that day",
    image: "/images/tow-truck-hero.webp",
    tint: "bg-primary",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-background relative">
      <div className="site-container">
        <Reveal className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <p className="eyebrow mb-5">How it works</p>
          <h2 className="font-display font-extrabold text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02] tracking-[var(--tracking-display)] text-balance">
            Four simple steps.
            <br />
            <span className="hl-orange">Cash</span> in your hand.
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed text-base sm:text-lg max-w-xl mx-auto font-light">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll
            say so — we&apos;d rather you know upfront than waste a day.
          </p>
        </Reveal>

        <RevealGroup>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {steps.map((step) => (
              <RevealItem
                as="li"
                key={step.number}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border/70 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`relative aspect-[5/4] ${step.tint} overflow-hidden`}>
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
                    className="object-cover mix-blend-luminosity opacity-45"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[hsl(var(--primary)/0.35)]"
                  />
                  <span className="absolute top-4 left-4 font-display font-extrabold text-[clamp(3.5rem,9vw,6rem)] leading-none tracking-tight text-accent drop-shadow-[0_4px_12px_hsl(var(--ink-deep)/0.35)]">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-display font-extrabold text-primary leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] text-foreground/75 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="mt-auto pt-5 text-xs font-bold uppercase tracking-[0.08em] text-cta">
                    {step.timing}
                  </p>
                </div>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>

        <Reveal className="mt-12 text-center">
          <Link
            href="/#price-estimator"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-accent transition-colors"
          >
            Start with your plate
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
