import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { indexableBlogPosts, categoryMap } from "@/data/blog-posts";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/motion";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog() {
  const [featured, ...rest] = indexableBlogPosts;

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="The Caraway Journal"
      title="Selling a car in Brisbane, clearly explained."
      subtitle={
        <p>
          Tips, guides, and field notes on selling your car for cash in Brisbane. Get the best price and learn how same- or next-day pickup actually works.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <nav aria-label="Blog categories" className="mb-12 sm:mb-14">
          <p className="eyebrow mb-4">Browse by topic</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryMap).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="inline-flex items-center rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary min-h-[36px] touch-manipulation"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {featured && (
          <RevealGroup>
            <RevealItem>
              <article className="mb-12 sm:mb-16">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block rounded-2xl border border-border/60 bg-secondary/60 p-6 sm:p-8 lg:p-10 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  aria-label={`Read: ${featured.title}`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
                      <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden />
                      Featured
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border/80 bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
                      {featured.category}
                    </span>
                  </div>
                  <h2
                    className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.08] text-foreground text-balance group-hover:text-primary transition-colors"
                    style={{ letterSpacing: "var(--tracking-display)" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[62ch]">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <time dateTime={featured.date} className="tabular-nums">
                      {formatDate(featured.date)}
                    </time>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      {featured.readTime}
                    </span>
                    <span className="sm:ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Read the feature
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </article>
            </RevealItem>
          </RevealGroup>
        )}

        {rest.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6 sm:mb-8">
              <p className="eyebrow">All articles</p>
              <p className="text-xs font-medium text-muted-foreground">
                {rest.length} {rest.length === 1 ? "article" : "articles"}
              </p>
            </div>

            <RevealGroup>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {rest.map((post) => (
                  <RevealItem as="li" key={post.slug}>
                    <article className="h-full">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                      >
                        <span className="mb-4 inline-flex items-center self-start rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-strong">
                          {post.category}
                        </span>
                        <h3
                          className="font-display text-lg sm:text-xl font-bold leading-[1.2] text-foreground text-balance group-hover:text-primary transition-colors"
                          style={{ letterSpacing: "var(--tracking-tight)" }}
                        >
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto pt-5">
                          <div className="pt-4 border-t border-border/60 flex items-center gap-3 text-xs text-muted-foreground">
                            <time dateTime={post.date} className="tabular-nums">
                              {formatDate(post.date)}
                            </time>
                            <span aria-hidden>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                              {post.readTime}
                            </span>
                            <span className="ml-auto inline-flex items-center gap-1 font-medium text-accent-strong transition-all group-hover:gap-1.5">
                              Read
                              <ArrowRight
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </section>
        )}
      </div>
    </PageShell>
  );
}
