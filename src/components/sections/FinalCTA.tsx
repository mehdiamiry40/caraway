import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

export function FinalCTA() {
  return (
    <section
      className="relative min-h-[440px] overflow-hidden bg-ink-deep text-on-dark-hi"
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <picture>
        <source srcSet="/images/tow-truck-hero.avif" type="image/avif" />
        <source srcSet="/images/tow-truck-hero.webp" type="image/webp" />
        <img
          src="/images/tow-truck-hero.webp"
          alt="Tilt-tray truck transporting a car"
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,26,57,0.94),rgba(10,47,104,0.74)_62%,rgba(69,5,22,0.34))]" aria-hidden="true" />

      <div className="site-container relative z-10 flex min-h-[440px] items-center py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="t-index w-fit border-b border-on-dark-hi/70 pb-3 text-cta-bright">Ready when you are</p>
          <h2 className="mt-6 font-display text-4xl font-medium leading-[1.04] tracking-tight text-on-dark-hi text-balance sm:text-6xl">
            Find out what your car could be worth today.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-hi/80">
            One form. A clear offer. Pickup included across Greater Brisbane when Caraway buys.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#quote-form" className={buttonVariants({ size: "lg" })}>
              Get my quote <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className="inline-flex min-h-14 items-center justify-center gap-2 border border-on-dark-hi px-8 text-base font-bold text-on-dark-hi transition hover:bg-on-dark-hi hover:text-ink-deep"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>
          </div>
        </div>
      </div>
    </section>
  );
}
