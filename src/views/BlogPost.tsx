import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { getRelatedPosts } from "@/data/blog-posts";
import { ArrowLeft, ArrowRight, Clock, Tag, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";

export default function BlogPost({ post }: { post: BlogPostType }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-primary text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} light />
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mt-5 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 font-medium text-white/90 text-xs">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="max-w-none">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-foreground/85 leading-relaxed mb-6 text-base sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-2xl border border-primary/10 bg-gradient-to-b from-primary/[0.04] to-transparent p-7 sm:p-10 text-center">
            <p className="font-display font-bold text-xl sm:text-2xl text-primary mb-3">
              Ready to sell your car for cash?
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Get a free quote today — same-day pickup across Brisbane.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </a>
              <Link
                href="/#quote-section"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {(() => {
            const relatedPosts = getRelatedPosts(post.slug);
            if (relatedPosts.length === 0) return null;
            return (
            <div className="mt-14 border-t border-border pt-10">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-2xl border border-border/60 p-6 hover:border-primary/20 hover:shadow-md transition-all"
                  >
                    <span className="text-xs text-accent font-medium">{related.category}</span>
                    <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors mt-1.5 leading-snug line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            );
          })()}

          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all posts
            </Link>
          </div>
        </article>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
