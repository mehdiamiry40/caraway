import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { categoryMap, type BlogPost } from "@/data/blog-posts";
import { blogPageHref } from "@/lib/blog-pagination";
import { BlogPostCard, FeaturedBlogPostCard } from "@/components/blog/BlogPostCard";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

interface BlogProps {
  /** Newest-first posts for this page only. */
  posts: BlogPost[];
  page: number;
  totalPages: number;
}

export default function Blog({ posts, page, totalPages }: BlogProps) {
  // Only page 1 promotes its newest post to the featured card.
  const featured = page === 1 ? posts[0] : undefined;
  const rest = page === 1 ? posts.slice(1) : posts;

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
          <div>
            <div>
              <FeaturedBlogPostCard post={featured} />
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6 sm:mb-8">
              <p className="eyebrow">{page === 1 ? "All articles" : "Older articles"}</p>
              <p className="text-xs font-medium text-muted-foreground">
                Page {page} of {totalPages}
              </p>
            </div>

            <div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {rest.map((post) => (
                  <li key={post.slug}>
                    <BlogPostCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {totalPages > 1 && <BlogPagination page={page} totalPages={totalPages} />}
      </div>
    </PageShell>
  );
}

function BlogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const linkClasses =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <nav aria-label="Blog pages" className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={blogPageHref(page - 1)} rel="prev" className={`${linkClasses} border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary`}>
          Previous
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${linkClasses} border-primary bg-primary text-primary-foreground`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={blogPageHref(p)}
            aria-label={`Go to blog page ${p}`}
            className={`${linkClasses} border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary`}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={blogPageHref(page + 1)} rel="next" className={`${linkClasses} border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary`}>
          Next
        </Link>
      )}
    </nav>
  );
}
