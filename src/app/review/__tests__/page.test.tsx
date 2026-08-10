import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import ReviewPage, { metadata } from "@/app/review/page";
import { BUSINESS, SITE_URL } from "@/lib/site";

vi.mock("next/navigation", () => ({
  usePathname: () => "/review",
}));

function reviewMainMarkup(): string {
  const page = renderToStaticMarkup(<ReviewPage />);
  const start = page.indexOf("<main");
  const end = page.indexOf("</main>");
  if (start === -1 || end === -1) throw new Error("Review page has no main landmark");
  return page.slice(start, end + "</main>".length);
}

describe("review handoff", () => {
  it("is self-canonical, noindex and follow", () => {
    expect(metadata.alternates?.canonical).toBe("/review");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(metadata.robots).toMatchObject({
      googleBot: { index: false, follow: true },
    });
  });

  it("uses neutral page-specific social metadata", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "/review",
      title: "Share Honest Feedback | Caraway",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: "Share Honest Feedback | Caraway",
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.twitter).not.toHaveProperty("images");
  });

  it("stays out of the XML sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/review`);
  });

  it("uses the configured Google profile as a safe, tracked handoff", () => {
    const markup = renderToStaticMarkup(<ReviewPage />);

    expect(markup).toContain(`href="${BUSINESS.googleBusinessUrl}"`);
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('data-track-location="review_handoff"');
    expect(markup).toContain("Open Caraway on Google");
    expect(markup).toContain("(opens in a new tab)");
    expect(new URL(BUSINESS.googleBusinessUrl).protocol).toBe("https:");
  });

  it("asks neutrally for genuine feedback and protects customer privacy", () => {
    const markup = reviewMainMarkup().toLowerCase();

    expect(markup).toContain("genuine caraway vehicle");
    expect(markup).toContain("no obligation");
    expect(markup).toContain("positive, neutral, and critical feedback");
    expect(markup).toContain("does not offer an incentive");
    expect(markup).toContain(
      "does not offer an incentive or ask for a particular rating",
    );
    expect(markup).toContain("protect your privacy");

    expect(markup).not.toContain("five star");
    expect(markup).not.toContain("5 star");
    expect(markup).not.toContain("discount");
    expect(markup).not.toContain("cash for cars brisbane");
    expect(markup).not.toContain("car removal brisbane");
    expect(markup).not.toContain("if you were happy");
    expect(markup).not.toContain("aggregaterating");
    expect(markup).not.toContain('"@type":"review"');
  });
});
