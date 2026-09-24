import { describe, expect, it } from "vitest";
import { metadata as blogIndexMetadata } from "@/app/blog/page";
import {
  generateMetadata as categoryMetadata,
  latestCategoryModifiedDate,
} from "@/app/blog/category/[category]/page";
import {
  generateMetadata as pagedMetadata,
  generateStaticParams as pagedStaticParams,
} from "@/app/blog/page/[page]/page";
import sitemap from "@/app/sitemap";
import { blogPosts, getPostsByCategory } from "@/data/blog-posts";
import {
  BLOG_ARCHIVE_PAGE_LIMIT,
  BLOG_PAGE_SIZE,
  blogPageCount,
} from "@/lib/blog-pagination";
import { BLOG_CATEGORY_CONTENT_UPDATED, SITE_URL } from "@/lib/site";
import { legacyIndexingRedirects } from "../../../../next.config";

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

  it("uses unique category metadata and the latest child update date", async () => {
    const guides = getPostsByCategory("guides");
    const meta = await categoryMetadata({
      params: Promise.resolve({ category: "guides" }),
    });
    const expectedLatest = guides.reduce((latest, post) => {
      const stamp = post.updatedAt || post.date;
      return stamp > latest ? stamp : latest;
    }, BLOG_CATEGORY_CONTENT_UPDATED);

    expect(meta.title).toEqual({ absolute: "Caraway Blog: Guides" });
    expect(String(meta.description)).not.toMatch(/expert/i);
    expect(latestCategoryModifiedDate(guides)).toBe(expectedLatest);
  });

  it("gives paginated blog pages a text-only share preview", async () => {
    const meta = await pagedMetadata({
      params: Promise.resolve({ page: "2" }),
    });
    expect(meta.openGraph).toBeDefined();
    expectTextOnlyPreview(meta);
  });

  it("keeps live archive pages canonical and outside the retired redirect contract", async () => {
    const staticParams = pagedStaticParams();
    const livePaths = staticParams.map(({ page }) => `/blog/page/${page}`);
    const sitemapPaths = sitemap()
      .map((entry) => entry.url)
      .filter((url) => url.startsWith(`${SITE_URL}/blog/page/`));
    const redirectSources = new Set<string>(
      legacyIndexingRedirects.map((redirect) => redirect.source),
    );

    expect(blogPageCount()).toBeLessThanOrEqual(BLOG_ARCHIVE_PAGE_LIMIT);
    expect(blogPosts.length + 1).toBeLessThanOrEqual(
      1 + BLOG_ARCHIVE_PAGE_LIMIT * BLOG_PAGE_SIZE,
    );
    expect(staticParams).toEqual([{ page: "2" }, { page: "3" }]);
    expect(sitemapPaths).toEqual([
      `${SITE_URL}/blog/page/2`,
      `${SITE_URL}/blog/page/3`,
    ]);
    expect(livePaths.filter((path) => redirectSources.has(path))).toEqual([]);

    for (const { page } of staticParams) {
      const metadata = await pagedMetadata({
        params: Promise.resolve({ page }),
      });
      expect(metadata.alternates?.canonical).toBe(
        `${SITE_URL}/blog/page/${page}`,
      );
    }
  });
});
