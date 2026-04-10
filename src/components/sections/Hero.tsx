import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-x-hidden mt-header-safe bg-white"
      style={{ minHeight: "min(100svh, 560px)" }}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[560px]">
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[48%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-18 lg:py-24 lg:pl-8 lg:pr-14">
          <div className="relative z-10 w-full">
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
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold group border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                )}
              >
                Get a free quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
              </a>
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
        </div>
      </div>
    </section>
  );
}
