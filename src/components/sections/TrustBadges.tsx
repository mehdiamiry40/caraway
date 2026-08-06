import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CarFront,
  FileCheck2,
  MapPin,
  Recycle,
  Truck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicePath {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const services: ServicePath[] = [
  {
    icon: BadgeDollarSign,
    title: "Cash for cars",
    description: "Offers for running, old, or end-of-life vehicles.",
    href: "/cash-for-cars-brisbane",
  },
  {
    icon: Truck,
    title: "Car removal",
    description: "Pickup across Greater Brisbane when we buy.",
    href: "/car-removal-brisbane",
  },
  {
    icon: CarFront,
    title: "Sell my car",
    description: "A simple alternative to advertising privately.",
    href: "/sell-my-car-brisbane",
  },
  {
    icon: Recycle,
    title: "Scrap cars",
    description: "Cash offers for complete scrap vehicles.",
    href: "/scrap-car-removal-brisbane",
  },
  {
    icon: FileCheck2,
    title: "Unwanted cars",
    description: "Turn an unused vehicle into a confirmed offer.",
    href: "/unwanted-cars-brisbane",
  },
  {
    icon: Wrench,
    title: "Damaged cars",
    description: "Accident, mechanical, flood, or hail damage.",
    href: "/damaged-cars-brisbane",
  },
  {
    icon: MapPin,
    title: "Pickup areas",
    description: "Check coverage across Greater Brisbane.",
    href: "/locations",
  },
  {
    icon: ArrowRight,
    title: "How it works",
    description: "Four clear steps from quote to payment.",
    href: "/how-it-works",
  },
];

export function TrustBadges() {
  return (
    <section className="section-y bg-secondary" aria-labelledby="services-heading">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 bg-cta" aria-hidden="true" />
              Our services
            </p>
            <h2
              id="services-heading"
              className="max-w-xl font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-medium leading-[1.04] tracking-display text-primary"
            >
              A better way to sell.
              <br />
              Delivered with care.
            </h2>
          </div>
          <p className="max-w-2xl self-end text-base leading-relaxed text-foreground/75 lg:pb-1 lg:text-lg">
            From instant car valuations to removal across Greater Brisbane, our
            services are designed to make selling straightforward. Choose the
            option that best matches your vehicle and situation.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full min-h-48 flex-col bg-background p-6 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon
                  className="h-8 w-8 text-cta"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="mt-7 font-display text-lg font-medium text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-none px-7",
            )}
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
