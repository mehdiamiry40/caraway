import { expect, test } from "@playwright/test";
import jsQR from "jsqr";
import sharp from "sharp";

const googleReviewUrl =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0x6b9145f7c7992573:0x20b7c0537d263e77!12e1";

test("review handoff is unlisted, neutral and points to the verified review action", async ({
  page,
}) => {
  const response = await page.goto("/review", { waitUntil: "networkidle" });

  expect(response?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://caraway.au/review",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Share Honest Feedback | Caraway",
  );
  await expect(
    page.locator('meta[property="og:description"]'),
  ).toHaveAttribute(
    "content",
    /dedicated handoff for genuine Caraway customers/i,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary",
  );

  const handoff = page.getByRole("link", { name: "Write a review on Google" });
  await expect(handoff).toHaveAttribute("href", googleReviewUrl);
  await expect(handoff).toHaveAttribute("target", "_blank");
  await expect(handoff).toHaveAttribute("rel", "noopener noreferrer");
  await expect(handoff).toHaveAttribute(
    "data-track-location",
    "review_handoff",
  );

  const mainText = (await page.locator("main").innerText()).toLowerCase();
  expect(mainText).toContain("no obligation");
  expect(mainText).toContain("positive, neutral, and critical feedback");
  expect(mainText).not.toContain("five star");
  expect(mainText).not.toContain("if you were happy");

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("https://caraway.au/review");
});

test("printable review card is neutral, unlisted and print-ready", async ({
  page,
}) => {
  const response = await page.goto("/review/card", { waitUntil: "networkidle" });

  expect(response?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://caraway.au/review/card",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );

  const card = page.locator(".review-card-sheet");
  await expect(card).toBeVisible();
  await expect(card).toContainText("Share honest feedback");
  await expect(card).toContainText("Positive, neutral and critical feedback");
  await expect(card).toContainText("Review later, in your own time");
  await expect(card.getByRole("img", { name: /qr code opening/i })).toBeVisible();

  const renderedQr = await card
    .getByRole("img", { name: /qr code opening/i })
    .screenshot();
  const { data, info } = await sharp(renderedQr)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data).toBe(
    "https://caraway.au/review",
  );

  const mainText = (await page.locator("main").innerText()).toLowerCase();
  expect(mainText).not.toContain("five star");
  expect(mainText).not.toContain("cash for cars brisbane");
  expect(mainText).not.toContain("car removal brisbane");

  await page.emulateMedia({ media: "print" });
  await expect(card).toBeVisible();
  await expect(page.getByRole("button", { name: "Print card" })).toBeHidden();
  await expect(page.locator(".review-card-screen-only")).toBeHidden();

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("https://caraway.au/review/card");
});
