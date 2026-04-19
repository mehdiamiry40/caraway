import { ArrowUpRight, Star } from "lucide-react";
import { reviews as allReviews } from "@/data/reviews";
import { TrackedGoogleBusinessLink } from "@/components/layout/TrackedGoogleBusinessLink";

const FEATURED_COUNT = 3;
const averageRating = (
  allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
).toFixed(1);

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "fill-accent text-accent" : "fill-transparent text-border"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const featured = allReviews.slice(0, FEATURED_COUNT);

  return (
    <section id="reviews" className="section-y bg-background" aria-label="What sellers say">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Seller stories</p>
            <h2 className="mt-5 text-3xl font-display font-bold leading-[1.04] tracking-[-0.02em] text-primary text-balance sm:text-4xl md:text-[2.75rem]">
              Honest feedback from people who actually sold us their car.
            </h2>
          </div>

          <div className="surface-card px-6 py-6 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Review snapshot
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-4xl font-bold tracking-tight text-primary">
                    {averageRating}
                  </span>
                  <div className="pb-1">
                    <Stars count={5} />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on recent seller reviews and repeat referrals.
                    </p>
                  </div>
                </div>
              </div>

              <TrackedGoogleBusinessLink
                location="testimonials"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Read more on Google
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </TrackedGoogleBusinessLink>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 sm:gap-6">
          {featured.map((review, index) => (
            <article
              key={review.name}
              className={`surface-card relative flex flex-col px-6 py-6 sm:px-7 sm:py-7 ${
                index === 1 ? "md:-translate-y-3" : ""
              }`}
            >
              <Stars count={review.rating} />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-muted-foreground">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-border/40 pt-5">
                <div className="font-display text-sm font-semibold tracking-tight text-foreground">
                  {review.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {review.location}, Brisbane · {review.car}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
