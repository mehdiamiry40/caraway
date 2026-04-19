import { Banknote, MapPin, Wallet, Car, CalendarClock } from "lucide-react";
import { HeroCTAs } from "./HeroCTAs";
import { HeroImage } from "./HeroImage";

const features = [
  { icon: Banknote, label: "Up to $9,999", sub: "Instant cash offer" },
  { icon: MapPin, label: "Greater Brisbane", sub: "Free pickup, every suburb" },
  { icon: Wallet, label: "Paid on the spot", sub: "Cash or bank transfer" },
  { icon: Car, label: "Any make or model", sub: "Running, damaged, scrap" },
  { icon: CalendarClock, label: "Same / next-day pickup", sub: "Open 7 days a week" },
] as const;

export function Hero() {
  return (
    <section
      className="aurora-surface aurora-full aurora-animate relative w-full mt-header-safe overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="site-container pt-10 pb-20 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-16 items-center">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 backdrop-blur px-3 py-1 text-xs font-medium text-primary shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Free pickup · Same-day service
            </span>

            <h1
              id="hero-heading"
              className="mt-5 font-display font-bold text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.04] tracking-[var(--tracking-display)] text-foreground text-balance scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              <span className="text-primary">Cash for cars Brisbane</span> and{" "}
              <span className="text-foreground">Scrap Car Removal Brisbane</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Instant offers, free pickup across Greater Brisbane, paid on the spot.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl">
              {features.map(({ icon: Icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 backdrop-blur px-3.5 py-3 transition-colors duration-200 hover:border-primary/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" size={18} />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <HeroCTAs />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="text-amber-500 tracking-tight text-base leading-none" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="font-semibold text-foreground">4.9</span>
                <span>from Brisbane sellers</span>
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-border" aria-hidden="true" />
              <span>Fully insured · Licensed recycler</span>
            </div>
          </div>

          {/* Product shot */}
          <div className="relative z-0 lg:col-span-5">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}
