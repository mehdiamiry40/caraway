import type { Metadata } from "next";
import { blogPosts, calcWordCount, type BlogPost } from "@/data/blog-posts";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { publisherSchema } from "@/lib/json-ld-schemas";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Post not found | Caraway",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical,
      languages: {
        "en-AU": canonical,
      },
    },
    robots: post.isIndexable ? undefined : { index: false, follow: true },
    openGraph: {
      url: canonical,
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: ["Sam Williams"],
      tags: [post.category],
      locale: "en_AU",
      siteName: "Caraway",
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
      title: post.title,
      description: post.metaDescription,
      images: [
        {
          url: "/images/tow-truck-hero.webp",
          width: 1200,
          height: 800,
          alt: "Caraway cash for cars Brisbane",
        },
      ],
    },
    other: {
      "article:section": post.category,
      "article:tag": post.category,
      "article:published_time": post.date,
      "article:modified_time": post.updatedAt,
      "article:author": "Sam Williams",
    },
  };
}

export function buildBlogPostJsonLd(post: BlogPost) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const plainContent = post.content
    .map((p) => p.replace(/^#{1,6}\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = calcWordCount(plainContent);
  const articleBody =
    plainContent.length > 5000 ? `${plainContent.slice(0, 4997)}...` : plainContent;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return [
    breadcrumbListSchema(breadcrumbs, canonical),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      dateModified: post.updatedAt,
      url: canonical,
      wordCount,
      articleBody,
      articleSection: post.category,
      timeRequired: `PT${Math.max(1, Math.round(wordCount / 200))}M`,
      keywords: [post.category, "cash for cars Brisbane", "Caraway", "Brisbane car buyers", "sell my car Brisbane"],
      isAccessibleForFree: true,
      inLanguage: "en-AU",
      copyrightHolder: { "@id": `${SITE_URL}/#organization` },
      copyrightYear: new Date(post.date).getFullYear(),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["article h1", "article .post-excerpt"],
      },
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/tow-truck-hero.webp`,
        width: 1200,
        height: 800,
      },
      author: {
        "@type": "Person",
        name: "Sam Williams",
        url: `${SITE_URL}/author/sam-williams`,
        sameAs: `${SITE_URL}/author/sam-williams`,
        jobTitle: "Senior Buyer",
        worksFor: {
          "@type": "Organization",
          name: "Caraway",
          url: SITE_URL,
        },
      },
      publisher: publisherSchema,
    },
  ];
}
