import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { indexableBlogPosts, categoryMap, categorySlug } from "@/data/blog-posts";
import { ArrowUpRight, Clock, Tag } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/motion";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

export default function Blog() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="Blog"
      title="Selling a car in Brisbane, clearly explained."
      subtitle={
        <p>
          Tips, guides, and field notes on selling your car for cash in Brisbane. Get the best price and learn how same- or next-day pickup actually works.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-10 sm:mb-12">
          {Object.entries(categoryMap).map(([slug, label]) => (
            <Link
              key={slug}
              href={`/blog/category/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary min-h-[36px] touch-manipulation"
            >
              <Tag className="h-3 w-3" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <RevealGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {indexableBlogPosts.map((post, idx) => (
              <RevealItem key={post.slug} className={idx === 0 ? "md:col-span-2" : ""}>
                <article className="group relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-border hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06),0_32px_64px_-12px_hsl(var(--shadow-color)/0.1)]">
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
                      <Link
                        href={`/blog/category/${categorySlug(post.category)}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary transition-colors hover:bg-primary/15"
                      >
                        <Tag className="h-3 w-3" strokeWidth={1.75} />
                        {post.category}
                      </Link>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3 w-3" strokeWidth={1.75} />
                        {post.readTime}
                      </span>
                      <time dateTime={post.date} className="tabular-nums">
                        {new Date(post.date).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <h2 className={`font-display font-semibold text-foreground leading-[1.2] mb-3 ${idx === 0 ? "text-xl sm:text-2xl md:text-[1.75rem]" : "text-lg sm:text-xl"}`} style={{ letterSpacing: "var(--tracking-tight)" }}>
                      <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-muted-foreground leading-relaxed flex-1 text-[0.9375rem]">
                      {post.excerpt}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Read more
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </div>
    </PageShell>
  );
}
