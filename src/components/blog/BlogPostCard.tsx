import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

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
  const headingClass = `font-display ${isCompact ? "text-lg" : "text-lg sm:text-xl"} font-semibold leading-[1.2] text-foreground text-balance group-hover:text-primary transition-colors`;

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
      >
        <span className="mb-4 inline-flex items-center self-start rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-ink">
          {post.category}
        </span>
        <Heading
          className={headingClass}
          style={{ letterSpacing: "var(--tracking-tight)" }}
        >
          {post.title}
        </Heading>
        {!isCompact && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-5">
          <div className="pt-4 border-t border-border/60 flex items-center gap-3 text-xs text-muted-foreground">
            {showDate && (
              <>
                <time dateTime={post.date} className="tabular-nums">
                  {formatDate(post.date)}
                </time>
                <span aria-hidden>·</span>
              </>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
              {post.readTime}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-accent-ink transition-all group-hover:gap-1.5">
              Read
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
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
        className="group block rounded-2xl border border-border/60 bg-secondary/60 p-6 sm:p-8 lg:p-10 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        aria-label={`Read: ${post.title}`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary-foreground">
            <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden />
            Featured
          </span>
          <span className="inline-flex items-center rounded-full border border-border/80 bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
            {post.category}
          </span>
        </div>
        <h2
          className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.08] text-foreground text-balance group-hover:text-primary transition-colors"
          style={{ letterSpacing: "var(--tracking-display)" }}
        >
          {post.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[62ch]">
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <time dateTime={post.date} className="tabular-nums">
            {formatDate(post.date)}
          </time>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {post.readTime}
          </span>
          <span className="sm:ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Read the feature
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
