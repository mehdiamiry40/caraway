import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

/** Closing band: the question, the one gold button, the phone number. */
export function FinalCTA() {
  return (
    <section
      className="relative border-t border-border bg-secondary py-14 sm:py-20"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="type-display max-w-[15ch] text-primary">
            What&apos;s your car worth? One form. A written offer.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ size: "lg" }), "group ring-offset-secondary")}
            >
              Get my quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className="group inline-flex min-h-12 items-center rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="text-[1.625rem] font-bold leading-none tabular-nums tracking-[-0.01em] underline decoration-primary/30 decoration-2 underline-offset-[6px] group-hover:decoration-primary">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan"
            width={800}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 480px"
            loading="lazy"
            className="aspect-[3/2] h-auto w-full rounded-lg object-cover object-[30%_62%]"
          />
        </div>
      </div>
    </section>
  );
}
