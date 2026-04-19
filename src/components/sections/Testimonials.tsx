import { ArrowUpRight, Quote, Star } from "lucide-react";
import { reviews as allReviews, type Review } from "@/data/reviews";
import { TrackedGoogleBusinessLink } from "@/components/layout/TrackedGoogleBusinessLink";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

const HOMEPAGE_REVIEW_NAMES = [
  "Jason M.",
  "Sarah K.",
  "Derek T.",
  "Brett H.",
  "Angela R.",
] as const;

const FEATURED: Review[] = HOMEPAGE_REVIEW_NAMES
  .map((name) => allReviews.find((r) => r.name === name))
  .filter((r): r is Review => Boolean(r));

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
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-7 sm:p-8 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_4px_8px_hsl(var(--shadow-color)/0.04)]">
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
  return (
    <section id="reviews" className="section-y bg-background" aria-label="What sellers say">
      <div className="site-container">
        <Reveal className="max-w-2xl mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-semibold text-foreground leading-[1.1] text-balance">
            Honest feedback from
            <br />
            people who sold us their car.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg max-w-xl">
            Real quotes from real sellers across Greater Brisbane — collected on Google and pulled in here unedited.
          </p>
        </Reveal>

        <RevealGroup>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURED.map((review) => (
              <RevealItem key={review.name} className="h-full">
                <ReviewCard review={review} />
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>

        <div className="mt-12 text-center">
          <TrackedGoogleBusinessLink
            location="testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Read more reviews on Google
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </TrackedGoogleBusinessLink>
        </div>
      </div>
    </section>
  );
}
