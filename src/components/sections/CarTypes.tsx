import Link from "next/link";
import { AlertTriangle, Ban, Car, Recycle, ShieldOff, Wrench } from "lucide-react";

const carTypes = [
  { label: "Used cars", href: "/sell-my-car-brisbane", icon: Car, desc: "Daily drivers, second cars and high-kilometre vehicles." },
  { label: "Damaged cars", href: "/damaged-cars-brisbane", icon: Wrench, desc: "Accident, flood, fire or mechanical damage." },
  { label: "Old and scrap cars", href: "/scrap-car-removal-brisbane", icon: Recycle, desc: "End-of-life vehicles assessed for parts or recycling." },
  { label: "Unwanted cars", href: "/car-removal-brisbane", icon: Ban, desc: "Cars taking up space at home, work or storage." },
  { label: "Hail-damaged cars", href: "/hail-damaged-cars-brisbane", icon: AlertTriangle, desc: "Vehicles ready to sell after insurer status is clear." },
  { label: "Unregistered cars", href: "/unregistered-cars-brisbane", icon: ShieldOff, desc: "Subject to identity, ownership and document checks." },
] as const;

export function CarTypes() {
  return (
    <section className="bg-background py-16 lg:py-24" aria-label="Types of cars Caraway buys in Brisbane">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
          <div>
            <p className="t-index text-accent-ink">What we buy</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Every make. Every model. Almost every condition.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground lg:justify-self-end">
            From a reliable car you no longer need to a vehicle that cannot leave the driveway, send us the details. You do not need to repair, detail, or advertise it first.
          </p>
        </div>

        <ul className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {carTypes.map(({ label, href, icon: Icon, desc }, index) => (
            <li key={label} className="min-h-60 border-b border-r border-border">
              <Link href={href} className="group flex h-full flex-col p-7 transition hover:bg-secondary sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-16 w-16 items-center justify-center bg-accent text-accent-foreground transition group-hover:bg-primary">
                    <Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-accent-ink">
                  {label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
