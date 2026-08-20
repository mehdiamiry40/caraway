import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  INDEXNOW_MAX_URLS,
  buildIndexNowPayload,
} from "@/lib/indexnow";
import { SITE_URL } from "@/lib/site";
import {
  parseSitemap,
  recentUrls,
} from "../../../scripts/indexnow-submit.mjs";

describe("IndexNow key", () => {
  it("is a hex key inside the length the protocol accepts", () => {
    expect(INDEXNOW_KEY).toMatch(/^[0-9a-f]{8,128}$/);
  });

  // If the key and the served file drift apart, every submission is rejected
  // and nothing surfaces at runtime — so pin them together here.
  it("is served as a matching text file from public/", () => {
    const keyFile = path.join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
    expect(fs.existsSync(keyFile)).toBe(true);
    expect(fs.readFileSync(keyFile, "utf8").trim()).toBe(INDEXNOW_KEY);
    expect(INDEXNOW_KEY_LOCATION).toBe(`${SITE_URL}/${INDEXNOW_KEY}.txt`);
  });
});

describe("buildIndexNowPayload", () => {
  it("keeps same-host URLs and drops everything else", () => {
    const payload = buildIndexNowPayload([
      `${SITE_URL}/blog/one`,
      "https://example.com/spam",
      "not-a-url",
    ]);

    expect(payload?.urlList).toEqual([`${SITE_URL}/blog/one`]);
    expect(payload?.host).toBe("caraway.au");
    expect(payload?.key).toBe(INDEXNOW_KEY);
  });

  it("de-duplicates and returns null when nothing survives filtering", () => {
    expect(
      buildIndexNowPayload([`${SITE_URL}/a`, `${SITE_URL}/a`])?.urlList,
    ).toEqual([`${SITE_URL}/a`]);
    expect(buildIndexNowPayload(["https://example.com/x"])).toBeNull();
    expect(buildIndexNowPayload([])).toBeNull();
  });

  it("caps a batch at the protocol limit", () => {
    const urls = Array.from(
      { length: INDEXNOW_MAX_URLS + 25 },
      (_, i) => `${SITE_URL}/p/${i}`,
    );
    expect(buildIndexNowPayload(urls)?.urlList).toHaveLength(INDEXNOW_MAX_URLS);
  });
});

describe("sitemap parsing", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset>
      <url><loc>${SITE_URL}/fresh</loc><lastmod>2026-08-19</lastmod></url>
      <url><loc>${SITE_URL}/stale</loc><lastmod>2025-01-01</lastmod></url>
      <url><loc>${SITE_URL}/undated</loc></url>
    </urlset>`;

  it("reads loc/lastmod pairs including undated entries", () => {
    expect(parseSitemap(xml)).toEqual([
      { loc: `${SITE_URL}/fresh`, lastmod: "2026-08-19" },
      { loc: `${SITE_URL}/stale`, lastmod: "2025-01-01" },
      { loc: `${SITE_URL}/undated`, lastmod: undefined },
    ]);
  });

  it("submits only pages inside the window, newest first", () => {
    const now = Date.parse("2026-08-20T00:00:00Z");
    expect(recentUrls(parseSitemap(xml), 3, now)).toEqual([`${SITE_URL}/fresh`]);
  });

  // An undated or far-future entry must never widen the batch: submitting the
  // whole sitemap on every deploy is what gets a host rate-limited.
  it("ignores entries without a usable lastmod", () => {
    const now = Date.parse("2026-08-20T00:00:00Z");
    expect(
      recentUrls([{ loc: `${SITE_URL}/x`, lastmod: "not-a-date" }], 3, now),
    ).toEqual([]);
    expect(recentUrls([{ loc: `${SITE_URL}/y` }], 3, now)).toEqual([]);
  });
});
