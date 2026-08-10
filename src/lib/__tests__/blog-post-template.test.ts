import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import {
  blogPostCanonicalUrl,
  buildBlogPostMetadata,
  buildBlogPostSeoProps,
  createBlogPost,
  plainBlogPostContent,
  validateBlogPostSeo,
} from "@/lib/blog-post-template";
import { RETIRED_BLOG_SLUGS } from "@/lib/blog-consolidation";
import { BLOG_FAQ_ROLLOUT_DATE } from "@/lib/blog-faqs";
import { SITE_URL } from "@/lib/site";

describe("blog post template", () => {
  it("defaults new posts to self-canonical, indexable metadata", () => {
    const post = createBlogPost({
      slug: "example-seo-safe-post",
      title: "Example SEO Safe Blog Post Title",
      metaDescription:
        "This is a realistic meta description for a new Caraway blog post that should be indexable and self canonical by default.",
      excerpt:
        "This is a realistic excerpt for a new Caraway blog post that gives readers enough context before they click through.",
      content: ["Opening paragraph for the post.", "## Section heading"],
      date: "2026-04-24",
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    const metadata = buildBlogPostMetadata(post);

    expect(post.canonicalUrl).toBe(`${SITE_URL}/blog/example-seo-safe-post`);
    expect(metadata.alternates?.canonical).toBe(post.canonicalUrl);
    expect(metadata.robots).toBeUndefined();
  });

  it("keeps every real post inside the shared SEO contract", () => {
    expect(blogPosts.length).toBeGreaterThan(0);

    const failures = blogPosts
      .map((post) => ({
        slug: post.slug,
        errors: validateBlogPostSeo(post),
      }))
      .filter(({ errors }) => errors.length > 0);

    expect(failures).toEqual([]);
  });

  it("rejects retired blog slugs that now redirect elsewhere", () => {
    const post = createBlogPost({
      slug: RETIRED_BLOG_SLUGS[0],
      title: "Cash for Cars Gold Coast Redirected Topic",
      metaDescription:
        "This realistic metadata would otherwise be valid, but the slug is retired because it now consolidates into a live canonical page.",
      excerpt:
        "This realistic excerpt would otherwise be long enough, but the retired slug should prevent the post from being republished.",
      content: ["Opening paragraph for the post.", "## Section heading"],
      date: "2026-06-19",
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    expect(validateBlogPostSeo(post)).toContain(
      "slug is retired and must stay redirected, not republished",
    );
  });

  it("keeps materialized posts sorted from newest to oldest", () => {
    const timestamps = blogPosts.map((post) => Date.parse(post.updatedAt || post.date));
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });

  it("emits matching canonical URLs across metadata and BlogPosting schema", () => {
    for (const post of blogPosts) {
      const metadata = buildBlogPostMetadata(post);
      const { articleSchema, breadcrumbItems } = buildBlogPostSeoProps(post);

      expect(post.canonicalUrl).toBe(blogPostCanonicalUrl(post.slug));
      expect(metadata.alternates?.canonical).toBe(post.canonicalUrl);
      expect(metadata.openGraph?.url).toBe(post.canonicalUrl);
      expect(articleSchema.url).toBe(post.canonicalUrl);
      expect(articleSchema.mainEntityOfPage).toBe(post.canonicalUrl);
      expect(articleSchema.publisher["@id"]).toBe(
        `${SITE_URL}/#organization`,
      );
      expect(breadcrumbItems.at(-1)?.item).toBe(post.canonicalUrl);
    }
  });

  it("does not emit noindex metadata for any live blog post", () => {
    for (const post of blogPosts) {
      const metadata = buildBlogPostMetadata(post);
      expect(metadata.robots).toBeUndefined();
    }
  });

  it("adds citations to reviewed regulatory article schema", () => {
    const post = createBlogPost({
      slug: "reviewed-car-selling-guide",
      title: "Reviewed Queensland Car Selling Guide",
      metaDescription:
        "A reviewed Queensland car selling guide with official primary sources and clear regulatory information for local vehicle sellers.",
      excerpt:
        "This reviewed guide explains a Queensland vehicle-selling process and links readers to the official source used for regulatory checks.",
      content: ["First useful paragraph.", "Second useful paragraph."],
      date: "2026-06-01",
      updatedAt: "2026-06-08",
      reviewedAt: "2026-06-08",
      sources: [
        {
          title: "Queensland Government",
          url: "https://www.qld.gov.au/transport/registration/transfer",
        },
      ],
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    expect(validateBlogPostSeo(post)).toEqual([]);
    expect(buildBlogPostSeoProps(post).articleSchema.citation).toEqual([
      "https://www.qld.gov.au/transport/registration/transfer",
    ]);
  });

  it("counts visible supplemental FAQs in read time and BlogPosting wordCount", () => {
    const body = Array.from({ length: 190 }, () => "body").join(" ");
    const answer = Array.from({ length: 100 }, () => "answer").join(" ");
    const post = createBlogPost({
      slug: "supplemental-faq-counting-guide",
      title: "Supplemental FAQ Counting Guide",
      metaDescription:
        "This realistic metadata describes a supplemental FAQ counting guide and remains long enough for the shared blog metadata contract.",
      excerpt:
        "This realistic excerpt describes how supplemental questions contribute to visible blog copy and its calculated reading time.",
      content: [body, "Second body block."],
      faqs: [{ question: "Count this visible question?", answer }],
      date: "2026-08-10",
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    const { plainContent, wordCount } = buildBlogPostSeoProps(post);

    expect(post.readTime).toBe("2 min read");
    expect(plainContent).toContain("Frequently asked questions");
    expect(plainContent).toContain("Count this visible question?");
    expect(plainContent).toContain(answer);
    expect(wordCount).toBe(300);
  });

  it("does not double-count supplemental fields beside an authored FAQ section", () => {
    const post = createBlogPost({
      slug: "authored-faq-counting-guide",
      title: "Authored FAQ Counting Guide for Sellers",
      metaDescription:
        "This realistic metadata describes an authored FAQ counting guide and remains long enough for the shared blog metadata contract.",
      excerpt:
        "This realistic excerpt explains that authored FAQ answers take precedence over supplemental fields when a blog post is rendered.",
      content: [
        "Opening article body.",
        "## FAQ",
        "### Authored question?",
        "Authored answer.",
      ],
      faqs: [
        {
          question: "Suppressed duplicate question?",
          answer: "Suppressed duplicate answer.",
        },
      ],
      date: "2026-08-10",
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    const plainContent = plainBlogPostContent(post);

    expect(plainContent).toContain("Authored question?");
    expect(plainContent).not.toContain("Suppressed duplicate question?");
    expect(buildBlogPostSeoProps(post).wordCount).toBe(8);
    expect(post.readTime).toBe("1 min read");
  });

  it("keeps an earlier regulatory review date when the FAQ rollout changes dateModified", () => {
    const post = blogPosts.find((item) => item.slug === "sell-van-brisbane");

    expect(post).toBeDefined();
    expect(post?.updatedAt).toBe("2026-08-10");
    expect(post?.reviewedAt).toBe("2026-08-08");
    expect(validateBlogPostSeo(post!)).toEqual([]);
    expect(buildBlogPostSeoProps(post!).articleSchema.dateModified).toBe(
      "2026-08-10",
    );
  });

  it("rejects a stale review after a newer post-specific FAQ update", () => {
    const post = createBlogPost({
      slug: "newer-faq-review-guard",
      title: "Newer FAQ Regulatory Review Guard",
      metaDescription:
        "This realistic metadata verifies that a later post-specific FAQ update still requires regulatory material to be reviewed again.",
      excerpt:
        "This realistic excerpt verifies that the one-time FAQ visibility rollout does not weaken future regulatory review safeguards.",
      content: ["Opening article body.", "Second article body."],
      faqs: [{ question: "A regulated question?", answer: "A regulated answer." }],
      date: "2026-08-09",
      updatedAt: "2026-08-11",
      reviewedAt: "2026-08-10",
      sources: [
        {
          title: "Queensland Government",
          url: "https://www.qld.gov.au/transport",
        },
      ],
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    expect(validateBlogPostSeo(post)).toContain(
      "reviewedAt must not be earlier than updatedAt",
    );
  });

  it("does not let the FAQ rollout excuse a review that predates publication", () => {
    const post = createBlogPost({
      slug: "faq-publication-review-guard",
      title: "FAQ Publication Review Guard for Sellers",
      metaDescription:
        "This realistic metadata verifies that the FAQ rollout cannot excuse a regulatory review date that predates article publication.",
      excerpt:
        "This realistic excerpt verifies that published sourced guidance must have been reviewed no earlier than its publication date.",
      content: ["Opening article body.", "Second article body."],
      faqs: [{ question: "A regulated question?", answer: "A regulated answer." }],
      date: "2026-08-10",
      reviewedAt: "2026-08-09",
      sources: [
        {
          title: "Queensland Government",
          url: "https://www.qld.gov.au/transport",
        },
      ],
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    expect(post.updatedAt).toBe(BLOG_FAQ_ROLLOUT_DATE);
    expect(validateBlogPostSeo(post)).toContain(
      "reviewedAt must not be earlier than updatedAt",
    );
  });

  it("retains the stale-review guard for posts without supplemental FAQs", () => {
    const post = createBlogPost({
      slug: "standard-regulatory-review-guard",
      title: "Standard Regulatory Review Guard",
      metaDescription:
        "This realistic metadata verifies that ordinary article updates continue to require current review dates for sourced regulatory copy.",
      excerpt:
        "This realistic excerpt verifies that ordinary sourced article updates retain the existing regulatory review date safeguard.",
      content: ["Opening article body.", "Second article body."],
      date: "2026-08-08",
      updatedAt: "2026-08-10",
      reviewedAt: "2026-08-09",
      sources: [
        {
          title: "Queensland Government",
          url: "https://www.qld.gov.au/transport",
        },
      ],
      category: "Guides",
      relatedServices: [],
      relatedSuburbs: [],
    });

    expect(validateBlogPostSeo(post)).toContain(
      "reviewedAt must not be earlier than updatedAt",
    );
  });
});
