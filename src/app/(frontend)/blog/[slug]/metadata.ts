import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import {
  buildBlogPostMetadata,
  buildBlogPostSeoProps,
  buildMissingBlogPostMetadata,
} from "@/lib/blog-post-template";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return post ? buildBlogPostMetadata(post) : buildMissingBlogPostMetadata();
}

export { buildBlogPostSeoProps };
