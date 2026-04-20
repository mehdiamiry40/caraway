import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ReadingProgress } from "@/components/ReadingProgress";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { categorySlug } from "@/data/blog-posts";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { renderBlogContent } from "@/lib/blog-markdown";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Link2,
  Linkedin,
  Phone,
  Twitter,
} from "lucide-react";
import { BUSINESS, SITE_URL } from "@/lib/site";

const AUTHOR = {
  name: "Sam Williams",
  role: "Senior Buyer",
  href: "/author/sam-williams",
  bio: `Sam appraises Brisbane vehicles every day and writes about fair pricing, paperwork, and getting paid fast.`,
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

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const shareText = post.title;
  const relatedPosts = getSmartRelatedPosts(post.slug, 3);
  const showUpdated =
    post.updatedAt &&
    post.updatedAt !== post.date &&
    new Date(post.updatedAt).toDateString() !== new Date(post.date).toDateString();

  const xShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonical)}`;
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`;
  const liShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;

  const copyBtnId = `copy-link-${post.slug}`;
  const copyScript = `(function(){var b=document.getElementById(${JSON.stringify(copyBtnId)});if(!b)return;var l=b.querySelector('[data-copy-label]');var o=l?l.textContent:'';b.addEventListener('click',function(e){e.preventDefault();try{navigator.clipboard.writeText(${JSON.stringify(canonical)});if(l){l.textContent='Copied!';setTimeout(function(){l.textContent=o;},1800);}}catch(err){}});})();`;

  const authorInitials = AUTHOR.name
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
            <header className="mb-12 pb-8 border-b border-foreground">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 sm:gap-6 font-mono text-xs uppercase tracking-wider">
                <div>
                  <p className="text-muted-foreground mb-1.5">Written by</p>
                  <Link
                    href={AUTHOR.href}
                    className="text-foreground font-bold hover:text-accent transition-colors"
                  >
                    {AUTHOR.name}
                  </Link>
                  <p className="text-muted-foreground mt-1 normal-case tracking-normal text-[0.7rem]">
                    {AUTHOR.role}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1.5">Published</p>
                  <time dateTime={post.date} className="text-foreground font-bold tabular-nums">
                    {formatDate(post.date)}
                  </time>
                  {showUpdated && (
                    <p className="text-muted-foreground mt-1 normal-case tracking-normal text-[0.7rem]">
                      Updated{" "}
                      <time dateTime={post.updatedAt} className="tabular-nums">
                        {formatDate(post.updatedAt)}
                      </time>
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1.5">Read time</p>
                  <p className="text-foreground font-bold">{post.readTime}</p>
                  <Link
                    href={`/blog/category/${categorySlug(post.category)}`}
                    className="mt-1 inline-block text-muted-foreground hover:text-accent normal-case tracking-normal text-[0.7rem] transition-colors"
                  >
                    in {post.category} →
                  </Link>
                </div>
              </div>
            </header>

            <div className="prose-body max-w-[65ch] mx-auto break-words [overflow-wrap:anywhere]">
              {renderBlogContent(post.content, { firstParagraphDropCap: true })}
            </div>

            <aside className="mt-16 border-y-2 border-foreground py-8 sm:py-10">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                <div className="flex-1 min-w-0">
                  <p className="eyebrow mb-3">Selling your car?</p>
                  <p
                    className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-[1.1] text-balance"
                    style={{ letterSpacing: "var(--tracking-tight)" }}
                  >
                    Get a real offer in under 60 seconds.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md leading-relaxed">
                    Same- or next-day pickup across Brisbane. No RWC. Free towing. Cash on the spot.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <Link
                    href="/#price-estimator"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                  >
                    Get my quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-foreground bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                    aria-label={`Call ${BUSINESS.phoneFriendly}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {BUSINESS.phoneFriendly}
                  </a>
                </div>
              </div>
            </aside>

            {(post.relatedServices.length > 0 || post.relatedSuburbs.length > 0) && (
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                {post.relatedServices.length > 0 && (
                  <div>
                    <p className="eyebrow mb-4">Related services</p>
                    <ul className="divide-y divide-border border-t border-border">
                      {post.relatedServices.map((slug) => {
                        const svc = services.find((s) => s.slug === slug);
                        if (!svc) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/${slug}`}
                              className="group flex items-center justify-between gap-3 py-3 text-sm text-foreground hover:text-accent transition-colors"
                            >
                              <span>{svc.h1}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
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
                  <div>
                    <p className="eyebrow mb-4">Areas we service</p>
                    <ul className="divide-y divide-border border-t border-border">
                      {post.relatedSuburbs.map((slug) => {
                        const sub = suburbs.find((s) => s.slug === slug);
                        if (!sub) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/locations/${slug}`}
                              className="group flex items-center justify-between gap-3 py-3 text-sm text-foreground hover:text-accent transition-colors"
                            >
                              <span>{sub.h1}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
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

            <footer className="mt-16 pt-10 border-t border-foreground space-y-12">
              <div className="border-t border-b border-border py-8">
                <div className="flex items-start gap-5 sm:gap-6">
                  <div
                    aria-hidden
                    className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-lg sm:text-xl font-bold"
                  >
                    {authorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow mb-2">About the author</p>
                    <p className="font-display text-lg font-bold text-foreground">
                      <Link href={AUTHOR.href} className="hover:text-accent transition-colors">
                        {AUTHOR.name}
                      </Link>
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        &middot; {AUTHOR.role}, {BUSINESS.name}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      {AUTHOR.bio}
                    </p>
                    <Link
                      href={AUTHOR.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent hover:text-foreground transition-colors"
                    >
                      More articles by {AUTHOR.name.split(" ")[0]}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
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
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                    aria-label="Share on X"
                  >
                    <Twitter className="h-3.5 w-3.5" aria-hidden />
                    X
                  </a>
                  <a
                    href={fbShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-3.5 w-3.5" aria-hidden />
                    Facebook
                  </a>
                  <a
                    href={liShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-3.5 w-3.5" aria-hidden />
                    LinkedIn
                  </a>
                  <button
                    type="button"
                    id={copyBtnId}
                    data-canonical={canonical}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors cursor-pointer"
                    aria-label="Copy link to article"
                  >
                    <Link2 className="h-3.5 w-3.5" aria-hidden />
                    <span data-copy-label>Copy link</span>
                  </button>
                </div>
                <script dangerouslySetInnerHTML={{ __html: copyScript }} />
              </div>

              <div className="bg-primary text-primary-foreground px-6 py-10 sm:px-10 sm:py-14 text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-primary-foreground/70 mb-4">
                  Ready when you are
                </p>
                <p
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] max-w-xl mx-auto text-balance"
                  style={{ letterSpacing: "var(--tracking-tight)" }}
                >
                  Ready to sell your car for cash?
                </p>
                <p className="text-primary-foreground/80 text-sm sm:text-base mt-4 mb-8 max-w-xl mx-auto leading-relaxed">
                  Call {BUSINESS.phoneFriendly} or grab a free instant quote &mdash; same- or
                  next-day pickup across Brisbane.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors w-full sm:w-auto"
                    aria-label={`Call ${BUSINESS.phoneFriendly}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {BUSINESS.phoneFriendly}
                  </a>
                  <Link
                    href="/#price-estimator"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-primary-foreground/70 px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors w-full sm:w-auto"
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
              <div className="flex items-baseline justify-between mb-8 border-t-2 border-foreground pt-6">
                <p className="eyebrow">Keep reading</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums">
                  {String(relatedPosts.length).padStart(2, "0")} related
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 border-t border-border">
                {relatedPosts.map((related, idx) => (
                  <li
                    key={related.slug}
                    className="border-b border-border md:border-b-0 md:border-r md:last:border-r-0 md:pr-6 md:-mr-6 md:last:pr-0 md:last:mr-0"
                  >
                    <Link
                      href={`/blog/${related.slug}`}
                      className="group block py-6 md:py-8 h-full"
                    >
                      <span className="font-mono text-xs font-bold uppercase tabular-nums text-accent">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                        {related.category} &middot; {related.readTime}
                      </p>
                      <h3
                        className="mt-3 font-display text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-accent transition-colors text-balance"
                        style={{ letterSpacing: "var(--tracking-tight)" }}
                      >
                        {related.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent">
                        Read article
                        <ArrowRight
                          className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-14 pt-6 border-t border-border">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
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
