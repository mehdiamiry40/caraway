import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import BlogPostView from "@/views/BlogPost";
import { blogPosts } from "@/data/blog-posts";
import { buildBlogPostJsonLd } from "./metadata";

export { generateMetadata, generateStaticParams } from "./metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={buildBlogPostJsonLd(post)} />
      <BlogPostView post={post} />
    </>
  );
}
