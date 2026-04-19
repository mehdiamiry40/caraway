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
    <section className="section-y bg-primary text-primary-foreground" aria-label="Types of cars we buy in Brisbane">
      <div className="site-container">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight">
            What Cars We Buy in Brisbane
          </h2>
          <p className="mt-3 text-primary-foreground/80 text-sm sm:text-base max-w-xl mx-auto">
            We purchase all vehicle types across Greater Brisbane — regardless of age, condition, or registration status.
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
                  "group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-xl",
                  "bg-primary-foreground/[0.06] border border-primary-foreground/10",
                  "hover:border-primary-foreground/40 hover:bg-primary-foreground/[0.09]",
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
                <span className="font-display font-bold text-sm sm:text-base leading-tight mb-1">
                  {type.label}
                </span>
                <span className="text-[11px] sm:text-xs text-primary-foreground/80 leading-tight">
                  {type.desc}
                </span>
                <ArrowRight className="absolute top-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200" aria-hidden />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-xs uppercase tracking-wider text-primary-foreground/80 mb-3">Also accepted</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {alsoAccepted.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-primary-foreground/15 text-xs sm:text-sm text-primary-foreground/80"
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
