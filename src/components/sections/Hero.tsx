import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Star, Truck, Clock, Shield } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe"
      style={{ minHeight: "min(100svh, 560px)" }}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[560px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[48%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-18 lg:py-24 lg:pl-8 lg:pr-14 bg-white">
          <div className="relative z-10 w-full">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 border border-primary/10 rounded-full px-3 py-1 mb-5">
              <Star className="w-3 h-3 fill-accent text-accent" />
              4.8 rated across Brisbane
            </div>

            <h1
              id="hero-heading"
              className="text-[1.75rem] sm:text-5xl lg:text-[3.5rem] font-display font-bold leading-[1.08] tracking-tight text-primary mb-5 break-words"
            >
              Cash for Cars<br />
              <span className="text-accent">Brisbane</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-md leading-relaxed">
              We buy unwanted cars for cash — pickup included. Running or not, with or without rego.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#price-estimator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold group bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                )}
              >
                Get a free quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
              </a>
            </div>

            <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5">
              {["Paid on pickup", "Free towing", "No roadworthy needed"].map((text) => (
                <div key={text} className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={2.5} aria-hidden />
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0">
          <div className="relative z-[1] block h-full min-h-[260px] sm:min-h-[340px]">
            <Image
              src="/images/tow-truck-hero.webp"
              alt="Flatbed tow truck loaded with a vehicle — Caraway pickup in Brisbane"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 52vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
          {/* Teal overlay for depth */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-primary/60 via-primary/20 to-transparent pointer-events-none" />
          {/* Left fade into white on desktop */}
          <div className="hidden lg:block absolute inset-y-0 left-0 z-[2] w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />

          {/* Bottom stat bar */}
          <div className="absolute bottom-0 left-0 right-0 z-[3] px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {[
                { icon: Truck, text: "Same-day pickup" },
                { icon: Clock, text: "Quote in 60 seconds" },
                { icon: Shield, text: "Up to $9,999 cash" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 sm:gap-2">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" strokeWidth={2} />
                  <span className="text-[10px] sm:text-xs font-medium text-white/90">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
