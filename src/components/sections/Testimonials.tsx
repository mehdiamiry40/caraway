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
          className={`w-3.5 h-3.5 ${i < count ? "fill-accent text-accent" : "fill-transparent text-border"}`}
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
    <article className="relative flex w-[20rem] sm:w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-7 sm:p-8 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_4px_8px_hsl(var(--shadow-color)/0.04)]">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-primary/[0.07]"
        strokeWidth={1}
      />
      <Stars count={review.rating} />
      <blockquote className="relative z-10 mt-5 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-semibold text-primary"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold tracking-tight text-foreground">
            {review.name}
          </div>
          <div className="truncate text-xs text-muted-foreground/80">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow mb-5">Seller stories</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            Honest feedback from
            <br />
            people who sold us their car.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg max-w-xl">
            Real quotes from real sellers across Greater Brisbane — collected on Google and pulled in here unedited.
          </p>
        </Reveal>
      </div>

      <div
        className="marquee-mask relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="marquee-track flex gap-5 sm:gap-6 px-4 sm:px-6"
          style={{ animationPlayState: paused ? "paused" : "running" }}
          aria-live="off"
        >
          {track.map((review, index) => (
            <ReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <TrackedGoogleBusinessLink
          location="testimonials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Read more on Google
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </TrackedGoogleBusinessLink>
      </div>
    </section>
  );
}
