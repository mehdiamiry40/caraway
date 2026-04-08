import { Star, Quote } from "lucide-react";
import { reviews as testimonials } from "@/data/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? "fill-accent text-accent drop-shadow-sm" : "fill-transparent text-border"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="section-y bg-muted/40" aria-label="What sellers say">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
          <span className="inline-block text-accent font-semibold text-sm tracking-wide uppercase mb-3">Reviews</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-balance">
            Cash for Cars Brisbane Reviews
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Typical situations — old cars, damage, no rego. Your offer depends on your car; these are examples only.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((review, index) => (
            <article
              key={`${review.name}-${review.location}-${index}`}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Decorative quote icon */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-muted/60 group-hover:text-primary/10 transition-colors duration-300 -scale-x-100" aria-hidden />

              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="sr-only">Rated {review.rating} out of 5 stars</span>
                  <Stars count={review.rating} />
                </div>
                <span className="text-xs text-primary/70 bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-lg shrink-0 font-medium">
                  {review.car}
                </span>
              </div>
              <blockquote className="text-foreground/80 text-sm leading-relaxed mb-6 relative z-10">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0 ring-2 ring-primary/10"
                  aria-hidden="true"
                >
                  {review.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.location}, Brisbane</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
