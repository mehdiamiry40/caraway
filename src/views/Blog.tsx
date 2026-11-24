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
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[0.9375rem] font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            "inline-flex h-11 w-11 items-center justify-center rounded-md border text-[0.9375rem] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            page === current
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-card text-primary hover:border-primary",
          )}
        >
          {page}
        </Link>
      ))}
      {current < total ? (
        <Link
          href={blogPageHref(current + 1)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-[0.9375rem] font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <p>Practical guides for Brisbane sellers.</p>
      }
    >
      <div className="site-container py-10 sm:py-14 lg:py-16">
        <nav aria-label="Blog categories" className="mb-10 flex flex-wrap items-baseline gap-x-6 gap-y-1 sm:mb-12">
          <p className="text-[0.9375rem] font-semibold text-foreground">Browse by topic</p>
          <div className="flex flex-wrap gap-x-6">
            {Object.entries(categoryMap).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="inline-flex min-h-11 items-center rounded-sm text-[0.9375rem] font-medium text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
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
            <div className="mb-6 flex items-baseline justify-between sm:mb-8">
              <h2 className="text-[1.5rem] font-semibold leading-tight text-primary sm:text-[1.75rem]">All articles</h2>
              <p className="text-sm text-muted-foreground">
                {totalPages > 1
                  ? `Page ${currentPage} of ${totalPages} · ${rest.length} articles`
                  : `${rest.length} ${rest.length === 1 ? "article" : "articles"}`}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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
