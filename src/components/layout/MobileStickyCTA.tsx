"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const STATIC_TOP_LEVEL_PATHS = new Set([
  "/about",
  "/accessibility",
  "/blog",
  "/contact",
  "/faq",
  "/locations",
  "/privacy",
  "/site-map",
  "/terms",
]);

function hasLocalQuoteForm(pathname: string) {
  if (pathname === "/") return true;
  if (/^\/locations\/[^/]+$/.test(pathname)) return true;
  return /^\/[^/]+$/.test(pathname) && !STATIC_TOP_LEVEL_PATHS.has(pathname);
}

export function MobileStickyCTA() {
  const pathname = usePathname() || "/";
  const quoteHref = hasLocalQuoteForm(pathname) ? "#quote-form" : "/#quote-form";

  return (
    <nav
      aria-label="Quick contact actions"
      className="fixed inset-x-0 bottom-0 z-[220] border-t border-border/80 bg-card/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_30px_hsl(var(--shadow-color)/0.12)] backdrop-blur supports-[backdrop-filter]:bg-card/88 lg:hidden"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3">
        <a
          href={BUSINESS.phoneTel}
          aria-label={`Call Caraway on ${BUSINESS.phoneDisplay}`}
          onClick={() => trackEvent("phone_click", { location: "mobile_sticky_cta" })}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_4px_0_0_hsl(var(--primary)/0.45),0_10px_18px_hsl(var(--primary)/0.2)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
        <Link
          href={quoteHref}
          aria-label="Get a car quote"
          onClick={() => trackEvent("cta_click", { location: "mobile_sticky_cta" })}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cta px-4 text-sm font-semibold text-cta-foreground shadow-[0_4px_0_0_hsl(var(--cta)/0.45),0_10px_18px_hsl(var(--cta)/0.2)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-cta/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px"
        >
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Get Quote
        </Link>
      </div>
    </nav>
  );
}
