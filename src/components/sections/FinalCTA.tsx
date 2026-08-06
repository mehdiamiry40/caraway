import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section
      className="section-y bg-secondary"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container text-center">
        <p className="eyebrow mb-5">Ready when you are</p>
        <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.01] tracking-display text-primary">
          Your next car-free chapter starts here.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          One short form, a confirmed offer, and pickup across Greater Brisbane.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#price-estimator"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group w-full rounded-full px-8 sm:w-auto",
            )}
          >
            Get my quote
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="final_cta"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary transition-colors hover:text-accent-ink"
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
