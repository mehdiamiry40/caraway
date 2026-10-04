import Link from "next/link";
import { ArrowRight, Car, Wrench, Recycle, ShieldOff, AlertTriangle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

const carTypes = [
  { label: "Used Cars", href: "/sell-my-car-brisbane", icon: Car, desc: "Direct-buyer quote option" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane", icon: Wrench, desc: "Accident, flood or fire damage" },
  { label: "Scrap, Old & Junk Cars", href: "/scrap-car-removal-brisbane", icon: Recycle, desc: "End-of-life vehicle assessment" },
  { label: "Unwanted Cars", href: "/car-removal-brisbane", icon: Ban, desc: "Pickup included when we buy" },
  { label: "Hail-Damaged Cars", href: "/hail-damaged-cars-brisbane", icon: AlertTriangle, desc: "After insurer status is clear" },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane", icon: ShieldOff, desc: "Identity and document check" },
];

const alsoAccepted = [
  "Fleet Vehicles", "Utes & 4x4s", "SUVs", "Vans & Trucks",
  "Flood-Damaged Cars", "Non-Running Cars", "Classic Cars",
];

export function CarTypes() {
  return (
    <section className="section-y bg-primary text-primary-foreground" aria-label="Types of cars we buy in Brisbane">
      <div className="site-container">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display leading-tight">
            What Cars We Buy in Brisbane
          </h2>
          <p className="mt-3 text-primary-foreground/90 text-sm sm:text-base max-w-xl mx-auto">
            We assess many vehicle types and conditions across Greater Brisbane. The quote depends on the individual car, ownership, location, and access.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {carTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.label}
                href={type.href}
                className={cn(
                  "group relative flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-xl",
                  "bg-primary-foreground/[0.08] border border-primary-foreground/20",
                  "hover:border-primary-foreground/50 hover:bg-primary-foreground/[0.12]",
                  "hover:-translate-y-0.5 transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  "touch-manipulation min-h-[116px] sm:min-h-[136px]"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3",
                  "bg-accent/20 text-accent",
                  "transition-all duration-300"
                )}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </div>
                <span className="font-display text-sm sm:text-base leading-tight mb-1">
                  {type.label}
                </span>
                <span className="text-[11px] sm:text-xs text-primary-foreground/85 leading-tight">
                  {type.desc}
                </span>
                <ArrowRight className="absolute top-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200" aria-hidden />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-xs uppercase tracking-wider text-primary-foreground/90 mb-3">Also accepted</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {alsoAccepted.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-3.5 py-1.5 rounded-none border border-primary-foreground/25 text-xs sm:text-sm text-primary-foreground/90 font-medium"
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
