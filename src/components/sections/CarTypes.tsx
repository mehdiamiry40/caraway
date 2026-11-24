import Link from "next/link";
import { ArrowRight } from "lucide-react";

const carTypes = [
  { label: "Used Cars", href: "/sell-my-car-brisbane", desc: "Direct-buyer quote option" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane", desc: "Accident, flood or fire damage" },
  { label: "Scrap, Old & Junk Cars", href: "/scrap-car-removal-brisbane", desc: "End-of-life vehicle assessment" },
  { label: "Unwanted Cars", href: "/car-removal-brisbane", desc: "Pickup included when we buy" },
  { label: "Hail-Damaged Cars", href: "/hail-damaged-cars-brisbane", desc: "After insurer status is clear" },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane", desc: "Identity and document check" },
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
 * What we buy, set as a ruled index rather than a grid of cards: the vehicle
 * type on the left, the one-line note beside it, the whole row a link.
 */
export function CarTypes() {
  return (
    <section
      className="section-y bg-background"
      aria-labelledby="car-types-heading"
    >
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="car-types-heading" className="type-h2 max-w-[16ch]">
            What cars we buy in Brisbane
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-foreground/80">
            We assess many vehicle types and conditions across Greater Brisbane. The quote depends on the individual car, ownership, location, and access.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-foreground/25">
            {carTypes.map(({ label, href, desc }) => (
              <li key={label} className="border-b border-border">
                <Link
                  href={href}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:grid-cols-[minmax(0,15rem)_1fr_auto] sm:py-[1.125rem]"
                >
                  <span className="block text-lg font-bold leading-snug text-primary decoration-cta decoration-2 underline-offset-[5px] group-hover:underline">
                    {label}
                  </span>
                  <span className="col-start-1 row-start-2 block text-[0.9375rem] leading-snug text-muted-foreground sm:col-start-2 sm:row-start-1">
                    {desc}
                  </span>
                  <ArrowRight
                    className="col-start-2 row-span-2 row-start-1 h-5 w-5 shrink-0 text-primary/45 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-primary sm:col-start-3 sm:row-span-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-[0.9375rem] leading-7 text-foreground/80">
            <p className="inline font-semibold text-foreground after:content-[':_']">
              We also assess
            </p>
            <ul className="list-inline inline">
              {alsoAssessed.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
