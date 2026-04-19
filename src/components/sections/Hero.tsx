import { HeroCTAs } from "./HeroCTAs";
import { HeroImage } from "./HeroImage";

export function Hero() {
  return (
    <section
      className="relative w-full mt-header-safe bg-background border-b border-foreground"
      aria-labelledby="hero-heading"
    >
      <div className="site-container pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        {/* Swiss 12-column grid: copy spans 7, image spans 5, separated by a hairline rule. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-stretch">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-7 lg:pr-12 lg:border-r lg:border-foreground">
            <p className="eyebrow mb-8">01 — Free pickup · Same-day service</p>
            <h1
              id="hero-heading"
              className="font-display font-black text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.95] tracking-[var(--tracking-display)] text-foreground text-balance mb-10 scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              Cash for Cars
              <br />
              <span className="text-accent">Brisbane.</span>
              <br />
              Scrap removal,
              <br />
              same day.
            </h1>
            <ul className="border-t border-foreground divide-y divide-foreground/20 text-sm md:text-base text-foreground max-w-lg mb-10">
              <li className="flex gap-4 py-3"><span className="font-mono text-xs text-accent shrink-0 pt-1">→</span><span>Instant cash offers up to $9,999</span></li>
              <li className="flex gap-4 py-3"><span className="font-mono text-xs text-accent shrink-0 pt-1">→</span><span>Free pickup across Greater Brisbane</span></li>
              <li className="flex gap-4 py-3"><span className="font-mono text-xs text-accent shrink-0 pt-1">→</span><span>Payment on the spot — paid on pickup</span></li>
              <li className="flex gap-4 py-3"><span className="font-mono text-xs text-accent shrink-0 pt-1">→</span><span>Any make, model or condition accepted</span></li>
              <li className="flex gap-4 py-3"><span className="font-mono text-xs text-accent shrink-0 pt-1">→</span><span>Same-day or next-day removal, 7 days a week</span></li>
            </ul>
            <HeroCTAs />
          </div>

          {/* Product shot */}
          <div className="relative z-0 lg:col-span-5 lg:pl-12">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}
