import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { indexableBlogPosts, categoryMap } from "@/data/blog-posts";
import { ArrowUpRight, Clock } from "lucide-react";
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
        <nav aria-label="Blog categories" className="mb-12 sm:mb-16">
          <p className="eyebrow mb-4">Browse by topic</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryMap).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground min-h-[36px] touch-manipulation"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {featured && (
          <RevealGroup>
            <RevealItem>
              <article className="group relative mb-14 sm:mb-20">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="block border-t-2 border-foreground pt-6 sm:pt-8"
                  aria-label={`Read: ${featured.title}`}
                >
                  <div className="grid grid-cols-12 gap-x-6 gap-y-6 sm:gap-y-8">
                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                      <p className="eyebrow">Featured</p>
                      <div className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground space-y-1.5">
                        <div className="tabular-nums">{formatDate(featured.date)}</div>
                        <div>{featured.category}</div>
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="h-3 w-3" strokeWidth={1.75} />
                          {featured.readTime}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-8 lg:col-span-9">
                      <h2
                        className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] text-foreground text-balance group-hover:text-accent transition-colors"
                        style={{ letterSpacing: "var(--tracking-display)" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
                        {featured.excerpt}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        Read the feature
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.75}
                        />
                      </span>
                    </div>
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
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums">
                {String(rest.length).padStart(2, "0")} entries
              </p>
            </div>

            <RevealGroup>
              <ul className="border-t border-foreground">
                {rest.map((post, idx) => (
                  <RevealItem as="li" key={post.slug}>
                    <article className="group relative border-b border-border">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block py-7 sm:py-9 transition-colors hover:bg-muted/50 -mx-4 px-4 sm:-mx-6 sm:px-6"
                      >
                        <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-start">
                          <div className="col-span-12 sm:col-span-1">
                            <span
                              className="font-mono text-xs font-bold uppercase tabular-nums text-accent"
                              aria-hidden
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="col-span-12 sm:col-span-8 lg:col-span-8">
                            <h3
                              className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-[1.15] text-foreground text-balance group-hover:text-accent transition-colors"
                              style={{ letterSpacing: "var(--tracking-tight)" }}
                            >
                              {post.title}
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[60ch] line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="col-span-12 sm:col-span-3 lg:col-span-3 font-mono text-xs uppercase tracking-wider text-muted-foreground space-y-1.5 sm:text-right">
                            <div className="tabular-nums">{formatDate(post.date)}</div>
                            <div>{post.category}</div>
                            <div className="inline-flex items-center gap-1.5 sm:justify-end">
                              <Clock className="h-3 w-3" strokeWidth={1.75} />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>

            <div className="flex items-center justify-end mt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                — End of feed —
              </p>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
