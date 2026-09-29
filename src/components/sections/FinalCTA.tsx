import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

export function FinalCTA() {
  return (
    <section
      className="bg-background py-12 sm:py-16"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary bg-primary text-on-dark-hi">
          <div
            className="h-1 bg-gradient-to-r from-cta via-accent to-white"
            aria-hidden="true"
          />
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-12 lg:px-14">
            <div className="lg:col-span-8">
              <p className="eyebrow-on-dark mb-5">Ready when you are</p>
              <h2 className="font-display text-[clamp(2.1rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-display text-on-dark-hi text-balance">
                Find out what your car could be worth today.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-dark-hi/85 sm:text-lg">
                One form. A confirmed offer in writing. Pickup included when we buy.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/#quote-form"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group w-full px-8 sm:w-auto",
                )}
              >
                Get my quote
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <div className="mt-5 text-sm text-on-dark-hi/75">
                or{" "}
                <TrackedPhoneLink
                  href={BUSINESS.phoneTel}
                  location="final_cta"
                  className="inline-flex items-center gap-1.5 font-medium text-on-dark-hi underline decoration-cta underline-offset-4 hover:text-cta-bright"
                  ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
