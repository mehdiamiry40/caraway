"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Mobile-only floating action bar. It renders server HTML and hydrates a
 * single IntersectionObserver that hides the bar while a section carrying
 * `data-sticky-cta-suppress` (or an on-page quote form) is on screen — the
 * bar must never compete with the form it points at, or duplicate the final
 * CTA it floats above.
 */
export function StickyMobileCTA() {
  const [suppressed, setSuppressed] = useState(false);
  const scrollToQuote = useScrollToQuote();

  useEffect(() => {
    const targets = document.querySelectorAll(
      "[data-sticky-cta-suppress], #quote-form",
    );
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setSuppressed(visible.size > 0);
      },
      // Trigger once a meaningful slice of the section is on screen, not on
      // the first clipped pixel, so the bar doesn't flicker at boundaries.
      { rootMargin: "-15% 0px -15% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-testid="sticky-mobile-cta"
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40 pb-safe pl-safe pr-safe transition-[transform,opacity] duration-300 motion-reduce:transition-none",
        suppressed && "translate-y-full opacity-0 pointer-events-none",
      )}
      aria-hidden={suppressed || undefined}
    >
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="flex items-stretch gap-1.5 bg-ink p-1.5 shadow-[0_10px_30px_hsl(var(--shadow-color)/0.4)]">
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="sticky_mobile"
            className="flex h-12 shrink-0 items-center justify-center gap-2 border border-on-dark-hi/25 px-4 font-display text-lg font-bold uppercase tracking-[0.04em] text-on-dark-hi transition-colors hover:bg-on-dark-hi/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            tabIndex={suppressed ? -1 : undefined}
          >
            <Phone className="h-5 w-5 text-cta-bright" aria-hidden="true" />
            <span aria-hidden="true">Call</span>
          </TrackedPhoneLink>
          <button
            type="button"
            onClick={() => {
              trackEvent("scroll_to_quote_click", { source: "sticky_mobile" });
              scrollToQuote();
            }}
            className="group flex h-12 flex-1 items-center justify-center gap-2 bg-cta px-4 font-display text-lg font-bold uppercase tracking-[0.04em] text-cta-foreground transition-[background-color,transform] duration-200 hover:bg-cta-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            tabIndex={suppressed ? -1 : undefined}
          >
            Get my quote
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
