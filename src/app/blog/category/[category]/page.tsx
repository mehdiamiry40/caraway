import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { PageShell } from "@/components/layout/PageShell";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import {
  categoryMap,
  categorySlug,
  getPostsByCategory,
  blogPosts,
  type BlogPost,
} from "@/data/blog-posts";
import {
  BLOG_CATEGORY_CONTENT_UPDATED,
  OPEN_GRAPH_DEFAULTS,
  SITE_URL,
} from "@/lib/site";
import { ArrowLeft, Newspaper } from "lucide-react";

export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

const CATEGORY_SEO: Record<
  string,
  { title: string; heading: string; description: string }
> = {
  guides: {
    title: "Caraway Blog: Guides",
    heading: "Guides articles",
    description:
      "Browse the Guides archive for articles on Queensland paperwork, ownership, registration, condition, safety, and Brisbane collection planning.",
  },
  insights: {
    title: "Caraway Blog: Insights",
    heading: "Insights articles",
    description:
      "Browse the Insights archive to compare buyer types, whole-car versus parts decisions, fees, pickup terms, and the work behind each sale path.",
  },
  tips: {
    title: "Caraway Blog: Tips",
    heading: "Tips articles",
    description:
      "Browse the Tips archive for practical seller safety and privacy articles, from checking payment terms to clearing personal data before handover.",
  },
};

function categorySeo(category: string, label: string) {
  return (
    CATEGORY_SEO[category] ?? {
      title: `Caraway Blog: ${label}`,
      heading: `${label} articles`,
      description: `Browse Caraway's ${label.toLowerCase()} about Queensland vehicle selling and Brisbane collection planning.`,
    }
  );
}

export function latestCategoryModifiedDate(
  posts: readonly BlogPost[],
): string {
  return posts.reduce((latest, post) => {
    const stamp = post.updatedAt || post.date;
    return stamp > latest ? stamp : latest;
  }, BLOG_CATEGORY_CONTENT_UPDATED);
}

export async function generateStaticParams() {
  const slugs = new Set(blogPosts.map((p) => categorySlug(p.category)));
  return Array.from(slugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryMap[category];
  if (!label) {
    return {
      title: { absolute: "Category not found — Caraway" },
      robots: { index: false, follow: false },
      openGraph: null,
      twitter: null,
    };
  }

  const { title, description } = categorySeo(category, label);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}/blog/category/${category}` },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      type: "website",
      url: `${SITE_URL}/blog/category/${category}`,
      title,
      description,
      // No images: the blog shares as a text-only preview. Declaring
      // openGraph here also stops the root layout's card being inherited —
      // Next replaces the parent object rather than merging it.
    },
    twitter: {
      // "summary", not "summary_large_image": there is no image to feature.
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const label = categoryMap[category];
  if (!label) notFound();

  const posts = getPostsByCategory(category);
  const canonical = `${SITE_URL}/blog/category/${category}`;
  const seo = categorySeo(category, label);
  const latestModified = latestCategoryModifiedDate(posts);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label },
  ];

  const otherCategories = Object.entries(categoryMap).filter(
    ([slug]) => slug !== category
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Blog", item: `${SITE_URL}/blog` },
            { name: label, item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: seo.title,
            description: seo.description,
            url: canonical,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: latestModified,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: posts.length,
              itemListElement: posts.map((post, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: post.title,
                url: post.canonicalUrl,
              })),
            },
            hasPart: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: post.canonicalUrl,
              datePublished: post.date,
              dateModified: post.updatedAt || post.date,
            })),
          },
        ]}
      />
      <PageShell
        icon={Newspaper}
        breadcrumbs={breadcrumbs}
        eyebrow="Blog category"
        title={seo.heading}
        subtitle={
          <p>{seo.description}</p>
        }
      >
        <div className="site-container py-14 sm:py-20 lg:py-24">
          <div className="flex items-baseline justify-between mb-6 sm:mb-8">
            <p className="eyebrow">In this category</p>
            <p className="text-xs font-medium text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-secondary/60 py-14 px-8 text-center">
              <p className="text-base text-muted-foreground">
                No posts in this category yet — check back soon.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Browse all posts
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <BlogPostCard post={post} headingLevel="h2" />
                </li>
              ))}
            </ul>
          )}

          {otherCategories.length > 0 && (
            <section className="mt-16 sm:mt-20">
              <p className="eyebrow mb-4">Other topics</p>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map(([slug, otherLabel]) => (
                  <Link
                    key={slug}
                    href={`/blog/category/${slug}`}
                    className="inline-flex items-center rounded-none border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary min-h-[36px] touch-manipulation"
                  >
                    {otherLabel}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
              Back to all posts
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
