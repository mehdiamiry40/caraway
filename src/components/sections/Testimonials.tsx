"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { reviews as allReviews, type Review } from "@/data/reviews";
import { Reveal } from "@/components/ui/motion";

const FEATURED = allReviews.slice(0, 9);

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="relative flex w-[17rem] sm:w-[20rem] md:w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-7 md:p-8 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_8px_16px_hsl(var(--shadow-color)/0.08)]">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-primary/[0.1]"
        strokeWidth={1}
      />
      <p className="eyebrow relative z-10 mb-5">Example situation</p>
      <p className="relative z-10 flex-1 text-[0.9375rem] leading-relaxed text-foreground/85">
        {review.text}
      </p>
      <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-border pt-5">
        <div className="min-w-0">
          <div className="font-display text-sm tracking-tight text-foreground">
            {review.location}
          </div>
          <div className="truncate text-xs text-foreground/70 font-medium">
            {review.car}
          </div>
        </div>
      </footer>
    </article>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="seller-situations" className="section-y bg-muted border-t border-b border-border" aria-label="Example seller situations">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow mb-5">Seller situations</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance">
            Common reasons Brisbane drivers
            <br />
            sell to Caraway.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            These examples reflect common situations customers ask us about. Actual experiences, vehicle values, and pickup times vary.
          </p>
        </Reveal>
      </div>

      <div className="site-container">
        <div
          className="marquee-mask relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="marquee-track flex gap-5 sm:gap-6 px-0.5"
            style={{ animationPlayState: paused ? "paused" : "running" }}
            aria-live="off"
          >
            <ul className="flex gap-5 sm:gap-6 list-none m-0 p-0">
              {FEATURED.map((review) => (
                <li key={review.name}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
            {/* Decorative clone — hidden from AT and removed entirely when
                animation is paused so reduced-motion users don't see two
                copies of every story. */}
            <ul
              className="marquee-clone flex gap-5 sm:gap-6 list-none m-0 p-0"
              aria-hidden="true"
            >
              {FEATURED.map((review) => (
                <li key={`${review.name}-clone`}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
}
