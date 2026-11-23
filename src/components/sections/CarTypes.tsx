import Link from "next/link";
import { ArrowRight, Car, Wrench, Recycle, ShieldOff, AlertTriangle, Ban } from "lucide-react";

const carTypes = [
  { label: "Used Cars", href: "/sell-my-car-brisbane", icon: Car, desc: "Direct-buyer quote option" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane", icon: Wrench, desc: "Accident, flood or fire damage" },
  { label: "Scrap, Old & Junk Cars", href: "/scrap-car-removal-brisbane", icon: Recycle, desc: "End-of-life vehicle assessment" },
  { label: "Unwanted Cars", href: "/car-removal-brisbane", icon: Ban, desc: "Pickup included when we buy" },
  { label: "Hail-Damaged Cars", href: "/hail-damaged-cars-brisbane", icon: AlertTriangle, desc: "After insurer status is clear" },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane", icon: ShieldOff, desc: "Identity and document check" },
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

export function CarTypes() {
  return (
    <section
      className="section-y bg-background"
      aria-labelledby="car-types-heading"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">What we buy</p>
            <h2
              id="car-types-heading"
              className="display-impact mt-4 text-[2.5rem] text-foreground sm:text-[3.5rem]"
            >
              What cars we buy in Brisbane
            </h2>
          </div>
          <p className="text-base leading-7 text-muted-foreground lg:col-span-5 lg:pb-1.5">
            We assess many vehicle types and conditions across Greater Brisbane. The quote depends on the individual car, ownership, location, and access.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {carTypes.map(({ label, href, icon: Icon, desc }) => (
            <li key={label}>
              <Link
                href={href}
                className="group relative flex h-full items-center gap-4 border border-border bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-foreground hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-ink text-cta-bright transition-colors duration-200 group-hover:bg-cta group-hover:text-cta-foreground">
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl font-bold leading-[1.1] text-foreground">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                    {desc}
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-foreground/35 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-foreground"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-cta transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="shrink-0 text-sm font-bold uppercase tracking-[0.12em] text-foreground">
            We also assess
          </p>
          <ul className="flex flex-wrap gap-2">
            {alsoAssessed.map((type) => (
              <li
                key={type}
                className="inline-flex items-center border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
