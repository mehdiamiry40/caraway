import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ReadingProgress } from "@/components/ReadingProgress";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { categorySlug } from "@/data/blog-posts";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { renderBlogContent } from "@/lib/blog-markdown";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { ArrowLeft, ArrowRight, Clock, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CopyLinkButton } from "@/components/blog/CopyLinkButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.5 9H16V6h-2.5a3.5 3.5 0 0 0-3.5 3.5V12H8v3h2v7h3v-7h2.5l.5-3H13V9.75c0-.414.336-.75.75-.75H13.5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

const AUTHOR = {
  name: BUSINESS.name,
  role: "Editorial",
  href: "/about",
  bio: `${BUSINESS.name} publishes practical Brisbane car-selling guides and reviews regulatory guidance against current official Queensland sources.`,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPost({ post }: { post: BlogPostType }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  const canonical = post.canonicalUrl;
  const shareText = post.title;
  const relatedPosts = getSmartRelatedPosts(post.slug, 3);
  const showUpdated =
    post.updatedAt &&
    post.updatedAt !== post.date &&
    new Date(post.updatedAt).toDateString() !== new Date(post.date).toDateString();

  const xShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonical)}`;
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`;
  const liShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
  const authorName = post.author ?? AUTHOR.name;
  const isDefaultAuthor = authorName === AUTHOR.name;
  const authorHref = isDefaultAuthor ? AUTHOR.href : "/";
  const authorRole = isDefaultAuthor ? AUTHOR.role : "Team";
  const authorBio = isDefaultAuthor
    ? AUTHOR.bio
    : `${BUSINESS.name} writes practical Brisbane car selling guides based on quoting, pickup, paperwork, and vehicle removal questions from local sellers.`;
  const authorAffiliation =
    authorName === BUSINESS.name ? authorRole : `${authorRole}, ${BUSINESS.name}`;

  const authorInitials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <PageShell
        breadcrumbs={breadcrumbs}
        eyebrow={post.category}
        title={post.title}
        subtitle={
          <p className="max-w-[60ch]">{post.excerpt}</p>
        }
      >
        <div className="site-container py-14 sm:py-20 lg:py-24">
          <article className="mx-auto max-w-3xl">
            <header className="mb-12 pb-8 border-b border-border/60">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <Link
                  href={authorHref}
                  className="inline-flex items-center gap-2.5 text-foreground hover:text-primary transition-colors"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xs font-semibold"
                  >
                    {authorInitials}
                  </span>
                  <span className="font-medium">{authorName}</span>
                </Link>
                <span aria-hidden className="text-muted-foreground/50">·</span>
                <div className="inline-flex items-center gap-1.5">
                  <time dateTime={post.date} className="tabular-nums">
                    {formatDate(post.date)}
                  </time>
                  {showUpdated && (
                    <span className="text-muted-foreground/80">
                      (updated{" "}
                      <time dateTime={post.updatedAt} className="tabular-nums">
                        {formatDate(post.updatedAt)}
                      </time>
                      )
                    </span>
                  )}
                </div>
                <span aria-hidden className="text-muted-foreground/50">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {post.readTime}
                </span>
                <Link
                  href={`/blog/category/${categorySlug(post.category)}`}
                  className="ml-auto inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-ink hover:bg-accent/15 transition-colors"
                >
                  {post.category}
                </Link>
              </div>
            </header>

            <figure className="mb-12 overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="h-auto w-full object-cover"
              />
            </figure>

            <div className="prose-body max-w-[65ch] mx-auto break-words [overflow-wrap:anywhere]">
              {renderBlogContent(post.content, { firstParagraphDropCap: true })}
            </div>

            {post.sources && post.sources.length > 0 && (
              <aside className="mt-12 rounded-xl border border-border/60 bg-muted/50 p-5 sm:p-6">
                <p className="eyebrow mb-3">Sources and review</p>
                {post.reviewedAt && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    Regulatory information reviewed{" "}
                    <time dateTime={post.reviewedAt}>{formatDate(post.reviewedAt)}</time>.
                  </p>
                )}
                <ul className="space-y-2 text-sm">
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <aside className="mt-16 rounded-2xl border border-border/60 bg-secondary/60 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                <div className="flex-1 min-w-0">
                  <p className="eyebrow mb-3">Selling your car?</p>
                  <p
                    className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-[1.1] text-balance"
                    style={{ letterSpacing: "var(--tracking-tight)" }}
                  >
                    Get a real offer in under 60 seconds.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md leading-relaxed">
                    Same- or next-day pickup across Brisbane. Cars assessed as-is. Free towing. Payment confirmed at pickup.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <Link
                    href="/#price-estimator"
                    className={cn(buttonVariants({ variant: "primary" }), "w-full md:w-auto")}
                  >
                    Get my quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a
                    href={BUSINESS.phoneTel}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full md:w-auto")}
                    aria-label={`Call ${BUSINESS.phoneDisplay}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {BUSINESS.phoneDisplay}
                  </a>
                </div>
              </div>
            </aside>

            {(post.relatedServices.length > 0 || post.relatedSuburbs.length > 0) && (
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {post.relatedServices.length > 0 && (
                  <div className="rounded-xl border border-border/60 bg-card p-6">
                    <p className="eyebrow mb-4">Related services</p>
                    <ul className="space-y-1">
                      {post.relatedServices.map((slug) => {
                        const svc = services.find((s) => s.slug === slug);
                        if (!svc) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/${slug}`}
                              className="group flex items-center justify-between gap-3 py-2 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              <span>{svc.h1}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {post.relatedSuburbs.length > 0 && (
                  <div className="rounded-xl border border-border/60 bg-card p-6">
                    <p className="eyebrow mb-4">Areas we service</p>
                    <ul className="space-y-1">
                      {post.relatedSuburbs.map((slug) => {
                        const sub = suburbs.find((s) => s.slug === slug);
                        if (!sub) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/locations/${slug}`}
                              className="group flex items-center justify-between gap-3 py-2 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              <span>{sub.h1}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <footer className="mt-16 space-y-10">
              <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
                <div className="flex items-start gap-5 sm:gap-6">
                  <div
                    aria-hidden
                    className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-lg sm:text-xl font-semibold"
                  >
                    {authorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow mb-2">About this guide</p>
                    <p className="font-display text-lg font-semibold text-foreground">
                      <Link href={authorHref} className="hover:text-primary transition-colors">
                        {authorName}
                      </Link>
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        &middot; {authorAffiliation}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      {authorBio}
                    </p>
                    {isDefaultAuthor && (
                      <Link
                        href={AUTHOR.href}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
                      >
                        About {AUTHOR.name}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="eyebrow mb-4">Share this article</p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={xShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on X"
                  >
                    <TwitterIcon className="h-3.5 w-3.5" aria-hidden />
                    X
                  </a>
                  <a
                    href={fbShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <FacebookIcon className="h-3.5 w-3.5" aria-hidden />
                    Facebook
                  </a>
                  <a
                    href={liShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" aria-hidden />
                    LinkedIn
                  </a>
                  <CopyLinkButton url={canonical} />
                </div>
              </div>

              <div className="rounded-2xl bg-primary text-primary-foreground px-6 py-10 sm:px-10 sm:py-14 text-center">
                <p
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.1] max-w-xl mx-auto text-balance"
                  style={{ letterSpacing: "var(--tracking-tight)" }}
                >
                  Ready to sell your car for cash?
                </p>
                <p className="text-primary-foreground/80 text-sm sm:text-base mt-4 mb-8 max-w-xl mx-auto leading-relaxed">
                  Call {BUSINESS.phoneDisplay} or grab a free instant quote &mdash; same- or
                  next-day pickup across Brisbane.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <TrackedPhoneLink
                    href={BUSINESS.phoneTel}
                    location="blog_post_footer"
                    className={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
                    ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {BUSINESS.phoneDisplay}
                  </TrackedPhoneLink>
                  <Link
                    href="/#price-estimator"
                    className={cn(buttonVariants({ variant: "inkOutline" }), "w-full sm:w-auto")}
                  >
                    Get a free quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </footer>
          </article>

          {relatedPosts.length > 0 && (
            <section className="mt-20 sm:mt-24">
              <div className="flex items-baseline justify-between mb-6 sm:mb-8">
                <p className="eyebrow">Keep reading</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {relatedPosts.length} related
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <BlogPostCard post={related} variant="compact" showDate={false} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
              Back to all posts
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
