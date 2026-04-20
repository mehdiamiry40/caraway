import Link from "next/link";
import { ArrowRight, Car, Wrench, Recycle, ShieldOff, AlertTriangle, Ban, Truck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const carTypes = [
  { label: "Old Cars", href: "/old-cars-brisbane", icon: Clock, desc: "Any age, any make" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane", icon: Wrench, desc: "Accident or storm damage" },
  { label: "Scrap Cars", href: "/scrap-car-removal-brisbane", icon: Recycle, desc: "End-of-life vehicles" },
  { label: "Used Cars", href: "/used-cars-brisbane", icon: Car, desc: "Running, registered or not" },
  { label: "Unwanted Cars", href: "/unwanted-cars-brisbane", icon: Ban, desc: "Any reason, we'll take it" },
  { label: "Accident Write-offs", href: "/accident-cars-brisbane", icon: AlertTriangle, desc: "Statutory or repairable" },
  { label: "Junk Cars", href: "/junk-cars-brisbane", icon: Truck, desc: "Non-running, rusted, stripped" },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane", icon: ShieldOff, desc: "No rego? No problem" },
];

const alsoAccepted = [
  "Fleet Vehicles", "Utes & 4x4s", "SUVs", "Vans & Trucks",
  "Flood-Damaged Cars", "Non-Running Cars", "Classic Cars",
];

export function CarTypes() {
  return (
    <section className="section-y aurora-surface-dark" aria-label="Types of cars we buy in Brisbane">
      <div className="site-container relative">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="eyebrow-on-dark mb-4 justify-center">What we buy</p>
          <h2 className="text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-display font-semibold text-on-dark-hi leading-[1.1] text-balance">
            Every car, every condition.
          </h2>
          <p className="mt-5 text-on-dark leading-relaxed text-[1.0625rem] sm:text-lg">
            Across Greater Brisbane — regardless of age, condition, or registration status.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {carTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.label}
                href={type.href}
                className={cn(
                  "group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl",
                  "bg-on-dark-hi/[0.04] border border-on-dark-hi/10",
                  "hover:border-accent/40 hover:bg-on-dark-hi/[0.07]",
                  "hover:-translate-y-1 transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-quint)]",
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none",
                  "touch-manipulation min-h-[120px] sm:min-h-[140px]"
                )}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-3.5 bg-accent/15 text-accent ring-1 ring-accent/20 transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                  <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="font-display font-semibold text-[0.9375rem] sm:text-base text-on-dark-hi leading-tight mb-1.5">
                  {type.label}
                </span>
                <span className="text-[0.75rem] text-on-dark leading-snug">
                  {type.desc}
                </span>
                <ArrowRight className="absolute top-3.5 right-3.5 w-3.5 h-3.5 text-on-dark-hi opacity-0 group-hover:opacity-80 transition-opacity duration-200" strokeWidth={2} aria-hidden />
              </Link>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-[0.75rem] uppercase tracking-[0.12em] font-semibold text-on-dark mb-3">Also accepted</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {alsoAccepted.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-on-dark-hi/15 text-[0.8125rem] text-on-dark-hi/90 font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
