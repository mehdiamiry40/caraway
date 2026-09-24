import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Blog from "@/views/Blog";
import { blogPosts } from "@/data/blog-posts";
import { OPEN_GRAPH_DEFAULTS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brisbane Car Selling Guides",
  description:
    "Practical Brisbane guides to vehicle valuation inputs, selling options, collection planning, and Queensland paperwork.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Brisbane Car Selling Guides | Caraway",
    description:
      "Practical guides to vehicle valuation inputs, selling options, collection planning, and Queensland paperwork.",
    // No images: the blog shares as a text-only preview. Declaring openGraph
    // here also stops the root layout's card being inherited — Next replaces
    // the parent object rather than merging it.
  },
  twitter: {
    // "summary", not "summary_large_image": there is no image to feature.
    card: "summary",
    title: "Brisbane Car Selling Guides | Caraway",
    description:
      "Practical guides to vehicle valuation inputs, selling options, collection planning, and Queensland paperwork.",
  },
};

export default function BlogPage() {
  const canonical = `${SITE_URL}/blog`;
  const latestBlogDate = blogPosts.reduce(
    (latest, post) => {
      const stamp = post.updatedAt || post.date;
      return stamp > latest ? stamp : latest;
    },
    "2025-01-01",
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Blog", item: `${SITE_URL}/blog` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Caraway Blog",
            description:
              "Tips, guides, and insights about selling your car for cash in Brisbane.",
            url: canonical,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: latestBlogDate,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: blogPosts.length,
              itemListElement: blogPosts.map((post, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: post.title,
                url: post.canonicalUrl,
              })),
            },
            hasPart: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: post.canonicalUrl,
              datePublished: post.date,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${canonical}#blog`,
            name: "Caraway Blog",
            description:
              "Tips, guides, and insights about selling your car for cash in Brisbane.",
            url: canonical,
            inLanguage: "en-AU",
            publisher: { "@id": `${SITE_URL}/#organization` },
            blogPost: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: post.canonicalUrl,
              datePublished: post.date,
              dateModified: post.updatedAt || post.date,
            })),
          },
        ]}
      />
      <Blog />
    </>
  );
}
