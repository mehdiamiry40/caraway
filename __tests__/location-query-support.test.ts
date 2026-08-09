import { describe, expect, it } from "vitest";
import { generateMetadata as generateLocationMetadata } from "@/app/locations/[slug]/page";
import { getPostsForSuburb } from "@/data/blog-posts";
import { getSuburbBySlug, suburbs } from "@/data/suburbs";

const BROAD_CASH_QUERY = /cash for cars brisbane/i;
const REDLAND_QUERY = /cash for cars (?:redland city|redlands)/i;

describe("location query support", () => {
  it("targets the observed Kenmore query without claiming the broad Brisbane query", async () => {
    const kenmore = getSuburbBySlug("kenmore");
    const metadata = await generateLocationMetadata({
      params: Promise.resolve({ slug: "kenmore" }),
    });

    expect(kenmore).toBeDefined();
    expect(kenmore?.title).toMatch(/car buyers kenmore/i);
    expect(kenmore?.h1).toMatch(/cash for cars kenmore/i);

    for (const value of [
      kenmore?.title,
      kenmore?.h1,
      kenmore?.metaDescription,
    ]) {
      expect(value).not.toMatch(BROAD_CASH_QUERY);
    }

    expect(kenmore?.relatedServices).toContain("cash-for-cars-brisbane");
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/locations/kenmore",
    );
  });

  it("connects Kenmore to the vehicle-buyer quote comparison guide", () => {
    expect(
      getPostsForSuburb("kenmore").map((post) => post.slug),
    ).toContain("how-to-get-the-best-cash-for-cars-price-brisbane");
  });

  it("consolidates the observed Redland City query into Capalaba without claiming the broad Brisbane query", async () => {
    const capalaba = getSuburbBySlug("capalaba");
    const metadata = await generateLocationMetadata({
      params: Promise.resolve({ slug: "capalaba" }),
    });

    expect(capalaba).toBeDefined();
    expect(capalaba?.title).toMatch(/cash for cars redland city/i);
    expect(capalaba?.h1).toMatch(/cash for cars capalaba/i);

    for (const value of [
      capalaba?.title,
      capalaba?.h1,
      capalaba?.metaDescription,
    ]) {
      expect(value).not.toMatch(BROAD_CASH_QUERY);
    }

    expect(capalaba?.relatedServices).toContain("cash-for-cars-brisbane");
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/locations/capalaba",
    );

    expect(
      suburbs
        .filter((suburb) =>
          [suburb.title, suburb.h1, suburb.metaDescription].some((value) =>
            REDLAND_QUERY.test(value),
          ),
        )
        .map((suburb) => suburb.slug),
    ).toEqual(["capalaba"]);
  });
});
