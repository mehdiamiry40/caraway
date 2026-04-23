"use client";

import { useState } from "react";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { reviews as allReviews, type Review } from "@/data/reviews";
import { TrackedGoogleBusinessLink } from "@/components/layout/TrackedGoogleBusinessLink";
import { Reveal } from "@/components/ui/motion";

const FEATURED = allReviews.slice(0, 9);

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "fill-accent-strong text-accent-strong" : "fill-transparent text-border"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="relative flex w-[17rem] sm:w-[20rem] md:w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-7 md:p-8 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_8px_16px_hsl(var(--shadow-color)/0.08)]">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-primary/[0.1]"
        strokeWidth={1}
      />
      <Stars count={review.rating} />
      <blockquote className="relative z-10 mt-5 flex-1 text-[0.9375rem] leading-relaxed text-foreground/85">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-xs text-primary"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <div className="font-display text-sm tracking-tight text-foreground">
            {review.name}
          </div>
          <div className="truncate text-xs text-foreground/70 font-medium">
            {review.location} · {review.car}
          </div>
        </div>
      </footer>
    </article>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const track = [...FEATURED, ...FEATURED];

  return (
    <section id="reviews" className="section-y bg-muted border-t border-b border-border" aria-label="What sellers say">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow mb-5">Seller stories</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance">
            Honest feedback from
            <br />
            people who sold us their car.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            Real quotes from real sellers across Greater Brisbane — collected on Google and pulled in here unedited.
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
            {track.map((review, index) => (
              <ReviewCard key={`${review.name}-${index}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      <div className="site-container mt-12 text-center">
        <TrackedGoogleBusinessLink
          location="testimonials"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Read more on Google
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </TrackedGoogleBusinessLink>
      </div>
    </section>
  );
}
