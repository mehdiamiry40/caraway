import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { blogPosts } from "@/data/blog-posts";
import { ArrowRight, Clock, Tag } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog" },
];

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              Blog
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              Tips, guides, and insights about selling your car for cash in Brisbane.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {blogPosts.map((post, idx) => (
              <article
                key={post.slug}
                className={`group rounded-2xl border border-border/60 bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200 overflow-hidden ${idx === 0 ? "md:col-span-2" : ""}`}
              >
                <div className={`p-4 sm:p-6 md:p-8 flex flex-col h-full ${idx === 0 ? "md:p-10" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-accent text-xs">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
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

                  <h2 className={`font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3 ${idx === 0 ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl"}`}>
                    <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-2 decoration-primary/30">
                      {post.title}
                    </Link>
                  </h2>

                  <p className={`text-muted-foreground leading-relaxed flex-1 ${idx === 0 ? "text-base max-w-3xl" : "text-sm"}`}>
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group-hover:gap-2.5"
                  >
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
