import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { indexableBlogPosts, categoryMap, categorySlug } from "@/data/blog-posts";
import { ArrowRight, Clock, Tag } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

export default function Blog() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Cash for Cars Brisbane Blog"
      subtitle={
        <p>
          Expert tips, guides, and insights on selling your car for cash in Brisbane. Get the best price and learn how same- or next-day pickup works.
        </p>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-10">
          {Object.entries(categoryMap).map(([slug, label]) => (
            <Link
              key={slug}
              href={`/blog/category/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-medium text-foreground/80 hover:border-primary/30 hover:text-primary hover:bg-muted/50 transition-colors min-h-[44px] touch-manipulation"
            >
              <Tag className="h-3 w-3" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {indexableBlogPosts.map((post, idx) => (
            <article
              key={post.slug}
              className={`group rounded-lg border border-border/60 bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden ${idx === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`p-4 sm:p-6 md:p-8 flex flex-col h-full ${idx === 0 ? "md:p-10" : ""}`}>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-5">
                  <Link
                    href={`/blog/category/${categorySlug(post.category)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-accent text-xs hover:bg-accent/20 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </Link>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h2 className="font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3 text-lg sm:text-xl">
                  <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-2 decoration-primary/30">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-muted-foreground leading-relaxed flex-1 text-sm">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] touch-manipulation"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <InternalLinks />
    </PageShell>
  );
}
