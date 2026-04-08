import Link from "next/link";
import { ArrowRight } from "lucide-react";

const linkedTypes = [
  { label: "Old Cars", href: "/old-cars-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
  { label: "Scrap Cars", href: "/scrap-car-removal-brisbane" },
  { label: "Used Cars", href: "/used-cars-brisbane" },
  { label: "Unwanted Cars", href: "/unwanted-cars-brisbane" },
  { label: "Accident Write-offs", href: "/accident-cars-brisbane" },
  { label: "Junk Cars", href: "/junk-cars-brisbane" },
  { label: "Unregistered Cars", href: "/unregistered-cars-brisbane" },
];

const plainTypes = [
  "Fleet Vehicles", "Utes & 4x4s", "SUVs",
  "Vans & Trucks", "Flood-Damaged Cars",
  "Non-Running Cars", "Classic Cars",
];

export function CarTypes() {
  return (
    <section className="section-y bg-primary text-primary-foreground" aria-label="Types of cars we buy in Brisbane">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-14">
          <div className="md:w-1/3 shrink-0">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 leading-tight">What Cars We Buy in Brisbane</h2>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">
              We purchase all vehicle types across Greater Brisbane — regardless of age, condition, or registration status.
            </p>
          </div>

          <div className="w-full flex flex-wrap gap-3">
            {linkedTypes.map((type) => (
              <Link
                key={type.label}
                href={type.href}
                className="group inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-white/15 bg-white/[0.06] text-sm font-medium hover:bg-white hover:text-primary hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none backdrop-blur-sm"
              >
                {type.label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
              </Link>
            ))}
            {plainTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-5 py-3 rounded-xl border border-white/[0.08] text-sm text-primary-foreground/50 cursor-default bg-white/[0.02]"
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
