import { describe, expect, it } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import {
  buildBlogPostSeoProps,
  generateMetadata,
} from "@/app/blog/[slug]/metadata";
import { blogPosts } from "@/data/blog-posts";
import { renderBlogContent } from "@/lib/blog-markdown";
import { SITE_URL } from "@/lib/site";

// Pick concrete fixtures from real data. Using slugs rather than array
// indices keeps these tests stable as posts are added or reordered.
const INDEXABLE_SLUG = "what-paperwork-to-sell-a-car-qld";

const indexablePost = blogPosts.find((p) => p.slug === INDEXABLE_SLUG);

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function asElement(node: ReactNode): ReactElement {
  if (!isValidElement(node)) {
    throw new Error(`Expected React element, got ${typeof node}`);
  }
  return node;
}

function getChildren(element: ReactElement): ReactNode[] {
  const children = (element.props as { children?: ReactNode }).children;
  if (children == null) return [];
  return Array.isArray(children) ? children : [children];
}

describe("generateMetadata (blog post route)", () => {
  describe("indexable post", () => {
    it("is a valid fixture (sanity check — the test data must exist and be indexable)", () => {
      expect(indexablePost).toBeDefined();
    });

    it("returns a title containing the post title", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      expect(typeof meta.title).toBe("string");
      expect(meta.title).toBe(indexablePost!.title);
      expect(String(meta.title)).toContain("Paperwork");
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

    it("shares as a text-only preview — no OpenGraph or Twitter image", async () => {
      const meta = await generateMetadata(makeParams(INDEXABLE_SLUG));
      const og = meta.openGraph as { images?: unknown } | undefined;
      const twitter = meta.twitter as
        | { card?: string; images?: unknown }
        | undefined;
      expect(og?.images).toBeUndefined();
      expect(twitter?.images).toBeUndefined();
      // summary_large_image would ask X to feature an image that isn't there.
      expect(twitter?.card).toBe("summary");
    });

    it("renders the real seller checklist as one heading and eight list items", () => {
      const rendered = renderBlogContent(indexablePost!.content);
      const headingIndex = rendered.findIndex((node) => {
        if (!isValidElement(node)) return false;
        return (node.props as { id?: string }).id ===
          "at-a-glance-queensland-seller-paperwork-checklist";
      });
      expect(headingIndex).toBeGreaterThanOrEqual(0);

      const heading = asElement(rendered[headingIndex]);
      expect(heading.type).toBe("h2");

      const checklist = asElement(rendered[headingIndex + 2]);
      expect(checklist.type).toBe("ul");
      const items = getChildren(checklist);
      expect(items).toHaveLength(8);
      for (const item of items) {
        expect(asElement(item).type).toBe("li");
      }

      expect(asElement(rendered[headingIndex + 3]).type).toBe("h2");
    });
  });

  describe("non-existent slug", () => {
    it("returns absolute 'Post not found' title with noindex,nofollow robots (no throw)", async () => {
      const meta = await generateMetadata(
        makeParams("definitely-not-a-real-post-slug-xyz"),
      );
      // title.absolute bypasses the "%s | Caraway" template so the 404 title
      // doesn't render as "Post not found — Caraway | Caraway".
      expect(meta.title).toEqual({ absolute: "Post not found — Caraway" });
      const robots = meta.robots as { index?: boolean; follow?: boolean };
      expect(robots).toBeDefined();
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(false);
      // The 404 metadata path intentionally omits description/canonical and
      // nulls out openGraph/twitter so no social card leaks for the missing
      // post — lock that contract in.
      expect(meta.description).toBeUndefined();
      expect(meta.alternates).toBeUndefined();
      expect(meta.openGraph).toBeNull();
      expect(meta.twitter).toBeNull();
    });
  });

  describe("buildBlogPostSeoProps (BlogPosting schema)", () => {
    it("returns articleSchema, breadcrumbItems, wordCount, and plainContent", () => {
      const result = buildBlogPostSeoProps(indexablePost!);
      expect(result.articleSchema).toBeDefined();
      expect(result.breadcrumbItems).toBeDefined();
      expect(result.wordCount).toBeDefined();
      expect(result.plainContent).toBeDefined();
      expect(result.breadcrumbItems).toHaveLength(3);
    });

    it("populates articleSchema with headline, dates, canonical url and author", () => {
      const { articleSchema } = buildBlogPostSeoProps(indexablePost!);
      expect(articleSchema.headline).toBe(indexablePost!.title);
      expect(articleSchema.datePublished).toBe(indexablePost!.date);
      expect(articleSchema.dateModified).toBe(indexablePost!.updatedAt);
      expect(articleSchema.url).toBe(`${SITE_URL}/blog/${INDEXABLE_SLUG}`);
      expect(articleSchema.isAccessibleForFree).toBe(true);
      const author = articleSchema.author as {
        "@type": string;
        name: string;
        url: string;
      };
      expect(author["@type"]).toBe("Organization");
      expect(author.name).toBe("Caraway");
      expect(author.url).toBe(SITE_URL);
    });

    it("omits image from articleSchema — posts have no artwork to cite", () => {
      const { articleSchema } = buildBlogPostSeoProps(indexablePost!);
      expect("image" in articleSchema).toBe(false);
    });

    it("computes a non-zero wordCount", () => {
      const { wordCount, plainContent } = buildBlogPostSeoProps(indexablePost!);
      expect(typeof wordCount).toBe("number");
      expect(wordCount).toBeGreaterThan(0);
      expect(typeof plainContent).toBe("string");
      expect(plainContent.length).toBeGreaterThan(0);
    });
  });
});
