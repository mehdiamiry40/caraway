import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

export function FinalCTA() {
  return (
    <section
      className="bg-navy py-16 text-navy-foreground sm:py-24 lg:min-h-[45rem] lg:py-28"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:pl-6">
        <div className="max-w-[48rem]">
          <h2 className="font-display text-[2.25rem] font-medium leading-[1.15] text-navy-foreground sm:text-5xl sm:leading-[3.5rem]">
            What&apos;s your car worth? One form. A written offer.
          </h2>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ variant: "white" }), "h-12 px-6")}
            >
              Get my quote
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-navy-foreground underline decoration-navy-foreground/50 underline-offset-4 hover:decoration-navy-foreground"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </div>
        </div>

        <div className="relative w-full max-w-[25rem] shrink-0 self-center border-8 border-orange bg-on-dark-hi shadow-[0_30px_60px_-20px_hsl(var(--shadow-color)/0.55)] transition-transform duration-500 ease-[var(--ease-out-quint)] hover:-rotate-1 lg:self-auto">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan"
            width={800}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 400px"
            loading="lazy"
            className="aspect-[401/516] h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
