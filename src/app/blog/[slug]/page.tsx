import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import BlogPostView from "@/views/BlogPost";
import { blogPosts, calcWordCount } from "@/data/blog-posts";
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

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.isIndexable ? undefined : { index: false, follow: true },
    openGraph: {
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: ["Sam Williams"],
      tags: [post.category],
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const wordCount = calcWordCount(post.content.join(" "));
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <>
      <JsonLd
        data={[
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
            articleSection: post.category,
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
              jobTitle: "Senior Buyer",
              worksFor: {
                "@type": "Organization",
                name: "Caraway",
                url: SITE_URL,
              },
            },
            publisher: publisherSchema,
            inLanguage: "en-AU",
          },
        ]}
      />
      <BlogPostView post={post} />
    </>
  );
}
