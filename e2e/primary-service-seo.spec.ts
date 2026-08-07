import { expect, test } from "@playwright/test";

const targets = [
  {
    path: "/cash-for-cars-brisbane",
    heading: /Cash for Cars Brisbane/,
    imagePath: "/images/cash-for-cars-brisbane-quote-readiness-v1.jpg",
    imageAlt:
      "Vehicle quote-readiness diagram showing front, rear and side photos, the interior and odometer, visible damage, and driveway access",
  },
  {
    path: "/car-removal-brisbane",
    heading: /Car Removal Brisbane/,
    imagePath: "/images/car-removal-brisbane-access-readiness-v1.jpg",
    imageAlt:
      "Vehicle pickup-access diagram showing wheel and steering checks, gate width, height clearance, driveway slope and surface, turns, and obstacles",
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
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `https://caraway.au${target.imagePath}`,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      `https://caraway.au${target.imagePath}`,
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

    const preferredImage = page.getByRole("img", { name: target.imageAlt });
    await expect(preferredImage).toHaveCount(1);
    await expect(preferredImage).toHaveAttribute("width", "1200");
    await expect(preferredImage).toHaveAttribute("height", "630");
    await expect(preferredImage).toHaveAttribute(
      "sizes",
      "(max-width: 1023px) calc(100vw - 2rem), 760px",
    );
    await expect(preferredImage).toHaveAttribute("loading", "lazy");
    await preferredImage.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        preferredImage.evaluate((element) => {
          const image = element as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        }),
      )
      .toBe(true);

    const imageResponse = await page.request.get(target.imagePath);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()["content-type"]).toContain("image/jpeg");

    const structuredData = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join("\n");
    expect(structuredData).toContain('"@type":"WebPage"');
    expect(structuredData).toContain(
      `"mainEntity":{"@id":"${canonical}#service"}`,
    );
    expect(structuredData).toContain(
      `"primaryImageOfPage":{"@type":"ImageObject","@id":"${canonical}#primaryimage","url":"https://caraway.au${target.imagePath}"`,
    );
    expect(structuredData).toContain(
      `"image":"https://caraway.au${target.imagePath}"`,
    );
    expect(structuredData).not.toContain('"@type":"FAQPage"');
  });
}
