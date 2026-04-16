import Image from "next/image";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe min-h-hero [background:var(--hero-wash)]"
      aria-labelledby="hero-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero-mesh)] opacity-90" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[580px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[50%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24 lg:pl-6 lg:pr-12">
          <div className="relative z-10 w-full max-w-xl">
            <h1
              id="hero-heading"
              className="text-[2rem] sm:text-5xl lg:text-[3.5rem] font-display font-bold leading-[1.05] tracking-tight text-primary mb-4 sm:mb-5 break-words scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              Cash for Cars Brisbane
              <br />
              — Paid on Pickup
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-md">
              Sell your car for cash today. Free pickup across Greater Brisbane,
              payment on the spot. Any make, any condition — up to $9,999.
            </p>

            <HeroCTAs />
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0">
          <div className="absolute inset-x-6 bottom-4 top-10 rounded-[2rem] bg-primary/12 blur-3xl lg:inset-8" aria-hidden="true" />
          <div className="relative block h-full min-h-[260px] sm:min-h-[340px] overflow-hidden rounded-t-[2rem] sm:rounded-t-[2.5rem] lg:rounded-none">
            <Image
              src="/images/tow-truck-hero.webp"
              alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
              title="Caraway cash for cars Brisbane — free pickup"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background/15 via-transparent to-primary/35" />
          </div>
        </div>
      </div>
    </section>
  );
}
