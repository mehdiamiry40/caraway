import type { Metadata } from "next";
import type { ArticleJsonLdProps } from "next-seo";
import { blogPosts, calcWordCount, type BlogPost } from "@/data/blog-posts";
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

export function buildBlogPostSeoProps(post: BlogPost) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const plainContent = post.content
    .map((p) => p.replace(/^#{1,6}\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = calcWordCount(plainContent);

  const articleProps: ArticleJsonLdProps = {
    type: "BlogPosting",
    url: canonical,
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.updatedAt,
    image: `${SITE_URL}/images/tow-truck-hero.webp`,
    author: {
      name: "Sam Williams",
      url: `${SITE_URL}/author/sam-williams`,
    },
    publisher: {
      name: publisherSchema.name,
      url: publisherSchema.url,
      logo: (publisherSchema.logo as { url: string }).url,
    },
    isAccessibleForFree: true,
  };

  const breadcrumbItems = [
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Blog", item: `${SITE_URL}/blog` },
    { name: post.title, item: canonical },
  ];

  return { articleProps, breadcrumbItems, wordCount, plainContent };
}
