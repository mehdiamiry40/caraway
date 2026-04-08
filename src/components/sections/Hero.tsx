import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Star } from "lucide-react";
import { BUSINESS } from "@/lib/site";

export function Hero() {

  return (
    <section
      className="relative w-full overflow-x-hidden mt-14 lg:mt-[104px]"
      style={{ minHeight: "min(100svh, 560px)" }}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[560px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[46%] shrink-0 px-4 sm:px-6 lg:px-10 py-14 sm:py-18 lg:py-24 lg:pl-16 lg:pr-14">
          <div
            aria-hidden
            className="absolute inset-y-0 z-0 bg-gradient-to-br from-primary via-primary to-primary/90"
            style={{ left: "calc(50% - 50vw)", right: 0 }}
          />
          <div className="relative z-10 w-full">
            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl lg:text-[3.5rem] font-display font-bold leading-[1.08] tracking-tight text-white mb-5"
            >
              Cash for Cars<br />
              <span className="text-accent">Brisbane</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/85 mb-8 sm:mb-10 max-w-md leading-relaxed">
              We buy unwanted cars for cash — pickup included. Running or not, with or without rego.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#quote-section"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-accent hover:bg-accent/90 text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold group border-0 shadow-lg shadow-accent/25 cta-pulse hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
                )}
              >
                Get a free quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center justify-center rounded-xl h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold border-2 border-white/25 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
              >
                {BUSINESS.phoneFriendly}
              </a>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5">
              {["Paid on pickup", "Free towing", "No roadworthy needed"].map((text) => (
                <div key={text} className="flex items-center gap-2 whitespace-nowrap">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent shrink-0" strokeWidth={3} aria-hidden />
                  </div>
                  <span className="text-xs sm:text-sm text-white/80 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0 bg-primary">
          <div
            aria-hidden
            className="absolute inset-y-0 z-0 bg-primary"
            style={{ left: 0, right: "calc(50% - 50vw)" }}
          />
          <div className="relative z-[1] block h-full min-h-[260px] sm:min-h-[340px]">
            <Image
              src="/images/tow-truck-hero.webp"
              alt="Flatbed tow truck loaded with a vehicle — Caraway pickup in Brisbane"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 54vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-primary/30 via-primary/5 to-transparent pointer-events-none" />
          {/* Subtle overlay for bottom badges readability */}
          <div className="absolute inset-x-0 bottom-0 h-32 z-[2] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Price badge */}
          <div className="absolute bottom-5 left-4 right-4 sm:bottom-7 sm:left-auto sm:right-7 sm:max-w-sm z-[3] bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-black/10 border border-white/80 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md shadow-accent/20" aria-hidden>
              $
            </div>
            <div>
              <div className="font-display font-bold text-foreground text-sm">Offers up to $9,999</div>
              <div className="text-xs text-muted-foreground mt-0.5">Depends on make, condition &amp; market</div>
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-5 right-4 sm:top-7 sm:right-7 z-[3] bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg shadow-black/10 border border-white/80">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent drop-shadow-sm" />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-none">4.8</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
