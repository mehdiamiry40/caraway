import { expect, test } from "@playwright/test";

test("supplemental blog FAQs are server-rendered as one accessible accordion", async ({
  page,
  request,
}) => {
  const route = "/blog/sell-van-brisbane";
  const response = await request.get(route);
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain("Frequently asked questions");
  expect(html).toContain("Does a van need a safety certificate to be sold in Queensland?");

  await page.goto(route);
  const section = page.getByRole("region", {
    name: "Frequently asked questions",
  });

  await expect(section).toHaveCount(1);
  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Frequently asked questions",
    }),
  ).toHaveCount(1);
  await expect(section.locator("details")).toHaveCount(4);
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "Should I remove the shelving before selling my van?",
    }),
  ).toHaveCount(1);
  await expect(
    page.locator('article header time[datetime="2026-08-10"]'),
  ).toHaveText("10 August 2026");
  await expect(
    page.locator('article aside time[datetime="2026-08-08"]'),
  ).toHaveText("8 August 2026");

  const structuredData = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join("\n");
  expect(structuredData).toContain('"@type":"BlogPosting"');
  expect(structuredData).toContain('"dateModified":"2026-08-10"');
  expect(structuredData).not.toContain('"@type":"FAQPage"');
});

test("an authored FAQ section suppresses duplicate supplemental fields", async ({
  page,
}) => {
  await page.goto("/blog/cash-for-cars-vs-private-sale");

  await expect(page.getByRole("heading", { level: 2, name: "FAQ" })).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Frequently asked questions",
    }),
  ).toHaveCount(0);
  await expect(page.locator("article details")).toHaveCount(0);
  await expect(page.getByText("Will private sale get me more money?", { exact: true })).toHaveCount(1);

  const structuredData = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join("\n");
  expect(structuredData).not.toContain('"@type":"FAQPage"');
});
