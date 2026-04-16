import Image from "next/image";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe bg-background min-h-hero"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[580px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[50%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24 lg:pl-6 lg:pr-12">
          <div className="relative z-10 w-full max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Brisbane · Since 2018
            </p>
            <h1
              id="hero-heading"
              className="text-[2rem] sm:text-5xl lg:text-[3.5rem] font-display font-bold leading-[1.05] tracking-tight text-primary mb-4 sm:mb-5 break-words scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              Cash for cars,
              <br />
              done quietly.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-md">
              A straightforward price, free pickup across Greater Brisbane, and
              payment on the spot. Any make, any condition — from $200 to $1,200.
            </p>

            <HeroCTAs />
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0">
          <div className="relative block h-full min-h-[260px] sm:min-h-[340px]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
