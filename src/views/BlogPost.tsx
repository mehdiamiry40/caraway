import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ReadingProgress } from "@/components/ReadingProgress";
import { InternalLinks } from "@/components/sections/InternalLinks";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { categorySlug } from "@/data/blog-posts";
import { getSmartRelatedPosts } from "@/lib/related-posts";
import { renderBlogContent } from "@/lib/blog-markdown";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Facebook,
  Link2,
  Linkedin,
  Phone,
  Tag,
  Twitter,
  User,
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

  return (
    <>
      <ReadingProgress />
      <PageShell
        breadcrumbs={breadcrumbs}
        title={post.title}
        subtitle={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
            <Link
              href={`/blog/category/${categorySlug(post.category)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1.5 font-medium text-white text-xs hover:bg-white/20 transition-colors"
            >
              <Tag className="h-3 w-3" aria-hidden />
              {post.category}
            </Link>
            <Link
              href={AUTHOR.href}
              className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
            >
              <User className="h-3.5 w-3.5" aria-hidden />
              By {AUTHOR.name}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readTime}
            </span>
            <time dateTime={post.date} className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {formatDate(post.date)}
            </time>
          </div>
        }
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <article className="contents">
            <header className="mb-10 pb-8 border-b border-border/50">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[65ch]">
                {post.excerpt}
              </p>
              {showUpdated && (
                <p className="mt-5 text-xs text-muted-foreground/80">
                  Last updated{" "}
                  <time dateTime={post.updatedAt} className="font-medium text-foreground/70">
                    {formatDate(post.updatedAt)}
                  </time>
                </p>
              )}
            </header>

            <div className="prose-body max-w-[65ch] mx-auto break-words [overflow-wrap:anywhere]">
              {renderBlogContent(post.content, { firstParagraphDropCap: true })}
            </div>

            <aside className="mt-14 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-accent/5 border border-primary/15 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1.5">
                    Selling your car?
                  </p>
                  <p className="font-display font-bold text-xl sm:text-2xl text-primary leading-tight">
                    Get a real offer in under 60 seconds.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    Same- or next-day pickup across Brisbane. No RWC. Free towing. Cash on the spot.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 shrink-0">
                  <Link
                    href="/#price-estimator"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                  >
                    Get my quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-all"
                    aria-label={`Call ${BUSINESS.phoneFriendly}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {BUSINESS.phoneFriendly}
                  </a>
                </div>
              </div>
            </aside>

            {(post.relatedServices.length > 0 || post.relatedSuburbs.length > 0) && (
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {post.relatedServices.length > 0 && (
                  <div className="rounded-xl border border-border/60 p-5 bg-white">
                    <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">
                      Related Services
                    </h3>
                    <ul className="space-y-1">
                      {post.relatedServices.map((slug) => {
                        const svc = services.find((s) => s.slug === slug);
                        if (!svc) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/${slug}`}
                              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors py-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                              {svc.h1}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {post.relatedSuburbs.length > 0 && (
                  <div className="rounded-xl border border-border/60 p-5 bg-white">
                    <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">
                      Areas We Service
                    </h3>
                    <ul className="space-y-1">
                      {post.relatedSuburbs.map((slug) => {
                        const sub = suburbs.find((s) => s.slug === slug);
                        if (!sub) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/locations/${slug}`}
                              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors py-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                              {sub.h1}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <footer className="mt-14 pt-10 border-t border-border/50 space-y-10">
              <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    aria-hidden
                    className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-bold text-xl sm:text-2xl"
                  >
                    SW
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Written by
                    </p>
                    <p className="font-display font-bold text-lg text-foreground mt-0.5">
                      <Link
                        href={AUTHOR.href}
                        className="hover:text-primary transition-colors"
                      >
                        {AUTHOR.name}
                      </Link>
                    </p>
                    <p className="text-xs font-medium text-accent mb-2">
                      {AUTHOR.role} &middot; {BUSINESS.name}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {AUTHOR.bio}
                    </p>
                    <Link
                      href={AUTHOR.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors"
                    >
                      More articles by {AUTHOR.name.split(" ")[0]}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  Share this article
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={xShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on X"
                  >
                    <Twitter className="h-3.5 w-3.5" aria-hidden />
                    X
                  </a>
                  <a
                    href={fbShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-3.5 w-3.5" aria-hidden />
                    Facebook
                  </a>
                  <a
                    href={liShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-3.5 w-3.5" aria-hidden />
                    LinkedIn
                  </a>
                  <button
                    type="button"
                    id={copyBtnId}
                    data-canonical={canonical}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                    aria-label="Copy link to article"
                  >
                    <Link2 className="h-3.5 w-3.5" aria-hidden />
                    <span data-copy-label>Copy link</span>
                  </button>
                </div>
                <script dangerouslySetInnerHTML={{ __html: copyScript }} />
              </div>

              <div className="rounded-2xl bg-primary text-white p-6 sm:p-10 text-center">
                <p className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-3">
                  Ready to sell your car for cash?
                </p>
                <p className="text-white/80 text-sm sm:text-base mb-7 max-w-xl mx-auto">
                  Call {BUSINESS.phoneFriendly} or grab a free instant quote &mdash; same- or
                  next-day pickup across Brisbane.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary hover:bg-white/90 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
                    aria-label={`Call ${BUSINESS.phoneFriendly}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {BUSINESS.phoneFriendly}
                  </a>
                  <Link
                    href="/#price-estimator"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white hover:text-primary transition-all w-full sm:w-auto"
                  >
                    Get a free quote
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </footer>
          </article>

          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-border/40 pt-12">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-8">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-lg border border-border/60 bg-white p-4 sm:p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold rounded-full bg-accent/10 px-2.5 py-1">
                      {related.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors mt-3 leading-snug line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors">
                      Read article <ArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 pt-6 border-t border-border/30">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              Back to all posts
            </Link>
          </div>
        </div>

        <InternalLinks post={post} />
      </PageShell>
    </>
  );
}
