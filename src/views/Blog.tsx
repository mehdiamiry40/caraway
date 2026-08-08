import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { blogPosts, categoryMap } from "@/data/blog-posts";
import { BlogPostCard, FeaturedBlogPostCard } from "@/components/blog/BlogPostCard";
import { cn } from "@/lib/utils";
import { BLOG_PAGE_SIZE, blogPageCount } from "@/lib/blog-pagination";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

function blogPageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Blog pages" className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
      {current > 1 ? (
        <Link
          href={blogPageHref(current - 1)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Newer
        </Link>
      ) : null}
      {pages.map((page) => (
        <Link
          key={page}
          href={blogPageHref(page)}
          aria-current={page === current ? "page" : undefined}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            page === current
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
          )}
        >
          {page}
        </Link>
      ))}
      {current < total ? (
        <Link
          href={blogPageHref(current + 1)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Older
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

export default function Blog({ page = 1 }: { page?: number }) {
  const [featured, ...rest] = blogPosts;
  const totalPages = blogPageCount();
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * BLOG_PAGE_SIZE;
  const pagePosts = rest.slice(start, start + BLOG_PAGE_SIZE);

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="The Caraway Journal"
      title="Selling a car in Brisbane, clearly explained."
      subtitle={
        <p>
          Practical guides to comparing selling options, documenting vehicle condition, checking collection terms, and completing Queensland paperwork.
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

        {currentPage === 1 && featured && (
          <div>
            <FeaturedBlogPostCard post={featured} />
          </div>
        )}

        {pagePosts.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6 sm:mb-8">
              <p className="eyebrow">All articles</p>
              <p className="text-xs font-medium text-muted-foreground">
                {totalPages > 1
                  ? `Page ${currentPage} of ${totalPages} · ${rest.length} articles`
                  : `${rest.length} ${rest.length === 1 ? "article" : "articles"}`}
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {pagePosts.map((post) => (
                <li key={post.slug}>
                  <BlogPostCard post={post} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <Pagination current={currentPage} total={totalPages} />
      </div>
    </PageShell>
  );
}
