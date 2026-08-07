import { expect, test } from "@playwright/test";

const targets = [
  {
    path: "/cash-for-cars-brisbane",
    heading: /Cash for Cars Brisbane/,
  },
  {
    path: "/car-removal-brisbane",
    heading: /Car Removal Brisbane/,
  },
] as const;

for (const target of targets) {
  test(`${target.path} keeps its visible and machine-readable SEO contract`, async ({
    page,
  }) => {
    const response = await page.goto(target.path);
    const canonical = `https://caraway.au${target.path}`;

    expect(response?.status()).toBe(200);
    // Browser tests run on 127.0.0.1, which must stay noindexed even though
    // the immutable HTML carries canonical index metadata for promotion.
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(target.heading);

    const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumbs.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      breadcrumbs.getByRole("link", { name: "Services" }),
    ).toHaveAttribute("href", "/services");
    await expect(page.locator('time[datetime="2026-08-07"]')).toHaveText(
      "7 August 2026",
    );

    const structuredData = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join("\n");
    expect(structuredData).toContain('"@type":"WebPage"');
    expect(structuredData).toContain(
      `"mainEntity":{"@id":"${canonical}#service"}`,
    );
    expect(structuredData).not.toContain('"@type":"FAQPage"');
  });
}
