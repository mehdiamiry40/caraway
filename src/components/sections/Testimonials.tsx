"use client";

import { useState } from "react";
import { Quote, Star } from "lucide-react";
import { reviews as allReviews, type Review } from "@/data/reviews";

const FEATURED = allReviews.slice(0, 9);

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="relative flex w-[17rem] shrink-0 flex-col overflow-hidden border border-border bg-card p-5 shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-primary hover:shadow-md sm:w-[20rem] sm:p-7 md:w-[22rem] md:p-8">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-primary/[0.1]"
        strokeWidth={1}
      />
      <div className="relative z-10 flex items-center">
        <span className="star-row" role="img" aria-label={`${review.rating} out of 5 stars`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className={
                i < review.rating
                  ? "h-3.5 w-3.5 fill-current"
                  : "h-3.5 w-3.5 fill-none text-muted-foreground/40"
              }
              strokeWidth={i < review.rating ? 0 : 1.5}
            />
          ))}
        </span>
      </div>
      <p className="relative z-10 mt-5 flex-1 text-[0.9375rem] leading-relaxed text-foreground/85">
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
    <section id="seller-situations" className="section-y scroll-mt-header border-t border-b border-border bg-background" aria-label="Seller situations">
      <div className="site-container">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow mb-5">Seller situations</p>
          <h2 className="font-display text-3xl font-bold leading-[1.1] text-primary text-balance sm:text-4xl md:text-[2.5rem]">
            Common reasons Brisbane drivers
            <br />
            sell to Caraway.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            These examples reflect common situations customers ask us about. Actual experiences, vehicle values, and pickup times vary.
          </p>
          <div className="mt-7 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-border bg-card pl-2 pr-4 py-1.5 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
            <span className="star-row" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            <span className="text-sm font-semibold text-foreground">Rated by Brisbane sellers</span>
            <span className="text-xs text-foreground/65">
              · clear quotes, no surprises
            </span>
          </div>
        </div>
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
