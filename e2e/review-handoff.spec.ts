import { expect, test } from "@playwright/test";

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
