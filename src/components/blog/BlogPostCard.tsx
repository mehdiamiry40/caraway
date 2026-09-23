import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";

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

export function BlogPostCard({
  post,
  headingLevel = "h3",
  variant = "standard",
  showDate = true,
}: BlogPostCardProps) {
  const Heading = headingLevel;
  const isCompact = variant === "compact";
  const headingClass = "text-base font-semibold leading-snug text-foreground text-balance underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-foreground/40";

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col border-t border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex flex-1 flex-col py-5">
          <span className="eyebrow mb-2">
            {post.category}
          </span>
          <Heading
            className={headingClass}
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            {post.title}
          </Heading>
          {!isCompact && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="mt-auto pt-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {showDate && (
                <>
                  <time dateTime={post.date} className="tabular-nums">
                    {formatDate(post.date)}
                  </time>
                  <span aria-hidden>·</span>
                </>
              )}
              <span className="inline-flex items-center gap-1">
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedBlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="mb-12 sm:mb-16">
      <Link
        href={`/blog/${post.slug}`}
        className="group block border-y border-border py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Read: ${post.title}`}
      >
        <div>
          <p className="eyebrow mb-4">Featured · {post.category}</p>
          <h2
            className="max-w-3xl text-3xl font-semibold leading-[1.15] text-foreground text-balance underline decoration-transparent underline-offset-[6px] transition-colors duration-150 group-hover:decoration-foreground/30"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            {post.title}
          </h2>
          <p className="mt-4 max-w-[62ch] text-base text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <time dateTime={post.date} className="tabular-nums">
              {formatDate(post.date)}
            </time>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
