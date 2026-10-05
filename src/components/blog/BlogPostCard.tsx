import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";
import { createElement } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { blogIcon } from "@/lib/blog-icons";

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
        className="group flex h-full flex-col overflow-hidden border border-border bg-card hover:border-primary/50 card-lift"
      >
        <div className={`flex flex-1 flex-col ${isCompact ? "p-5" : "p-5 sm:p-6"}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <PostIcon title={post.title} className="h-6 w-6" />
            </span>
            <span className="inline-flex items-center rounded-none bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-ink">
              {post.category}
            </span>
          </div>
          <Heading
            className={headingClass}
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            {post.title}
          </Heading>
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
        className="group block overflow-hidden border border-border/60 bg-secondary/60 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
        aria-label={`Read: ${post.title}`}
      >
        <div className="p-6 sm:p-8 lg:p-10">
          <span className="mb-5 flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground">
            <PostIcon title={post.title} className="h-7 w-7" />
          </span>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-none bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary-foreground">
              <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden />
              Featured
            </span>
            <span className="inline-flex items-center rounded-none border border-border/80 bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {post.category}
            </span>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.08] text-foreground text-balance group-hover:text-primary transition-colors"
            style={{ letterSpacing: "var(--tracking-display)" }}
          >
            {post.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-[62ch] line-clamp-2">
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
        </div>
      </Link>
    </article>
  );
}

function PostIcon({ title, className }: { title: string; className?: string }) {
  return createElement(blogIcon(title), {
    className,
    strokeWidth: 1.75,
    "aria-hidden": true,
  });
}
