import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import { QLD_SALE_SOURCE_URLS } from "@/lib/qld-vehicle-sale-pathway";

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

/**
 * Addresses the publisher has retired by redirecting them to a hub page.
 *
 * These are worse than a dead link for this repo's gates: the address still
 * answers 200 after the redirect, so `check:sources` reports it live, while the
 * page it lands on no longer carries the detail the citation was for.
 *
 * Add an address here once every use of it has been repointed to the page that
 * now holds the content, with the claims reread against that page.
 */
const RETIRED_SOURCE_URLS = [
  // Transport and Main Roads replaced its "transfer online" and "transfer in
  // person" pages with a seller page and a buyer page
  // (/transfer/seller-transfer and /transfer/buyer-transfer). Both old
  // addresses now redirect to the /transport/registration/transfer hub.
  "https://www.qld.gov.au/transport/registration/transfer/online",
  "https://www.qld.gov.au/transport/registration/transfer/rego",
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

  it("does not cite an address the publisher has retired to a hub page", () => {
    const retired = (text: string) =>
      RETIRED_SOURCE_URLS.filter((url) => text.includes(url));

    const offenders = [
      // Source lists, inline links in the body, and FAQ answers.
      ...blogPosts.flatMap((post) =>
        retired(
          [
            ...post.content,
            ...(post.faqs ?? []).map((faq) => faq.answer),
            ...(post.sources ?? []).map((source) => source.url),
          ].join("\n"),
        ).map((url) => `${post.slug}: ${url}`),
      ),
      // The seller checklist tool links its steps to the same pages.
      ...retired(Object.values(QLD_SALE_SOURCE_URLS).join("\n")).map(
        (url) => `qld-vehicle-sale-pathway: ${url}`,
      ),
    ];

    expect(
      offenders,
      "This address now redirects to a hub page without the cited detail. " +
        "Cite the page that carries it, and reread the claim against that page.",
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

  it("cites the page that carries the detail, not the hub above it", () => {
    // These Transport and Main Roads pages are only lists of links with
    // one-line summaries. The detail sits on the pages below them: transfer as
    // a seller or a buyer, deceased estates and interstate moves under the
    // first; customised and personalised plates and plate replacement under
    // the second. A hub answers 200, so `check:sources` reports it live while
    // it backs none of the statements it is listed for.
    const hubs = [
      "https://www.qld.gov.au/transport/registration/transfer",
      "https://www.qld.gov.au/transport/registration/numberplate",
    ];

    const offenders = blogPosts.flatMap((post) =>
      (post.sources ?? [])
        .filter((source) => hubs.includes(source.url))
        .map((source) => `${post.slug}: ${source.url}`),
    );

    expect(
      offenders,
      "This page is a list of links. Cite the page under it that carries the " +
        "statement, and reread the statement against that page.",
    ).toEqual([]);
  });
});
