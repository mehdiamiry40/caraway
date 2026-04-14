import Image from "next/image";
import { Check, Star } from "lucide-react";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe bg-white min-h-hero"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[560px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[48%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-18 lg:py-24 lg:pl-8 lg:pr-14">
          <div className="relative z-10 w-full">
            <h1
              id="hero-heading"
              className="text-[1.75rem] sm:text-5xl lg:text-[3.5rem] font-display font-bold leading-[1.08] tracking-tight text-primary mb-5 break-words scroll-mt-[calc(4rem+env(safe-area-inset-top))]"
            >
              Cash for Cars<br />
              <span className="text-accent">Brisbane</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-md leading-relaxed">
              Get an instant online quote in 60 seconds, or call for a cash offer. Free pickup. Paid on the spot. $300–$9,999.
            </p>

            <HeroCTAs />

            <div className="mt-4 flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label="4.9 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" aria-hidden="true" />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground">4.9</strong> · 200+ Brisbane sellers served
                </span>
              </div>
              <span className="text-sm sm:text-xs text-muted-foreground">
                Based on direct customer feedback.
              </span>
            </div>

            <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5">
              {["Paid on pickup", "Free towing", "No roadworthy needed"].map((text) => (
                <div key={text} className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent shrink-0" strokeWidth={3} aria-hidden />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0">
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white/30 via-transparent to-transparent hidden lg:block" aria-hidden="true" />
          <div className="relative z-[1] block h-full min-h-[260px] sm:min-h-[340px]">
            <Image
              src="/images/tow-truck-hero.webp"
              alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
              title="Caraway cash for cars Brisbane — free pickup"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 52vw"
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
