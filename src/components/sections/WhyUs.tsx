import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BanknoteArrowDown, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const reasons: Reason[] = [
  {
    title: "One price, in writing",
    description: "Confirmed before the truck is booked.",
    icon: BadgeCheck,
  },
  {
    title: "Paid when we pick up",
    description: "Your keys stay with you until you're paid.",
    icon: BanknoteArrowDown,
  },
  {
    title: "Rough to written off",
    description: "Damaged, unregistered, scrap or fleet.",
    icon: Wrench,
  },
];

const cards = [
  {
    image: "/images/cash-for-cars-quote-readiness-v1.jpg",
    alt: "Vehicle quote-readiness diagram showing the photos a buyer needs to assess a car",
    blurb: "A simpler way to sell your car to a direct Brisbane buyer",
    label: "Sell My Car",
    href: "/sell-my-car-brisbane",
    variant: "default" as const,
  },
  {
    image: "/images/car-removal-brisbane-access-readiness-v1.jpg",
    alt: "Tilt-tray truck arriving to collect a car from a Brisbane driveway",
    blurb: "A simpler way to have your car collected, running or not",
    label: "Car Removal",
    href: "/car-removal-brisbane",
    variant: "white" as const,
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="scroll-mt-header relative overflow-hidden bg-ink py-16 text-on-dark-hi sm:py-20 lg:py-24"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <p className="eyebrow-on-dark">Why Caraway</p>
        <h2
          id="why-us-heading"
          className="display-impact mt-4 max-w-4xl text-[2.75rem] text-on-dark-hi sm:text-[4rem] lg:text-[4.5rem]"
        >
          One price. One pickup. <span className="text-cta-bright">Done.</span>
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-px border border-on-dark-hi/12 bg-on-dark-hi/12 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-4 bg-ink p-5 sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-cta text-cta-foreground">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold leading-[1.1] text-on-dark-hi">
                  {title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-6 text-on-dark">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <article key={card.href} className="group flex flex-col bg-ink-raised">
              <div className="aspect-[480/300] overflow-hidden bg-ink-raised">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={960}
                  height={670}
                  sizes="(max-width: 767px) calc(100vw - 2rem), 600px"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col items-start gap-5 border-t-4 border-cta p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="max-w-[22rem] text-base font-medium leading-6 text-on-dark-hi">{card.blurb}</p>
                <Link
                  href={card.href}
                  className={cn(buttonVariants({ variant: card.variant, size: "sm" }), "h-11 shrink-0 px-5 text-lg")}
                >
                  {card.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
