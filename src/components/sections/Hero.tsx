import { HeroCTAs } from "./HeroCTAs";
import { HeroImage } from "./HeroImage";

export function Hero() {
  return (
    <section
      className="aurora-surface aurora-full aurora-animate relative w-full mt-header-safe overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="site-container pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow mb-5">Free pickup · Same-day service</p>
            <h1
              id="hero-heading"
              className="font-display font-bold text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.04] tracking-[var(--tracking-display)] text-foreground text-balance mb-6 scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              <span className="text-gradient">Cash</span> for cars in Brisbane —{" "}
              <span className="text-foreground">paid on pickup.</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-lg mb-8">
              Sell your car for cash today. Free pickup across Greater
              Brisbane, payment on the spot. Any make, any condition — up to
              $9,999.
            </p>
            <HeroCTAs />
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
