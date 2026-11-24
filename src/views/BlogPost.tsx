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
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { SectionHeading, SidebarLinks } from "@/components/templates/PagePieces";
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

  const authorInitials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const shareLinkClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-md border border-input bg-card text-primary transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const hasRelatedLinks = relatedServiceData.length > 0 || relatedSuburbData.length > 0;

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
        <div className="site-container py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-12">
            <article className="min-w-0 lg:col-span-8">
              <header className="mb-9 border-b border-border pb-5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[0.9375rem] text-muted-foreground">
                  <Link
                    href={authorHref}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-[0.9375rem] font-semibold text-primary-foreground"
                    >
                      {authorInitials}
                    </span>
                    <span className="font-semibold">{authorName}</span>
                  </Link>
                  <span aria-hidden className="hidden text-foreground/30 sm:inline">·</span>
                  <div className="inline-flex flex-wrap items-center gap-x-1.5">
                    <time dateTime={post.date} className="tabular-nums">
                      {formatDate(post.date)}
                    </time>
                    {showUpdated && (
                      <span>
                        (updated{" "}
                        <time dateTime={post.updatedAt} className="tabular-nums">
                          {formatDate(post.updatedAt)}
                        </time>
                        )
                      </span>
                    )}
                  </div>
                  <span aria-hidden className="hidden text-foreground/30 sm:inline">·</span>
                  <span>
                    {post.readTime}
                  </span>
                  <Link
                    href={`/blog/category/${categorySlug(post.category)}`}
                    className="inline-flex min-h-11 items-center rounded-sm font-medium text-accent-ink underline decoration-accent-ink/40 decoration-1 underline-offset-4 hover:decoration-accent-ink sm:ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {post.category}
                  </Link>
                </div>
              </header>

              <div className="prose-body max-w-[66ch] break-words [overflow-wrap:anywhere]">
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
                  className="mt-14"
                >
                  <SectionHeading id="blog-post-faq-heading">
                    Frequently asked questions
                  </SectionHeading>
                  <Accordion items={renderableFaqs} />
                </section>
              )}

              {post.sources && post.sources.length > 0 && (
                <aside className="mt-14 border-t-2 border-primary pt-5">
                  <p className="text-lg font-bold text-foreground">
                    Sources and review
                  </p>
                  {post.reviewedAt && (
                    <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                      Regulatory information reviewed{" "}
                      <time dateTime={post.reviewedAt}>{formatDate(post.reviewedAt)}</time>.
                    </p>
                  )}
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.9375rem] marker:text-accent">
                    {post.sources.map((source) => (
                      <li key={source.url} className="pl-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-8 items-center font-medium text-accent-ink underline decoration-accent-ink/40 decoration-1 underline-offset-4 hover:decoration-accent-ink"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              <footer className="mt-14 space-y-9">
                <div className="flex items-start gap-4 border-t border-foreground/25 pt-5">
                  <div
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-lg font-semibold text-primary-foreground"
                  >
                    {authorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold leading-tight text-foreground">
                      <Link href={authorHref} className="underline-offset-4 hover:text-primary hover:underline">
                        {authorName}
                      </Link>
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        &middot; {authorAffiliation}
                      </span>
                    </p>
                    <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {authorBio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-[0.9375rem] font-semibold text-foreground">
                    Share
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={xShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareLinkClass}
                      aria-label="Share on X"
                    >
                      <TwitterIcon className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={fbShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareLinkClass}
                      aria-label="Share on Facebook"
                    >
                      <FacebookIcon className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={liShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareLinkClass}
                      aria-label="Share on LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" aria-hidden />
                    </a>
                    <CopyLinkButton url={canonical} />
                  </div>
                </div>

                <div className="on-green rounded-xl bg-primary px-6 py-8 text-primary-foreground sm:px-9 sm:py-10">
                  <p className="max-w-xl font-display text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.02em] text-balance sm:text-[2rem]">
                    Ready to sell your car for cash?
                  </p>
                  <p className="mb-6 mt-3 max-w-xl text-base leading-relaxed text-on-dark sm:text-[1.0625rem]">
                    One form. A written offer. Pickup included when we buy.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/#quote-form"
                      className={cn(buttonVariants({ variant: "default" }), "w-full ring-offset-ink sm:w-auto")}
                    >
                      Get my quote
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <TrackedPhoneLink
                      href={BUSINESS.phoneTel}
                      location="blog_post_footer"
                      className={cn(buttonVariants({ variant: "outlineOnDark" }), "w-full sm:w-auto")}
                      ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      Call {BUSINESS.phoneDisplay}
                    </TrackedPhoneLink>
                  </div>
                </div>
              </footer>
            </article>

            {hasRelatedLinks && (
              <div className="lg:col-span-4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:grid-cols-1">
                  {relatedServiceData.length > 0 && (
                    <SidebarLinks
                      label="Related services"
                      items={relatedServiceData.map((service) => ({
                        href: `/${service.slug}`,
                        label: service.h1,
                      }))}
                    />
                  )}
                  {relatedSuburbData.length > 0 && (
                    <SidebarLinks
                      label="Areas we service"
                      items={relatedSuburbData.map((suburb) => ({
                        href: `/locations/${suburb.slug}`,
                        label: suburb.h1,
                      }))}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-16 sm:mt-20">
              <div className="mb-6 flex items-baseline justify-between sm:mb-8">
                <p className="font-display text-[1.5rem] font-semibold leading-tight text-primary sm:text-[1.75rem]">
                  Keep reading
                </p>
                <p className="text-sm text-muted-foreground">
                  {relatedPosts.length} related
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <BlogPostCard post={related} variant="compact" showDate={false} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10">
            <Link href="/blog" className="link-arrow link-back text-base">
              <ArrowLeft aria-hidden />
              Back to all posts
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
