import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { indexableBlogPosts, categoryMap } from "@/data/blog-posts";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { BlogPostCard, FeaturedBlogPostCard } from "@/components/blog/BlogPostCard";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

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
              <FeaturedBlogPostCard post={featured} />
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
                    <BlogPostCard post={post} />
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
