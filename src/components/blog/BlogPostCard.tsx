import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";
import { ArrowRight } from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type BlogPostCardProps = {
  post: BlogPost;
  headingLevel?: "h2" | "h3";
  variant?: "standard" | "compact";
  showDate?: boolean;
};

/**
 * An article entry: a rule, the category, the title, the date line. Text
 * order inside the link is category, title, date, read time, "Read".
 */
export function BlogPostCard({
  post,
  headingLevel = "h3",
  variant = "standard",
  showDate = true,
}: BlogPostCardProps) {
  const Heading = headingLevel;
  const isCompact = variant === "compact";

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col border-t border-foreground/25 pb-2 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        <span className="type-label text-[0.75rem] text-muted-foreground">
          {post.category}
        </span>
        <Heading
          className={`mt-2 font-display font-semibold leading-[1.22] tracking-[-0.018em] text-primary text-balance decoration-cta decoration-2 underline-offset-[5px] group-hover:underline ${isCompact ? "text-[1.1875rem]" : "text-[1.25rem] sm:text-[1.375rem]"}`}
        >
          {post.title}
        </Heading>
        <div className="mt-auto flex items-center gap-2.5 pt-4 text-sm text-muted-foreground">
          {showDate && (
            <>
              <time dateTime={post.date} className="tabular-nums">
                {formatDate(post.date)}
              </time>
              <span aria-hidden>·</span>
            </>
          )}
          <span>{post.readTime}</span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent-ink">
            Read
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedBlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="mb-14 sm:mb-16">
      <Link
        href={`/blog/${post.slug}`}
        className="group block border-y-2 border-primary py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:py-10"
        aria-label={`Read: ${post.title}`}
      >
        <div className="type-label flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem]">
          <span className="text-accent-ink">
            Featured
          </span>
          <span className="text-muted-foreground">
            {post.category}
          </span>
        </div>
        <h2 className="type-h1 mt-3 max-w-[24ch] text-primary text-balance decoration-cta decoration-[3px] underline-offset-[7px] group-hover:underline">
          {post.title}
        </h2>
        <p className="type-lead mt-4 max-w-[62ch] text-foreground/80 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <time dateTime={post.date} className="tabular-nums">
            {formatDate(post.date)}
          </time>
          <span>{post.readTime}</span>
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-accent-ink sm:ml-auto">
            Read the feature
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
