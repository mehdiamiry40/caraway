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
import { ArrowLeft } from "lucide-react";

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
      "Browse guides on Queensland paperwork, ownership, registration, car condition, safety and Brisbane pickup planning.",
  },
  insights: {
    title: "Caraway Blog: Insights",
    heading: "Insights articles",
    description:
      "Browse insights that compare buyer types, selling whole or for parts, fees, pickup terms and the work each way of selling takes.",
  },
  tips: {
    title: "Caraway Blog: Tips",
    heading: "Tips articles",
    description:
      "Browse practical tips on seller safety and privacy, from checking payment terms to clearing personal data before handover.",
  },
};

function categorySeo(category: string, label: string) {
  return (
    CATEGORY_SEO[category] ?? {
      title: `Caraway Blog: ${label}`,
      heading: `${label} articles`,
      description: `Browse Caraway's ${label.toLowerCase()} about selling a car in Queensland and planning a Brisbane pickup.`,
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
        breadcrumbs={breadcrumbs}
        eyebrow="Blog category"
        title={seo.heading}
        subtitle={
          <p>{seo.description}</p>
        }
      >
        <div className="site-container py-10 sm:py-14 lg:py-16">
          <div className="mb-6 flex items-baseline justify-between sm:mb-8">
            <p className="text-[0.9375rem] font-semibold text-foreground">In this category</p>
            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="border-y-2 border-primary py-10">
              <p className="text-base text-muted-foreground">
                No posts in this category yet — check back soon.
              </p>
              <p className="mt-4">
                <Link href="/blog" className="link-arrow link-back text-base">
                  <ArrowLeft aria-hidden />
                  Browse all posts
                </Link>
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <BlogPostCard post={post} headingLevel="h2" />
                </li>
              ))}
            </ul>
          )}

          {otherCategories.length > 0 && (
            <section className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-border pt-6">
              <p className="text-[0.9375rem] font-semibold text-foreground">Other topics</p>
              <div className="flex flex-wrap gap-x-6">
                {otherCategories.map(([slug, otherLabel]) => (
                  <Link
                    key={slug}
                    href={`/blog/category/${slug}`}
                    className="inline-flex min-h-11 items-center rounded-sm text-[0.9375rem] font-medium text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
                  >
                    {otherLabel}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8">
            <Link href="/blog" className="link-arrow link-back text-base">
              <ArrowLeft aria-hidden />
              Back to all posts
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
