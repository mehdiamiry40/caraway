import Link from "next/link";
import { ArrowRight, BadgeCheck, BanknoteArrowDown, Truck, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const reasons = [
  {
    icon: BadgeCheck,
    title: "A clear offer",
    description: "Review the amount and terms before any pickup is arranged.",
  },
  {
    icon: Truck,
    title: "Pickup included",
    description: "When Caraway buys and the supplied vehicle and access details match.",
  },
  {
    icon: BanknoteArrowDown,
    title: "Payment confirmed",
    description: "The agreed payment arrangement is confirmed before the vehicle leaves.",
  },
  {
    icon: Wrench,
    title: "Rough to written off",
    description: "Old daily drivers, damaged, unregistered, scrap, and fleet vehicles are considered.",
  },
] as const;

export function WhyUs() {
  return (
    <section id="why-us" className="grid scroll-mt-header bg-ink-deep text-on-dark-hi lg:grid-cols-2" aria-labelledby="why-us-heading">
      <div className="relative min-h-[440px] overflow-hidden lg:min-h-[650px]">
        <picture>
          <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
          <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
          <img
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan for pickup"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/60 to-transparent" aria-hidden="true" />
      </div>

      <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-24">
        <div className="max-w-xl">
          <p className="t-index text-cta-bright">A simpler sale</p>
          <h2 id="why-us-heading" className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-on-dark-hi sm:text-5xl">
            A direct way to sell, without the usual runaround.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-on-dark-hi/75">
            Skip listings, repeated messages, inspections, and test drives. Caraway gives you one clear path from vehicle details to payment and pickup.
          </p>
          <ul className="mt-10 border-t border-on-dark-hi/25">
            {reasons.map(({ icon: Icon, title, description }) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] gap-5 border-b border-on-dark-hi/25 py-6">
                <Icon className="mt-1 h-7 w-7 text-cta-bright" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-on-dark-hi">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-dark-hi/70">{description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/how-it-works" className={`${buttonVariants({ size: "default" })} mt-9`}>
            See how it works <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
