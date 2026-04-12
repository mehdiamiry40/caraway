import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { indexableBlogPosts } from "@/data/blog-posts";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL, BUSINESS } from "@/lib/site";
import { ArrowRight, Clock, Tag } from "lucide-react";

const AUTHOR = {
  name: "Sam Williams",
  jobTitle: "Senior Buyer",
  slug: "sam-williams",
  bio: `Sam Williams is a Senior Buyer at ${BUSINESS.name} in Brisbane. With years of experience in vehicle appraisal and the Queensland automotive market, Sam helps Brisbane residents get fair cash offers for their cars — regardless of make, model, or condition.`,
};

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: AUTHOR.name },
];

export const metadata: Metadata = {
  title: `${AUTHOR.name} — ${AUTHOR.jobTitle} at ${BUSINESS.name}`,
  description: `Articles by ${AUTHOR.name}, ${AUTHOR.jobTitle} at ${BUSINESS.name}. Expert insights on selling your car for cash in Brisbane, vehicle valuations, and the Queensland automotive market.`,
  alternates: { canonical: `/author/${AUTHOR.slug}` },
  openGraph: {
    type: "profile",
    url: `/author/${AUTHOR.slug}`,
    title: `${AUTHOR.name} — ${AUTHOR.jobTitle} at ${BUSINESS.name}`,
    description: `Articles by ${AUTHOR.name}, ${AUTHOR.jobTitle} at ${BUSINESS.name}. Expert insights on selling your car for cash in Brisbane.`,
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: `${BUSINESS.name} cash for cars Brisbane`,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function AuthorPage() {
  const canonical = `${SITE_URL}/author/${AUTHOR.slug}`;
  const posts = indexableBlogPosts;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema(breadcrumbs, canonical),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: AUTHOR.name,
            url: canonical,
            mainEntity: {
              "@type": "Person",
              name: AUTHOR.name,
              jobTitle: AUTHOR.jobTitle,
              worksFor: {
                "@type": "Organization",
                name: BUSINESS.name,
                url: SITE_URL,
              },
              description: AUTHOR.bio,
            },
          },
        ]}
      />
      <PageShell
        breadcrumbs={breadcrumbs}
        title={AUTHOR.name}
        subtitle={
          <p>
            {AUTHOR.jobTitle} at {BUSINESS.name} &mdash; {BUSINESS.location}
          </p>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-3xl mb-14">
            <h2 className="font-display font-bold text-2xl mb-4">About {AUTHOR.name}</h2>
            <p className="text-foreground/85 leading-relaxed text-base sm:text-lg">{AUTHOR.bio}</p>
          </div>

          <h2 className="font-display font-bold text-2xl mb-8">
            Articles by {AUTHOR.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-lg border border-border/60 bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
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

                  <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3 text-lg sm:text-xl">
                    <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-2 decoration-primary/30">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground leading-relaxed flex-1 text-sm">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] touch-manipulation"
                  >
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <InternalLinks />
      </PageShell>
    </>
  );
}
