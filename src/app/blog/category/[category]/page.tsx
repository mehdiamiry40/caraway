import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { PageShell } from "@/components/layout/PageShell";
import {
  categoryMap,
  categorySlug,
  getPostsByCategory,
  indexableBlogPosts,
} from "@/data/blog-posts";
import { SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";

export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const slugs = new Set(indexableBlogPosts.map((p) => categorySlug(p.category)));
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

  const title = `${label} — Caraway Blog`;
  const description = `Browse all ${label.toLowerCase()} on the Caraway blog — expert articles about selling your car for cash in Brisbane.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/category/${category}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/blog/category/${category}`,
      title,
      description,
      images: [
        {
          url: "/images/tow-truck-hero.webp",
          width: 1200,
          height: 800,
          alt: "Caraway cash for cars Brisbane",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const label = categoryMap[category];
  if (!label) notFound();

  const posts = getPostsByCategory(category);
  const canonical = `${SITE_URL}/blog/category/${category}`;

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
            name: `${label} — Caraway Blog`,
            description: `All ${label.toLowerCase()} articles on the Caraway blog.`,
            url: canonical,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: posts.length,
              itemListElement: posts.map((post, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: post.title,
                url: `${SITE_URL}/blog/${post.slug}`,
              })),
            },
            hasPart: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${SITE_URL}/blog/${post.slug}`,
              datePublished: post.date,
            })),
          },
        ]}
      />
      <PageShell
        breadcrumbs={breadcrumbs}
        eyebrow="Blog category"
        title={label}
        subtitle={
          <p>
            Browse all {label.toLowerCase()} about selling your car for cash in Brisbane.
          </p>
        }
      >
        <div className="site-container py-14 sm:py-20 lg:py-24">
          <div className="flex items-baseline justify-between mb-6 sm:mb-8">
            <p className="eyebrow">In this category</p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums">
              {String(posts.length).padStart(2, "0")} {posts.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          <ul className="border-t border-foreground">
            {posts.map((post, idx) => (
              <li key={post.slug}>
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
                        <h2
                          className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-[1.15] text-foreground text-balance group-hover:text-accent transition-colors"
                          style={{ letterSpacing: "var(--tracking-tight)" }}
                        >
                          {post.title}
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[60ch] line-clamp-2">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent">
                          Read article
                          <ArrowUpRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </span>
                      </div>
                      <div className="col-span-12 sm:col-span-3 lg:col-span-3 font-mono text-xs uppercase tracking-wider text-muted-foreground space-y-1.5 sm:text-right">
                        <div className="tabular-nums">{formatDate(post.date)}</div>
                        <div className="inline-flex items-center gap-1.5 sm:justify-end">
                          <Clock className="h-3 w-3" strokeWidth={1.75} />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          {otherCategories.length > 0 && (
            <section className="mt-16 sm:mt-20 border-t-2 border-foreground pt-8">
              <p className="eyebrow mb-5">Other topics</p>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map(([slug, otherLabel]) => (
                  <Link
                    key={slug}
                    href={`/blog/category/${slug}`}
                    className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground min-h-[36px] touch-manipulation"
                  >
                    {otherLabel}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-14 pt-6 border-t border-border">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
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
