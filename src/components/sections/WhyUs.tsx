import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BanknoteArrowDown, Wrench } from "lucide-react";

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

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="section-y scroll-mt-header bg-secondary border-t border-b border-border"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-4">Why Caraway</p>
          <h2
            id="why-us-heading"
            className="font-display text-3xl font-bold leading-[1.1] text-primary text-balance sm:text-4xl md:text-[2.5rem]"
          >
            One price.
            <br />
            One pickup. Done.
          </h2>

          <ul className="mt-8 space-y-5">
            {reasons.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden border border-border bg-card">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan"
            width={800}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 600px"
            loading="lazy"
            className="aspect-[4/3] h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
