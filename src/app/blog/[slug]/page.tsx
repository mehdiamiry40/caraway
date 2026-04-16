import { notFound } from "next/navigation";
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo";
import BlogPostView from "@/views/BlogPost";
import { blogPosts } from "@/data/blog-posts";
import { buildBlogPostSeoProps } from "./metadata";

export { generateMetadata, generateStaticParams } from "./metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const { articleProps, breadcrumbItems } = buildBlogPostSeoProps(post);

  return (
    <>
      <ArticleJsonLd {...articleProps} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BlogPostView post={post} />
    </>
  );
}
