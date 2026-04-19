import { ShieldCheck, Recycle, Building2 } from "lucide-react";
import { HeroCTAs } from "./HeroCTAs";
import { HeroImage } from "./HeroImage";

const trustItems = [
  { icon: ShieldCheck, label: "Fully insured" },
  { icon: Recycle, label: "Licensed recycler" },
  { icon: Building2, label: "ABN registered" },
] as const;

export function Hero() {
  return (
    <section
      className="aurora-surface aurora-animate relative w-full mt-header-safe overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="site-container pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow mb-5">Free pickup · Same-day service</p>
            <h1
              id="hero-heading"
              className="font-display font-semibold text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.04] tracking-[var(--tracking-display)] text-foreground text-balance mb-6 scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              <span className="text-gradient">Cash</span> for cars in Brisbane —{" "}
              <span className="text-foreground/95">paid on pickup.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mb-8">
              Sell your car for cash today. Free pickup across Greater
              Brisbane, payment on the spot. Any make, any condition — up to
              $9,999.
            </p>
            <HeroCTAs />

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-medium text-foreground/90">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product shot */}
          <div className="relative z-0 lg:pl-6">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}
