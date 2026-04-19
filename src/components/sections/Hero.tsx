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
              className="font-display font-bold text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.04] tracking-[var(--tracking-display)] text-foreground text-balance mb-6 scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              <span className="text-foreground">Cash for Cars Brisbane</span> and{" "}
              <span className="text-foreground">Scrap Car Removal Brisbane</span>
            </h1>
            <ul className="list-disc list-outside pl-5 sm:pl-6 marker:text-foreground/50 text-xs sm:text-sm md:text-base text-foreground/80 leading-relaxed max-w-lg mb-8 space-y-1.5 sm:space-y-2">
              <li>Instant cash offers up to $9,999</li>
              <li>Free pickup across Greater Brisbane</li>
              <li>Payment on the spot — paid on pickup</li>
              <li>Any make, model or condition accepted</li>
              <li>Same-day or next-day removal, 7 days a week</li>
            </ul>
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
