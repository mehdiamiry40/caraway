import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";

/**
 * Mobile-only floating action bar. It is intentionally static HTML so it does
 * not add scroll listeners or hydration work to the initial page.
 */
export function StickyMobileCTA() {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pb-safe pl-safe pr-safe">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 p-1.5 shadow-[0_8px_24px_hsl(var(--shadow-color)/0.18)] backdrop-blur">
          <a
            href={BUSINESS.phoneTel}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            aria-label={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
          <Link
            href="/#price-estimator"
            className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cta px-4 text-sm font-semibold text-cta-foreground shadow-[0_4px_0_0_hsl(var(--cta)/0.5)] transition-[background-color,transform] duration-200 hover:bg-cta/95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Get my quote
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
