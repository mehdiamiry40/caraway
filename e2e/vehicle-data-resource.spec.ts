import { expect, test } from "@playwright/test";

const route = "/resources/queensland-vehicle-data";
const canonical = `https://caraway.au${route}`;
const socialImage =
  "https://caraway.au/images/queensland-vehicle-data-open-data-v1.png";
const brisbanePreview =
  "https://caraway.au/images/brisbane-registered-vehicle-snapshot-v1.png";
const VEHICLE_DATA_SOCIAL_IMAGE_ALT =
  "Caraway open-data graphic for Queensland registered cars by fuel type, 2006–2024. Electric records increase from 1 to 44,398 and Petrol/Electric records from 102 to 110,604.";
const BRISBANE_REUSE_IMAGE_ALT =
  "Caraway open-data graphic for a historical Brisbane City registered-vehicle snapshot dated 10 October 2022, containing 186 unambiguous suburb and postcode rows.";

test("vehicle-data resource is indexable, self-canonical, and downloadable", async ({
  page,
}) => {
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText(
    "Queensland vehicle fuel trends and a Brisbane suburb snapshot",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    canonical,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /index, follow/i,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    socialImage,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    socialImage,
  );
  await expect(
    page.getByText("Historical snapshot — not current · 10 October 2022", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('svg[role="img"]')).toHaveCount(1);
  await expect(page.locator("table")).toHaveCount(3);
  await expect(
    page.getByRole("link", {
      name: "Download Queensland fuel-trends graphic (PNG, 1200 × 630)",
    }),
  ).toHaveAttribute("download", "");
  await expect(
    page.getByRole("link", {
      name: "Download historical Brisbane suburb-snapshot graphic (PNG, 800 × 800)",
    }),
  ).toHaveAttribute("download", "");
  const imageReuseSection = page.locator("#image-reuse-license");
  await expect(imageReuseSection).toBeVisible();
  await expect(imageReuseSection.locator("img")).toHaveCount(2);
  await expect(
    imageReuseSection.locator(`img[alt="${VEHICLE_DATA_SOCIAL_IMAGE_ALT}"]`),
  ).toBeVisible();
  await expect(
    imageReuseSection.locator(`img[alt="${BRISBANE_REUSE_IMAGE_ALT}"]`),
  ).toBeVisible();
  await expect(
    imageReuseSection.getByRole("link", {
      name: "Creative Commons Attribution 4.0",
    }),
  ).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const combinedJsonLd = jsonLd.join("\n");
  const structuredNodes = jsonLd.flatMap((value) => {
    const parsed = JSON.parse(value) as
      | Record<string, unknown>
      | Record<string, unknown>[];
    return Array.isArray(parsed) ? parsed : [parsed];
  });
  const resourceImages = structuredNodes.filter(
    (node) =>
      node["@type"] === "ImageObject" &&
      String(node["@id"]).startsWith(`${canonical}#`),
  );
  expect(combinedJsonLd).toContain('"@type":"CollectionPage"');
  expect(combinedJsonLd.match(/"@type":"Dataset"/g)).toHaveLength(2);
  expect(resourceImages).toHaveLength(2);
  expect(combinedJsonLd).toContain(
    `"acquireLicensePage":"${canonical}#image-reuse-license"`,
  );
  expect(combinedJsonLd).toContain(
    '"license":"https://creativecommons.org/licenses/by/4.0/"',
  );
  expect(combinedJsonLd).toContain('"creditText":"Caraway graphic.');
  expect(combinedJsonLd).not.toMatch(/"@type":"(?:Service|LocalBusiness|FAQPage)"/);

  const fuelCsv = await page.request.get(
    "/data/queensland-car-registrations-by-fuel-2006-2024.csv",
  );
  expect(fuelCsv.ok()).toBe(true);
  expect(fuelCsv.headers()["content-type"]).toContain("text/csv");
  expect((await fuelCsv.text()).split("\n")[0]).toBe(
    "year,fuel_type,registered_cars,source_resource_id,source_url,methodology_url,license_url,attribution,changes",
  );

  const brisbaneCsv = await page.request.get(
    "/data/brisbane-registered-vehicles-by-suburb-2022.csv",
  );
  expect(brisbaneCsv.ok()).toBe(true);
  expect(brisbaneCsv.headers()["content-type"]).toContain("text/csv");
  expect((await brisbaneCsv.text()).split("\n")[0]).toBe(
    "suburb,postcode,registered_vehicles,match_method,source_snapshot_date,source_resource_id,source_url,methodology_url,license_url,attribution,changes",
  );

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(canonical);
  expect(await sitemap.text()).toContain(socialImage);
  expect(await sitemap.text()).toContain(brisbanePreview);

  for (const imagePath of [
    new URL(socialImage).pathname,
    new URL(brisbanePreview).pathname,
  ]) {
    const imageResponse = await page.request.get(imagePath);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()["content-type"]).toContain("image/png");
    expect(imageResponse.headers()["cross-origin-resource-policy"]).toBe(
      "cross-origin",
    );
    expect(imageResponse.headers()["access-control-allow-origin"]).toBe("*");
    expect(imageResponse.headers()["cache-control"]).toContain("immutable");
  }
});

test("vehicle-data resource avoids horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: "networkidle" });

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});
