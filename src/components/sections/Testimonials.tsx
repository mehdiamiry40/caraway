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
          className={`h-[15px] w-[15px] ${i < count ? "fill-accent text-accent" : "fill-transparent text-border"}`}
          strokeWidth={1.75}
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
    <article className="relative flex w-[17rem] sm:w-[20rem] md:w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_10px_24px_-8px_hsl(var(--shadow-color)/0.1)]">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 h-7 w-7 text-primary/[0.12]"
        strokeWidth={1.5}
      />
      <Stars count={review.rating} />
      <blockquote className="relative z-10 mt-4 flex-1 text-[0.9375rem] leading-relaxed text-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] font-semibold text-[0.75rem] text-primary ring-1 ring-primary/10"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-[0.9375rem] text-foreground leading-tight">
            {review.name}
          </div>
          <div className="truncate text-[0.75rem] text-muted-foreground mt-0.5">
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
    <section id="reviews" className="section-y bg-background" aria-label="What sellers say">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-12 md:mb-14">
          <p className="eyebrow mb-4">Seller stories</p>
          <h2 className="text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            Honest feedback from people who sold us their car.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg max-w-xl">
            Real quotes from real sellers across Greater Brisbane — collected on Google and pulled in here unedited.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card pl-2 pr-4 py-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Star className="h-3.5 w-3.5 fill-current" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="flex items-center gap-2 text-[0.8125rem]">
              <span className="font-semibold text-foreground">4.9 / 5</span>
              <span className="text-muted-foreground">from 300+ Google reviews</span>
            </div>
          </div>
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
            className="marquee-track flex gap-5 sm:gap-6 px-0.5 py-2"
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
          className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-primary link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Read more on Google
          <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        </TrackedGoogleBusinessLink>
      </div>
    </section>
  );
}
