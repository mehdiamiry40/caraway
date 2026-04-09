import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import type { BlogPost as BlogPostType } from "@/data/blog-posts";
import { getRelatedPosts } from "@/data/blog-posts";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
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

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mt-6 mb-5">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-[1.1] max-w-4xl break-words">
              {post.title}
            </h1>
          </div>
        </section>

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
          <div className="mt-16 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.05] via-primary/[0.02] to-accent/[0.03] p-5 sm:p-8 md:p-12 text-center">
            <p className="font-display font-bold text-xl sm:text-2xl text-primary mb-3">
              Ready to sell your car for cash?
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
              Get a free quote today -- same-day pickup across Brisbane.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 transition-all"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </a>
              <Link
                href="/#quote-section"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-3.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
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
            <div className="mt-16 border-t border-border/40 pt-12">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-8">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-2xl border border-border/60 bg-white p-4 sm:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold rounded-full bg-accent/10 px-2.5 py-1">{related.category}</span>
                    <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors mt-3 leading-snug line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Read article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
      </main>

      <Footer />
    </div>
  );
}
