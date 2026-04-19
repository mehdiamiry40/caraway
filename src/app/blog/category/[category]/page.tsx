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
import { SITE_URL } from "@/lib/site";
import { ArrowRight, Clock, Tag } from "lucide-react";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const slugs = new Set(indexableBlogPosts.map((p) => categorySlug(p.category)));
  return Array.from(slugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryMap[category];
  if (!label) {
    return { title: "Category not found | Caraway", robots: { index: false, follow: false } };
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
            dateModified: new Date().toISOString().split("T")[0],
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
        title={label}
        subtitle={
          <p>
            Browse all {label.toLowerCase()} about selling your car for cash in Brisbane.
          </p>
        }
      >
        <div className="site-container py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {posts.map((post, idx) => (
              <article
                key={post.slug}
                className={`group rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden ${idx === 0 ? "md:col-span-2" : ""}`}
              >
                <div className={`p-4 sm:p-6 md:p-8 flex flex-col h-full ${idx === 0 ? "md:p-10" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-accent text-xs">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </span>
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
      </PageShell>
    </>
  );
}
