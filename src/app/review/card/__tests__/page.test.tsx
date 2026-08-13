import { readFile } from "node:fs/promises";
import path from "node:path";
import jsQR from "jsqr";
import sharp from "sharp";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import ReviewCardPage, {
  metadata,
  REVIEW_CARD_DESTINATION,
  REVIEW_CARD_QR_SRC,
} from "@/app/review/card/page";
import { SITE_URL } from "@/lib/site";

describe("printable review card", () => {
  it("is self-canonical, noindex and excluded from the XML sitemap", () => {
    expect(metadata.alternates?.canonical).toBe("/review/card");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(metadata.robots).toMatchObject({
      googleBot: { index: false, follow: true, noimageindex: true },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/review/card",
      title: "Printable Customer Feedback Card | Caraway",
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.twitter).not.toHaveProperty("images");

    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/review/card`);
  });

  it("uses neutral completed-customer copy without ranking or rating prompts", () => {
    const markup = renderToStaticMarkup(<ReviewCardPage />).toLowerCase();

    expect(markup).toContain("after your caraway transaction or collection is complete");
    expect(markup).toContain("if you choose to share your genuine experience");
    expect(markup).toContain("positive, neutral and critical feedback");
    expect(markup).toContain("no obligation, no incentive");
    expect(markup).toContain("no requested rating or wording");
    expect(markup).toContain("review later, in your own time");
    expect(markup).toContain("protect your privacy");

    expect(markup).not.toContain("five star");
    expect(markup).not.toContain("5 star");
    expect(markup).not.toContain("if you were happy");
    expect(markup).not.toContain("discount");
    expect(markup).not.toContain("cash for cars brisbane");
    expect(markup).not.toContain("car removal brisbane");
    expect(markup).not.toContain("aggregaterating");
    expect(markup).not.toContain('"@type":"review"');
  });

  it("encodes only the stable first-party review handoff", async () => {
    expect(REVIEW_CARD_DESTINATION).toBe("https://caraway.au/review");
    expect(REVIEW_CARD_QR_SRC).toBe("/images/caraway-review-qr.svg");

    const svgPath = path.join(
      process.cwd(),
      "public",
      REVIEW_CARD_QR_SRC.replace(/^\//, ""),
    );
    const svg = await readFile(svgPath);
    const { data, info } = await sharp(svg)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const decoded = jsQR(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
    );

    expect(decoded?.data).toBe(REVIEW_CARD_DESTINATION);
  });
});
