"use client";

import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { LicensePlateInput } from "@/components/ui/LicensePlateInput";
import { Reveal } from "@/components/ui/motion";

export function FinalCTA() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent("cta_click", { location: "final_cta" });
    const form = e.currentTarget;
    const input = form.elements.namedItem("plate") as HTMLInputElement | null;
    const target = document.getElementById("price-estimator");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (input) {
      try {
        sessionStorage.setItem("caraway_plate", input.value);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <section className="section-y bg-background" aria-label="Get your quote">
      <div className="site-container">
        <Reveal className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-primary text-on-dark-hi px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          {/* decorative blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[hsl(var(--accent)/0.25)] blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-[hsl(var(--cta)/0.22)] blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--on-dark-hi)/0.12)] px-4 py-1.5 text-xs sm:text-sm font-bold text-on-dark-hi mb-6 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-cta" aria-hidden="true" />
              Ready when you are
            </p>

            <h2 className="font-display font-black text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] tracking-[var(--tracking-display)] text-on-dark-hi text-balance">
              See what your car is worth{" "}
              <span className="hl-green">today</span>.
            </h2>

            <p className="mt-5 mx-auto max-w-xl text-on-dark-hi/85 leading-relaxed text-base sm:text-lg">
              One form. Firm price. Free pickup across Greater Brisbane.
              Cash on the spot — usually same- or next-day.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-10 mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl"
              aria-label="Start your quote"
            >
              <LicensePlateInput
                name="plate"
                aria-label="Your number plate"
                placeholder="123 ABC"
                className="sm:flex-1"
              />
              <button
                type="submit"
                className={cn(buttonVariants({ size: "lg" }), "group sm:w-auto px-8")}
              >
                Check my car
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </form>

            <div className="mt-6 text-sm text-on-dark-hi/75">
              or{" "}
              <TrackedPhoneLink
                href={BUSINESS.phoneHref}
                location="final_cta"
                className="inline-flex items-center gap-1.5 font-bold text-on-dark-hi underline underline-offset-4 decoration-cta hover:text-cta"
                ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                call {BUSINESS.phoneFriendly}
              </TrackedPhoneLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
