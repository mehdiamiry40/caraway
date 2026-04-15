import { ArrowUpRight, Star } from "lucide-react";
import { reviews as allReviews } from "@/data/reviews";
import { TrackedGoogleBusinessLink } from "@/components/layout/TrackedGoogleBusinessLink";

const FEATURED_COUNT = 3;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
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

export function Testimonials() {
  const featured = allReviews.slice(0, FEATURED_COUNT);

  return (
    <section id="reviews" className="section-y bg-white" aria-label="What sellers say">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Seller stories
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-primary leading-[1.08] tracking-[-0.02em] text-balance">
            Honest feedback from people who sold us their car.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {featured.map((review) => (
            <article
              key={review.name}
              className="relative flex flex-col bg-card border border-border/60 rounded-xl p-6 sm:p-7"
            >
              <Stars count={review.rating} />
              <blockquote className="mt-5 text-foreground/85 text-base leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <footer className="mt-6 pt-5 border-t border-border/40">
                <div className="font-display font-semibold text-sm text-foreground tracking-tight">
                  {review.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {review.location}, Brisbane · {review.car}
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TrackedGoogleBusinessLink
            location="testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Read more on Google
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </TrackedGoogleBusinessLink>
        </div>
      </div>
    </section>
  );
}
