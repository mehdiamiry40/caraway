import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Blog from "@/views/Blog";
import { indexableBlogPosts } from "@/data/blog-posts";
import { SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cash for Cars Brisbane Blog — Tips & Guides",
  description:
    "Expert tips on selling your car for cash in Brisbane. Learn how to get the best price, what paperwork you need, and how same- or next-day pickup works. Read more now.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Cash for Cars Brisbane Blog — Tips & Guides",
    description:
      "Expert tips on selling your car for cash in Brisbane. Learn how to get the best price, what paperwork you need, and how same- or next-day pickup works.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway cash for cars Brisbane",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cash for Cars Brisbane Blog — Caraway",
    description:
      "Expert tips on selling your car for cash in Brisbane. Learn how to get the best price, paperwork you need, and how same- or next-day pickup works.",
    images: [{ url: "/images/tow-truck-hero.webp", alt: "Caraway cash for cars Brisbane" }],
  },
};

export default function BlogPage() {
  const canonical = `${SITE_URL}/blog`;
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
            dateModified: CONTENT_DEPLOY_DATE,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: indexableBlogPosts.length,
              itemListElement: indexableBlogPosts.map((post, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: post.title,
                url: post.canonicalUrl,
              })),
            },
            hasPart: indexableBlogPosts.map((post) => ({
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
            blogPost: indexableBlogPosts.map((post) => ({
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
