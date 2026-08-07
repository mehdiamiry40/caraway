import { describe, expect, it } from "vitest";
import nextConfig, {
  legacyIndexingRedirects,
  retiredBlogRedirects,
  retiredServiceRedirects,
} from "../next.config";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";

type RedirectRule = {
  source: string;
  destination: string;
  permanent?: boolean;
};

async function getRedirects(): Promise<RedirectRule[]> {
  const redirects = nextConfig.redirects;
  if (typeof redirects !== "function") return [];
  return (await redirects()) as RedirectRule[];
}

describe("Search Console canonical URL cleanup", () => {
  it("serves /how-it-works as a canonical page instead of a redirect", async () => {
    const redirectSources = new Set(
      (await getRedirects()).map((rule) => rule.source),
    );

    expect(redirectSources.has("/how-it-works")).toBe(false);
    expect(howItWorksMetadata.alternates?.canonical).toBe("/how-it-works");
  });

  it("permanently redirects the legacy damaged-car HTML URL to the live article", async () => {
    const redirects = await getRedirects();

    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: "/blog/sell-damaged-car-brisbane.html",
        destination: "/blog/sell-damaged-car-brisbane",
        permanent: true,
      }),
    );
  });

  it("permanently redirects every retired Search Console alias", async () => {
    const redirects = await getRedirects();
    const configuredIndexingRedirects = [
      ...legacyIndexingRedirects,
      ...retiredBlogRedirects,
      ...retiredServiceRedirects,
    ];
    const expected = new Map([
      ["/index.html", "/"],
      ["/cash-for-cars-sunnybank.html", "/locations/moorooka"],
      [
        "/blog/old-car-running-costs.html",
        "/blog/repair-or-sell-your-car-brisbane",
      ],
      [
        "/blog/cash-for-cars-vs-dealer-trade-in.html",
        "/blog/trade-in-vs-cash-for-cars-brisbane",
      ],
      ["/english-privacy-policy", "/privacy"],
      ["/book-online", "/contact"],
      ["/service-page/home-visit", "/car-removal-brisbane"],
      ["/unwanted-cars-brisbane", "/car-removal-brisbane"],
      ["/blog/free-car-removal-brisbane", "/car-removal-brisbane"],
      ["/blog/sell-damaged-car-brisbane.html", "/blog/sell-damaged-car-brisbane"],
    ]);

    for (const [source, destination] of expected) {
      expect(configuredIndexingRedirects).toContainEqual({
        source,
        destination,
      });
      expect(redirects).toContainEqual(
        expect.objectContaining({
          source,
          destination,
          permanent: true,
        }),
      );
    }
  });
});
