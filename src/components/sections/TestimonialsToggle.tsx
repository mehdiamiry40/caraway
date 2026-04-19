"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review } from "@/data/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? "fill-accent text-accent" : "fill-transparent text-border"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return (
    <article
      key={`${review.name}-${review.location}-${index}`}
      className="relative flex flex-col bg-card border border-border/60 rounded-xl p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <Stars count={review.rating} />
        </div>
        <span className="text-xs text-primary/70 bg-card border border-border/60 px-2.5 py-1 rounded-full shrink-0 font-medium">
          {review.car}
        </span>
      </div>
      <blockquote className="text-muted-foreground text-sm leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="mt-5 pt-5 border-t border-border/40 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0"
          aria-hidden="true"
        >
          {review.name[0]}
        </div>
        <div>
          <div className="font-display font-semibold text-sm text-foreground tracking-tight">{review.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {review.location}, Brisbane
          </div>
        </div>
      </footer>
    </article>
  );
}

interface Props {
  extraReviews: Review[];
  totalCount: number;
}

export function TestimonialsToggle({ extraReviews, totalCount }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (extraReviews.length === 0) return null;

  return (
    <>
      {showAll && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-5">
          {extraReviews.map((review, index) => (
            <ReviewCard
              key={`${review.name}-${review.location}-${index}`}
              review={review}
              index={index}
            />
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className={cn(buttonVariants({ variant: "outline" }), "gap-2 min-h-11")}
        >
          {showAll ? (
            <>
              Show fewer reviews
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Show all {totalCount} reviews
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
