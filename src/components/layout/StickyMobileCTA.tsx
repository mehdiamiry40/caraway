"use client";

import { useEffect, useState } from "react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
        "lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background pb-safe pl-safe pr-safe transition-[transform,opacity] duration-200 motion-reduce:transition-none",
        suppressed && "translate-y-full opacity-0 pointer-events-none",
      )}
      aria-hidden={suppressed || undefined}
    >
      <div className="flex items-center gap-3 border-t border-border bg-background px-4 py-3">
        <TrackedPhoneLink
          href={BUSINESS.phoneTel}
          location="sticky_mobile"
          className="inline-flex h-11 shrink-0 items-center rounded-sm px-1 text-sm text-foreground tabular-nums underline decoration-foreground/30 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          tabIndex={suppressed ? -1 : undefined}
        >
          {BUSINESS.phoneDisplay}
        </TrackedPhoneLink>
        <button
          type="button"
          onClick={() => {
            trackEvent("scroll_to_quote_click", { source: "sticky_mobile" });
            scrollToQuote();
          }}
          className={cn(buttonVariants(), "flex-1")}
          tabIndex={suppressed ? -1 : undefined}
        >
          Get my quote
        </button>
      </div>
    </div>
  );
}
