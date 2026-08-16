import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";

/**
 * Citation hygiene for the primary sources behind regulated claims.
 *
 * `check:sources` proves a cited URL still resolves. It cannot see the failures
 * that show up when a source list is assembled plausibly rather than verified
 * entry by entry, because every URL involved resolves fine:
 *
 *  - the same page listed twice under two labels, so three sources look like
 *    four and one page appears to be two corroborating authorities
 *  - one page drifting across several labels, so the same authority reads as
 *    different sources in different posts
 *  - one label pointing at two different URLs, so a reader cannot tell which
 *    page actually backs the claim
 *
 * Both defects found in the PR audit were of exactly this shape, and both
 * passed every gate the repo had at the time.
 */

/**
 * Cited URLs that identify a page by an opaque CMS id rather than a stable
 * path. These break silently whenever the publisher migrates, and the id gives
 * a reader no way to tell what page was meant.
 *
 * This list may shrink, never grow. Clearing an entry means opening the URL,
 * confirming which page it resolves to, and citing that page's canonical path
 * instead — it needs someone with network access to the publisher, so it is
 * recorded here rather than guessed at.
 */
const KNOWN_OPAQUE_SOURCE_URLS = [
  // Resolves to a PPSR page also cited canonically at
  // /searching/do-used-car-or-vehicle-search. Confirm they are the same page,
  // then repoint these two posts and delete this entry.
  "https://www.ppsr.gov.au/node/76",
] as const;

/** An id-shaped path segment carries no meaning if the CMS renumbers it. */
const OPAQUE_URL = /\/(?:node|page|content)\/\d+\/?$|[?&](?:p|page_id|id)=\d+/i;

function allCitations() {
  return blogPosts.flatMap((post) =>
    (post.sources ?? []).map((source) => ({ ...source, slug: post.slug })),
  );
}

describe("citation hygiene", () => {
  it("never lists the same URL twice inside one post", () => {
    const offenders: string[] = [];

    for (const post of blogPosts) {
      const counts = new Map<string, number>();
      for (const source of post.sources ?? []) {
        counts.set(source.url, (counts.get(source.url) ?? 0) + 1);
      }
      for (const [url, count] of counts) {
        if (count > 1) offenders.push(`${post.slug} cites ${url} ${count}x`);
      }
    }

    expect(
      offenders,
      "One page listed twice makes a post look better sourced than it is. " +
        "Remove the duplicate, or cite a genuinely different page.",
    ).toEqual([]);
  });

  it("gives every cited URL exactly one title across the whole site", () => {
    const titlesByUrl = new Map<string, Set<string>>();
    for (const { url, title } of allCitations()) {
      if (!titlesByUrl.has(url)) titlesByUrl.set(url, new Set());
      titlesByUrl.get(url)!.add(title);
    }

    const drifted = [...titlesByUrl]
      .filter(([, titles]) => titles.size > 1)
      .map(([url, titles]) => `${url} → ${[...titles].map((t) => `"${t}"`).join(" / ")}`);

    expect(
      drifted,
      "The same page is cited under different names. Pick one label and use it " +
        "everywhere, following the majority “Authority — page” convention.",
    ).toEqual([]);
  });

  it("gives every source title exactly one URL across the whole site", () => {
    const urlsByTitle = new Map<string, Set<string>>();
    for (const { url, title } of allCitations()) {
      if (!urlsByTitle.has(title)) urlsByTitle.set(title, new Set());
      urlsByTitle.get(title)!.add(url);
    }

    const ambiguous = [...urlsByTitle]
      .filter(([, urls]) => urls.size > 1)
      .map(([title, urls]) => `"${title}" → ${[...urls].join(" / ")}`);

    expect(
      ambiguous,
      "One label points at more than one URL, so a reader cannot tell which " +
        "page backs the claim. Either they are the same page (cite it once) or " +
        "they are different pages (name them differently).",
    ).toEqual([]);
  });

  it("does not add new sources identified by an opaque CMS id", () => {
    const unexpected = allCitations()
      .filter(({ url }) => OPAQUE_URL.test(url))
      .filter(({ url }) => !KNOWN_OPAQUE_SOURCE_URLS.includes(url as never))
      .map(({ slug, url }) => `${slug}: ${url}`);

    expect(
      unexpected,
      "Cite the publisher's stable path rather than an internal record id.",
    ).toEqual([]);
  });

  it("keeps the opaque-URL list free of entries that are already resolved", () => {
    const cited = new Set(allCitations().map(({ url }) => url));
    const stale = KNOWN_OPAQUE_SOURCE_URLS.filter((url) => !cited.has(url));

    expect(
      stale,
      "These URLs are no longer cited. Delete them from " +
        "KNOWN_OPAQUE_SOURCE_URLS so the list keeps shrinking.",
    ).toEqual([]);
  });

  it("still pairs every regulated post with at least one source", () => {
    const missing = blogPosts
      .filter((post) => post.reviewedAt && !(post.sources ?? []).length)
      .map((post) => post.slug);

    expect(missing).toEqual([]);
  });
});
