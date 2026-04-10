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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent mb-2">All makes & conditions</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight">
            What Cars We Buy in Brisbane
          </h2>
          <p className="mt-3 text-primary-foreground/60 text-sm sm:text-base max-w-xl mx-auto">
            We purchase all vehicle types across Greater Brisbane — regardless of age, condition, or registration status.
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
                  "group relative flex flex-col items-center text-center p-4 sm:p-6 rounded-lg",
                  "bg-white/[0.06] border border-white/10",
                  "hover:bg-white hover:border-white hover:text-primary hover:shadow-lg",
                  "hover:-translate-y-0.5 transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  "touch-manipulation min-h-[120px] sm:min-h-[140px]"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-lg mb-3",
                  "bg-accent/20 text-accent",
                  "group-hover:bg-accent group-hover:text-white",
                  "transition-all duration-300"
                )}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-display font-bold text-sm sm:text-base leading-tight mb-1">
                  {type.label}
                </span>
                <span className="text-[11px] sm:text-xs text-primary-foreground/40 group-hover:text-muted-foreground leading-tight">
                  {type.desc}
                </span>
                <ArrowRight className="absolute top-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200" aria-hidden />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-xs uppercase tracking-wider text-primary-foreground/30 mb-3">Also accepted</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {alsoAccepted.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-white/[0.08] text-xs sm:text-sm text-primary-foreground/50 bg-white/[0.02]"
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
