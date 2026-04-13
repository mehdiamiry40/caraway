import { Star, Quote } from "lucide-react";
import { reviews as allReviews } from "@/data/reviews";
import { TestimonialsToggle } from "./TestimonialsToggle";

const INITIAL_COUNT = 6;

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

export function Testimonials() {
  const initialReviews = allReviews.slice(0, INITIAL_COUNT);
  const extraReviews = allReviews.slice(INITIAL_COUNT);

  return (
    <section id="reviews" className="section-y bg-white" aria-label="What sellers say">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-18">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary text-balance">
            Cash for Cars Brisbane Reviews
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Verified reviews from Brisbane sellers.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2">
              <div className="flex gap-0.5" aria-label="4.9 out of 5 stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>
              <span className="text-2xl font-display font-bold text-foreground">4.9</span>
              <span className="text-muted-foreground">/ 5 from 200+ Brisbane sellers</span>
            </div>
          </div>
        </div>

        {/* First batch — server-rendered, no JS needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {initialReviews.map((review, index) => (
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
          ))}
        </div>

        {/* Toggle + extra reviews — client island, JS only fetched when toggled */}
        {extraReviews.length > 0 && (
          <TestimonialsToggle
            extraReviews={extraReviews}
            totalCount={allReviews.length}
          />
        )}
      </div>
    </section>
  );
}
