import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

export function FinalCTA() {
  return (
    <section
      className="section-y border-t border-border"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-8">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground text-balance sm:text-5xl">
            Find out what your car could be worth today.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">One form. A written offer.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-span-4 lg:justify-end">
          <Link href="/#quote-form" className={buttonVariants({ size: "lg" })}>
            Get my quote
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="final_cta"
            className={buttonVariants({ variant: "link" }) + " tabular-nums"}
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
