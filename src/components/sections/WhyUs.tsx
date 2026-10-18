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
    variant: "rust" as const,
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
      className="scroll-mt-header bg-ink py-16 text-on-dark-hi sm:py-20 lg:py-24"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container lg:px-20">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cta-bright">
          Why Caraway
        </p>
        <h2
          id="why-us-heading"
          className="mt-3 max-w-4xl font-display text-[2rem] font-medium leading-[1.18] text-on-dark-hi sm:text-[2.5rem]"
        >
          One price. One pickup. Done.
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-cta-bright"
                strokeWidth={2}
                aria-hidden="true"
              />
              <div>
                <h3 className="font-sans text-base font-semibold leading-6 text-on-dark-hi">
                  {title}
                </h3>
                <p className="text-[0.9375rem] leading-6 text-on-dark">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-28">
          {cards.map((card) => (
            <article key={card.href} className="group">
              <div className="aspect-[480/335] overflow-hidden bg-ink-raised">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={960}
                  height={670}
                  sizes="(max-width: 767px) calc(100vw - 2rem), 480px"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                />
              </div>
              <p className="mb-4 mt-5 text-base leading-6 text-on-dark-hi">{card.blurb}</p>
              <Link
                href={card.href}
                className={cn(buttonVariants({ variant: card.variant, size: "sm" }), "h-9 px-5 text-base")}
              >
                {card.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
