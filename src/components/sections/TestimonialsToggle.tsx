"use client";

import { useState } from "react";
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review } from "@/data/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
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
      className="group relative bg-muted rounded-lg p-5 sm:p-7 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300"
    >
      <Quote
        className="absolute top-5 right-5 w-8 h-8 text-border group-hover:text-primary/10 transition-colors duration-300 -scale-x-100"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <Stars count={review.rating} />
        </div>
        <span className="text-xs text-primary/70 bg-white border border-border/60 px-2.5 py-1 rounded-full shrink-0 font-medium">
          {review.car}
        </span>
      </div>
      <blockquote className="text-foreground/80 text-sm leading-relaxed mb-6">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
        <div
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0"
          aria-hidden="true"
        >
          {review.name[0]}
        </div>
        <div>
          <div className="font-semibold text-sm text-foreground">{review.name}</div>
          <div className="text-xs text-muted-foreground">
            {review.location}, Brisbane
          </div>
        </div>
      </div>
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
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
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
