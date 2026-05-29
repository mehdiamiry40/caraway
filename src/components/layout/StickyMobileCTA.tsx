"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";

/**
 * Mobile-only floating action bar pinned to the bottom of the viewport.
 * Surfaces a one-tap call link and "Get my quote" jump-to-form button on
 * the homepage where visitors are most likely to convert. Hidden on
 * desktop (lg+) so the rest of the layout breathes.
 *
 * Visibility: appears after the user has scrolled past the hero so it
 * doesn't compete with the hero's primary CTA.
 */
export function StickyMobileCTA() {
  const scrollToQuote = useScrollToQuote();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const HERO_OFFSET = 480;
    const onScroll = () => {
      setShown(window.scrollY > HERO_OFFSET);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 pb-safe pl-safe pr-safe pointer-events-none transition-[opacity,transform] duration-300 ease-[var(--ease-out-quint)] ${
        shown
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 motion-reduce:translate-y-0"
      }`}
    >
      <div className="pointer-events-auto mx-auto max-w-md px-3 pb-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 p-1.5 shadow-[0_8px_24px_hsl(var(--shadow-color)/0.18)] backdrop-blur">
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="sticky_mobile"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </TrackedPhoneLink>
          <button
            type="button"
            onClick={() => {
              trackEvent("cta_click", { location: "sticky_mobile" });
              scrollToQuote();
            }}
            className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cta px-4 text-sm font-semibold text-cta-foreground shadow-[0_4px_0_0_hsl(var(--cta)/0.5)] transition-[background-color,transform] duration-200 hover:bg-cta/95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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
