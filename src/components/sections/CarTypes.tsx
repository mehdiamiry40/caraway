import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Car, CloudHail, FileX2, Recycle, Truck, Wrench } from "lucide-react";

const carTypes: { label: string; href: string; desc: string; icon: LucideIcon }[] = [
  { label: "Used Cars", href: "/sell-my-car-brisbane", desc: "Sell straight to us", icon: Car },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane", desc: "Accident, flood or fire damage", icon: Wrench },
  { label: "Scrap, Old & Junk Cars", href: "/scrap-car-removal-brisbane", desc: "Cars at the end of their life", icon: Recycle },
  { label: "Unwanted Cars", href: "/car-removal-brisbane", desc: "Free towing included", icon: Truck },
  { label: "Hail-Damaged Cars", href: "/hail-damaged-cars-brisbane", desc: "Once the insurer's position is clear", icon: CloudHail },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane", desc: "We check ID and documents", icon: FileX2 },
];

/* Mirrors the "Cars we buy" paragraph in src/data/home-content.ts. */
const alsoAssessed = [
  "Sedans & hatchbacks",
  "Wagons",
  "Utes & 4WDs",
  "SUVs",
  "Vans",
  "Light commercials",
  "Non-running cars",
  "Fleet & estate clearances",
];

/**
 * What we buy. A centred heading and intro, the vehicle types as a grid of
 * green ticks, then a green band of outlined boxes linking to the service
 * page for each kind of car.
 */
export function CarTypes() {
  return (
    <section aria-labelledby="car-types-heading">
      <div className="section-y bg-background">
        <div className="site-container">
          <div className="section-head">
            <h2 id="car-types-heading" className="type-h2">
              What cars we buy in Brisbane
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-foreground">
              We look at many types of cars, in many conditions, across Greater Brisbane. Your quote depends on the car, its ownership, where it is and the access.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-5 text-center">
              We also look at
            </p>
            <ul className="list-ticks grid grid-cols-1 gap-x-8 gap-y-4 !space-y-0 text-[1.0625rem] font-medium text-foreground min-[420px]:grid-cols-2 lg:grid-cols-4">
              {alsoAssessed.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="on-band bg-accent py-10 text-on-dark-hi sm:py-12">
        <ul className="site-container grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {carTypes.map(({ label, href, desc, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="group flex h-full flex-col items-center gap-2 rounded-sm border-2 border-on-dark-hi px-3 py-6 text-center text-on-dark-hi transition-colors duration-150 hover:bg-on-dark-hi hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
              >
                <Icon className="mb-1 h-12 w-12" strokeWidth={1.5} aria-hidden="true" />
                <span className="block text-lg font-bold leading-snug">
                  {label}
                </span>
                <span className="block text-[0.9375rem] leading-snug">
                  {desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
