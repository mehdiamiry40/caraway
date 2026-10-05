import Image from "next/image";
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
          <div className="grid grid-cols-1 items-center lg:grid-cols-2">
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.06] tracking-display text-on-dark-hi text-balance">
                What's your car worth?
              </h2>
              <p className="mt-4 text-base text-on-dark-hi/85 sm:text-lg">
                One form. A written offer.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ size: "lg" }), "group px-8")}
                >
                  Get my quote
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <TrackedPhoneLink
                  href={BUSINESS.phoneTel}
                  location="final_cta"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-on-dark-hi underline decoration-cta underline-offset-4 hover:text-cta-bright"
                  ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>

            <div className="relative h-56 sm:h-72 lg:h-full lg:min-h-[22rem]">
              <Image
                src="/images/car-removal-brisbane-access-readiness-v1.jpg"
                alt="Tilt-tray truck arriving to collect a car from a Brisbane driveway"
                fill
                sizes="(max-width: 1023px) calc(100vw - 2rem), 640px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
