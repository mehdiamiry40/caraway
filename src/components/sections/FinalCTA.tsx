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
      className="relative overflow-hidden bg-cta py-14 text-cta-foreground sm:py-20 lg:py-24"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-[44rem]">
          <h2 className="display-impact text-[2.75rem] text-cta-foreground sm:text-[4rem] lg:text-[4.5rem]">
            What&apos;s your car worth? One form. A written offer.
          </h2>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
            >
              Get my quote
              <ArrowRight className="h-5 w-5 text-cta-bright transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className="group inline-flex min-h-12 items-center gap-3 text-cta-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cta"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-cta-foreground transition-colors group-hover:bg-cta-foreground group-hover:text-cta-bright">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="font-display text-[2rem] font-extrabold leading-none tracking-[0.02em]">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>
          </div>
        </div>

        <div className="relative w-full max-w-[26rem] shrink-0 self-center border-[10px] border-ink bg-ink shadow-[0_30px_60px_-24px_hsl(var(--shadow-color)/0.6)] transition-transform duration-500 ease-[var(--ease-out-quint)] hover:-rotate-1 motion-reduce:transition-none lg:self-auto">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan"
            width={800}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 416px"
            loading="lazy"
            className="aspect-[4/3] h-auto w-full object-cover object-[30%_62%]"
          />
          <div aria-hidden="true" className="hazard-stripe h-3" />
        </div>
      </div>
    </section>
  );
}
