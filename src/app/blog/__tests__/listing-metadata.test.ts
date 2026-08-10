import { describe, expect, it } from "vitest";
import { metadata as blogIndexMetadata } from "@/app/blog/page";
import { generateMetadata as categoryMetadata } from "@/app/blog/category/[category]/page";
import {
  generateMetadata as pagedMetadata,
  generateStaticParams as pagedStaticParams,
} from "@/app/blog/page/[page]/page";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/data/blog-posts";
import {
  BLOG_ARCHIVE_PAGE_LIMIT,
  BLOG_PAGE_SIZE,
  blogPageCount,
} from "@/lib/blog-pagination";
import { SITE_URL } from "@/lib/site";

type SocialMeta = { images?: unknown; card?: string } | null | undefined;

/** Every blog surface shares as text — no card, so no large-image card either. */
function expectTextOnlyPreview(meta: {
  openGraph?: unknown;
  twitter?: unknown;
}) {
  const og = meta.openGraph as SocialMeta;
  const twitter = meta.twitter as SocialMeta;
  expect(og?.images).toBeUndefined();
  expect(twitter?.images).toBeUndefined();
  expect(twitter?.card).toBe("summary");
}

describe("blog listing metadata", () => {
  it("gives the blog index a text-only share preview", () => {
    // openGraph must be declared (not omitted) or the root layout's card is
    // inherited — Next replaces the parent object rather than merging it.
    expect(blogIndexMetadata.openGraph).toBeDefined();
    expectTextOnlyPreview(blogIndexMetadata);
  });

  it("gives category pages a text-only share preview", async () => {
    const meta = await categoryMetadata({
      params: Promise.resolve({ category: "guides" }),
    });
    expect(meta.openGraph).toBeDefined();
    expectTextOnlyPreview(meta);
  });

  it("gives paginated blog pages a text-only share preview", async () => {
    const meta = await pagedMetadata({
      params: Promise.resolve({ page: "2" }),
    });
    expect(meta.openGraph).toBeDefined();
    expectTextOnlyPreview(meta);
  });

  it("keeps the first retired page outside the live archive with one-post headroom", () => {
    const livePagedRoutes = pagedStaticParams().map(({ page }) => Number(page));
    const firstRetiredUrl = `${SITE_URL}/blog/page/${BLOG_ARCHIVE_PAGE_LIMIT + 1}`;

    expect(blogPageCount()).toBeLessThanOrEqual(BLOG_ARCHIVE_PAGE_LIMIT);
    expect(blogPosts.length + 1).toBeLessThanOrEqual(
      1 + BLOG_ARCHIVE_PAGE_LIMIT * BLOG_PAGE_SIZE,
    );
    expect(livePagedRoutes.every((page) => page <= BLOG_ARCHIVE_PAGE_LIMIT)).toBe(
      true,
    );
    expect(
      sitemap().some((entry) => entry.url === firstRetiredUrl),
    ).toBe(false);
  });
});
