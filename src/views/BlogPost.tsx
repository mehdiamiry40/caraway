import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { getRelatedPosts } from "@/data/blog-posts";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { ArrowLeft, ArrowRight, Clock, Phone, Tag } from "lucide-react";
import { BUSINESS } from "@/lib/site";

export default function BlogPost({ post }: { post: BlogPostType }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title={post.title}
      subtitle={
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1.5 font-medium text-white/90 text-xs">
            <Tag className="h-3 w-3" />
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
      }
    >
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-none break-words [overflow-wrap:anywhere]">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className={`text-foreground/85 leading-[1.8] mb-7 ${i === 0 ? "text-lg sm:text-xl text-foreground/90 font-medium" : "text-base sm:text-lg"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-border/60 bg-muted p-5 sm:p-8 md:p-12 text-center">
          <p className="font-display font-bold text-xl sm:text-2xl text-primary mb-3">
            Ready to sell your car for cash?
          </p>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
            Call {BUSINESS.phoneFriendly} or get a free instant quote — same-day pickup available across Brisbane.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
              aria-label={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call {BUSINESS.phoneFriendly}
            </a>
            <Link
              href="/#price-estimator"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-primary px-7 py-3.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all"
            >
              Get a free quote
            </Link>
          </div>
        </div>

        {/* Internal links to services and suburbs */}
        {(post.relatedServices.length > 0 || post.relatedSuburbs.length > 0) && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {post.relatedServices.length > 0 && (
              <div className="rounded-xl border border-border/60 p-5 bg-white">
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">Related Services</h3>
                <ul className="space-y-1">
                  {post.relatedServices.map(slug => {
                    const svc = services.find(s => s.slug === slug);
                    if (!svc) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors py-1.5">
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
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">Areas We Service</h3>
                <ul className="space-y-1">
                  {post.relatedSuburbs.map(slug => {
                    const sub = suburbs.find(s => s.slug === slug);
                    if (!sub) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/locations/${slug}`} className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors py-1.5">
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

        {/* Related posts */}
        {(() => {
          const relatedPosts = getRelatedPosts(post.slug);
          if (relatedPosts.length === 0) return null;
          return (
          <div className="mt-16 border-t border-border/40 pt-12">
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
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold rounded-full bg-accent/10 px-2.5 py-1">{related.category}</span>
                  <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors mt-3 leading-snug line-clamp-2">
                    {related.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors">
                    Read article <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          );
        })()}

        <div className="mt-12 pt-6 border-t border-border/30">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to all posts
          </Link>
        </div>
      </article>

      <InternalLinks />
    </PageShell>
  );
}
