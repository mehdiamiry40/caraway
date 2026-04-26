"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review } from "@/data/reviews";

function SituationCard({
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
        <p className="eyebrow">Example situation</p>
        <span className="text-xs text-primary/70 bg-card border border-border/60 px-2.5 py-1 rounded-full shrink-0 font-medium">
          {review.car}
        </span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {review.text}
      </p>
      <footer className="mt-5 pt-5 border-t border-border/40 flex items-center gap-3">
        <div>
          <div className="font-display text-sm text-foreground tracking-tight">{review.location}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Brisbane seller scenario
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
            <SituationCard
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
              Show fewer situations
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Show all {totalCount} situations
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
