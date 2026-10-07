import type { SVGProps } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ReadingProgress } from "@/components/ReadingProgress";
import { QuoteComparisonWorksheetLoader } from "@/components/blog/QuoteComparisonWorksheetLoader";
import { QldVehicleSaleRecordBuilderLoader } from "@/components/blog/QldVehicleSaleRecordBuilderLoader";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { categorySlug } from "@/data/blog-posts";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { renderBlogContent } from "@/lib/blog-markdown";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import {
  ArrowLeft,
  ArrowRight,
  BookCheck,
  BookOpen,
  CarFront,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircleQuestion,
  Phone,
  Share2,
} from "lucide-react";
import { IconHeading, SidebarLinks } from "@/components/templates/PagePieces";
import { blogIcon } from "@/lib/blog-icons";
import { serviceIcon } from "@/lib/service-icons";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CopyLinkButton } from "@/components/blog/CopyLinkButton";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { getRenderableBlogFaqs } from "@/lib/blog-faqs";
import { cn } from "@/lib/utils";
import { canonicalLocationSlug } from "@/lib/location-consolidation";
import { canonicalServiceSlug } from "@/lib/service-consolidation";

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
  const canonicalRelatedServiceSlugs = [
    ...new Set(post.relatedServices.map(canonicalServiceSlug)),
  ];
  const relatedServiceData = canonicalRelatedServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service) => service !== undefined);
  const canonicalRelatedSuburbSlugs = [
    ...new Set(
      post.relatedSuburbs
        .map(canonicalLocationSlug)
        .filter((slug): slug is string => slug !== null),
    ),
  ];
  const relatedSuburbData = canonicalRelatedSuburbSlugs
    .map((slug) => suburbs.find((suburb) => suburb.slug === slug))
    .filter((suburb) => suburb !== undefined);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  const canonical = post.canonicalUrl;
  const shareText = post.title;
  const relatedPosts = getSmartRelatedPosts(post.slug, 3);
  const renderableFaqs = getRenderableBlogFaqs(post);
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

  const postIcon = blogIcon(post.title);

  const authorInitials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <PageShell
        icon={postIcon}
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
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-primary text-primary-foreground font-display text-xs font-semibold"
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
                  className="ml-auto inline-flex items-center rounded-none bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-ink hover:bg-accent/15 transition-colors"
                >
                  {post.category}
                </Link>
              </div>
            </header>

            <div className="prose-body max-w-[65ch] mx-auto break-words [overflow-wrap:anywhere]">
              {renderBlogContent(post.content)}
            </div>

            {post.interactiveTool === "quote-comparison-worksheet" ? (
              <QuoteComparisonWorksheetLoader />
            ) : null}

            {post.interactiveTool === "qld-vehicle-sale-record-builder" ? (
              <QldVehicleSaleRecordBuilderLoader />
            ) : null}

            {renderableFaqs.length > 0 && (
              <section
                aria-labelledby="blog-post-faq-heading"
                className="mt-12 border-t border-border/60 pt-10"
              >
                <IconHeading id="blog-post-faq-heading" icon={MessageCircleQuestion} tone="solid" className="mb-2">
                  Frequently asked questions
                </IconHeading>
                <Accordion items={renderableFaqs} />
              </section>
            )}

            {post.sources && post.sources.length > 0 && (
              <aside className="mt-12 border border-border bg-muted/50 p-5 sm:p-6">
                <p className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                  <BookCheck className="h-5 w-5 text-accent-ink" aria-hidden="true" />
                  Sources and review
                </p>
                {post.reviewedAt && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    Regulatory information reviewed{" "}
                    <time dateTime={post.reviewedAt}>{formatDate(post.reviewedAt)}</time>.
                  </p>
                )}
                <ul className="space-y-2 text-sm">
                  {post.sources.map((source) => (
                    <li key={source.url} className="flex items-start gap-2">
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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

            {(relatedServiceData.length > 0 || relatedSuburbData.length > 0) && (
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedServiceData.length > 0 && (
                  <SidebarLinks
                    label="Related services"
                    items={relatedServiceData.map((service) => ({
                      href: `/${service.slug}`,
                      label: service.h1,
                      icon: serviceIcon(service.slug),
                    }))}
                  />
                )}
                {relatedSuburbData.length > 0 && (
                  <SidebarLinks
                    label="Areas we service"
                    items={relatedSuburbData.map((suburb) => ({
                      href: `/locations/${suburb.slug}`,
                      label: suburb.h1,
                      icon: MapPin,
                    }))}
                  />
                )}
              </div>
            )}

            <footer className="mt-16 space-y-10">
              <div className="flex items-start gap-4 border border-border bg-card p-5 sm:p-6">
                <div
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary font-display text-base font-semibold text-primary-foreground"
                >
                  {authorInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-foreground">
                    <Link href={authorHref} className="hover:text-primary transition-colors">
                      {authorName}
                    </Link>
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      &middot; {authorAffiliation}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {authorBio}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Share
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={xShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center border border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on X"
                  >
                    <TwitterIcon className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={fbShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center border border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={liShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center border border-border/80 bg-card text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" aria-hidden />
                  </a>
                  <CopyLinkButton url={canonical} />
                </div>
              </div>

              <div className="flex flex-col items-center bg-primary text-primary-foreground px-6 py-10 sm:px-10 sm:py-12 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center bg-cta text-cta-foreground">
                  <CarFront className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.1] max-w-xl mx-auto text-balance"
                  style={{ letterSpacing: "var(--tracking-tight)" }}
                >
                  Ready to sell your car for cash?
                </p>
                <p className="text-primary-foreground/80 text-sm sm:text-base mt-3 mb-7 max-w-xl mx-auto leading-relaxed">
                  One form. A written offer. Pickup included when we buy.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/#quote-form"
                    className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
                  >
                    Get my quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <TrackedPhoneLink
                    href={BUSINESS.phoneTel}
                    location="blog_post_footer"
                    className={cn(buttonVariants({ variant: "inkOutline" }), "w-full sm:w-auto")}
                    ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {BUSINESS.phoneDisplay}
                  </TrackedPhoneLink>
                </div>
              </div>
            </footer>
          </article>

          {relatedPosts.length > 0 && (
            <section className="mt-20 sm:mt-24">
              <div className="flex items-baseline justify-between mb-6 sm:mb-8">
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <BookOpen className="h-5 w-5 text-accent-ink" aria-hidden="true" />
                  Keep reading
                </p>
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
