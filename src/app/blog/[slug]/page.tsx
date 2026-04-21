import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import BlogPostView from "@/views/BlogPost";
import { blogPosts } from "@/data/blog-posts";
import { buildBlogPostSeoProps } from "./metadata";

export { generateMetadata, generateStaticParams } from "./metadata";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const { articleSchema, breadcrumbItems } = buildBlogPostSeoProps(post);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbListSchema(breadcrumbItems)]} />
      <BlogPostView post={post} />
    </>
  );
}
