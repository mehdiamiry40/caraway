import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

/**
 * Call-to-action band: the question in white, an outlined quote button and
 * the yellow phone button, with Caraway's photo framed beside it. Blue by
 * default; pass `tone="green"` where the band sits directly above the blue
 * footer so the two do not run together.
 */
export function FinalCTA({ tone = "blue" }: { tone?: "blue" | "green" }) {
  const green = tone === "green";
  return (
    <section
      className={cn(
        "on-band relative py-10 text-on-dark-hi sm:py-12",
        green ? "bg-accent" : "bg-primary",
      )}
      aria-label="Get your quote"
      data-sticky-cta-suppress="true"
    >
      <div className="site-container grid grid-cols-1 items-center gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="text-center lg:col-span-7 lg:text-left">
          <h2 className="type-display text-on-dark-hi">
            What&apos;s your car worth? One form. A written offer.
          </h2>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ variant: "outlineOnDark", size: "lg" }), green ? "ring-offset-accent hover:text-accent-ink" : "ring-offset-primary")}
            >
              Get my quote
              <ChevronRight className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="final_cta"
              className={cn(buttonVariants({ size: "lg" }), green ? "ring-offset-accent" : "ring-offset-primary")}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="tabular-nums">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <Image
            src="/images/tow-truck-hero.webp"
            alt="Tilt-tray truck carrying a silver sedan"
            width={800}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 480px"
            loading="lazy"
            className="aspect-[16/9] h-auto w-full rounded-md border-4 border-on-dark-hi object-cover object-[30%_62%]"
          />
        </div>
      </div>
    </section>
  );
}
