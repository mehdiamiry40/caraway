import { describe, expect, it } from "vitest";
import {
  buildBlogPostJsonLd,
  generateMetadata,
} from "@/app/blog/[slug]/metadata";
import { blogPosts } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/site";

// Pick concrete fixtures from real data. Using slugs rather than array
// indices keeps these tests stable as posts are added or reordered.
const INDEXABLE_SLUG = "trade-in-vs-cash-for-cars-brisbane";
const NOINDEX_SLUG = "cash-for-cars-sunshine-coast";

const indexablePost = blogPosts.find((p) => p.slug === INDEXABLE_SLUG);
const noindexPost = blogPosts.find((p) => p.slug === NOINDEX_SLUG);

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe("generateMetadata (blog post route)", () => {
  describe("indexable post", () => {
    it("is a valid fixture (sanity check — the test data must exist and be indexable)", () => {
      expect(indexablePost).toBeDefined();
      expect(indexablePost?.isIndexable).toBe(true);
    });

    it("returns a title containing the post title", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      expect(typeof meta.title).toBe("string");
      expect(meta.title).toBe(indexablePost!.title);
      expect(String(meta.title)).toContain("Trade-In");
    });

    it("returns the post's metaDescription verbatim", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      expect(meta.description).toBe(indexablePost!.metaDescription);
    });

    it("returns an absolute canonical URL ending with /blog/<slug>", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      const canonical = meta.alternates?.canonical;
      expect(typeof canonical).toBe("string");
      expect(canonical).toBe(`${SITE_URL}/blog/${INDEXABLE_SLUG}`);
      expect(String(canonical).startsWith("https://")).toBe(true);
      expect(String(canonical).endsWith(`/blog/${INDEXABLE_SLUG}`)).toBe(true);
    });

    it("does not emit a noindex robots directive", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      // The current contract: indexable posts leave robots undefined so the
      // site-wide default (index, follow) wins. Either undefined or an
      // explicit index:true would satisfy "not noindex".
      if (meta.robots == null) {
        expect(meta.robots).toBeUndefined();
      } else if (typeof meta.robots === "object") {
        expect((meta.robots as { index?: boolean }).index).not.toBe(false);
      }
    });

    it("sets OpenGraph type=article with publishedTime from post.date", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      const og = meta.openGraph as
        | { type?: string; publishedTime?: string; url?: string; title?: string }
        | undefined;
      expect(og).toBeDefined();
      expect(og?.type).toBe("article");
      expect(og?.publishedTime).toBe(indexablePost!.date);
      expect(og?.url).toBe(`${SITE_URL}/blog/${INDEXABLE_SLUG}`);
      expect(og?.title).toBe(indexablePost!.title);
    });
  });

  describe("noindex post", () => {
    it("is a valid fixture (sanity check — the test data must exist and be noindex)", () => {
      // If no noindex posts exist in the data any more, this whole block
      // becomes meaningless — fail loudly instead of silently skipping.
      expect(noindexPost).toBeDefined();
      expect(noindexPost?.isIndexable).toBe(false);
    });

    it("returns robots.index=false (noindex) while keeping follow=true", async () => {
      const meta = await generateMetadata(makeParams(NOINDEX_SLUG));
      expect(meta.robots).toBeDefined();
      expect(typeof meta.robots).toBe("object");
      const robots = meta.robots as { index?: boolean; follow?: boolean };
      expect(robots.index).toBe(false);
      // Follow is deliberately kept true so link equity to indexable pages
      // still flows — lock that contract in.
      expect(robots.follow).toBe(true);
    });

    it("still emits a canonical URL (so if Google does crawl it, it at least self-canonicalises)", async () => {
      const meta = await generateMetadata(makeParams(NOINDEX_SLUG));
      expect(meta.alternates?.canonical).toBe(`${SITE_URL}/blog/${NOINDEX_SLUG}`);
    });
  });

  describe("non-existent slug", () => {
    it("returns 'Post not found' title with noindex,nofollow robots (no throw)", async () => {
      const meta = await generateMetadata(
        makeParams("definitely-not-a-real-post-slug-xyz"),
      );
      expect(meta.title).toBe("Post not found | Caraway");
      const robots = meta.robots as { index?: boolean; follow?: boolean };
      expect(robots).toBeDefined();
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(false);
      // The 404 metadata path intentionally omits description/canonical/og —
      // we are asserting that contract to catch accidental leakage.
      expect(meta.description).toBeUndefined();
      expect(meta.alternates).toBeUndefined();
      expect(meta.openGraph).toBeUndefined();
    });
  });

  describe("buildBlogPostJsonLd (BlogPosting schema)", () => {
    it("emits both BreadcrumbList and BlogPosting entries", () => {
      const schemas = buildBlogPostJsonLd(indexablePost!);
      expect(Array.isArray(schemas)).toBe(true);
      expect(schemas).toHaveLength(2);
      const types = schemas.map((s) => (s as { "@type": string })["@type"]);
      expect(types).toContain("BreadcrumbList");
      expect(types).toContain("BlogPosting");
    });

    it("populates BlogPosting with headline, dates, canonical url and author", () => {
      const schemas = buildBlogPostJsonLd(indexablePost!);
      const post = schemas.find(
        (s) => (s as { "@type": string })["@type"] === "BlogPosting",
      ) as Record<string, unknown>;
      expect(post.headline).toBe(indexablePost!.title);
      expect(post.datePublished).toBe(indexablePost!.date);
      expect(post.dateModified).toBe(indexablePost!.updatedAt);
      expect(post.url).toBe(`${SITE_URL}/blog/${INDEXABLE_SLUG}`);
      expect(post.inLanguage).toBe("en-AU");
      expect(post.isAccessibleForFree).toBe(true);
      const author = post.author as { name: string; sameAs: string };
      expect(author.name).toBe("Sam Williams");
      expect(author.sameAs).toBe(`${SITE_URL}/author/sam-williams`);
    });

    it("computes a non-zero wordCount and truncates articleBody at 5000 chars", () => {
      const schemas = buildBlogPostJsonLd(indexablePost!);
      const post = schemas.find(
        (s) => (s as { "@type": string })["@type"] === "BlogPosting",
      ) as Record<string, unknown>;
      expect(typeof post.wordCount).toBe("number");
      expect(post.wordCount).toBeGreaterThan(0);
      const body = post.articleBody as string;
      expect(typeof body).toBe("string");
      expect(body.length).toBeLessThanOrEqual(5000);
    });
  });
});
