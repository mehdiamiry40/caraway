import { expect, test } from "@playwright/test";

const route = "/resources/queensland-vehicle-data";
const canonical = `https://caraway.au${route}`;

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
  await expect(
    page.getByText("Historical snapshot — not current · 10 October 2022", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('svg[role="img"]')).toHaveCount(1);
  await expect(page.locator("table")).toHaveCount(3);

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const combinedJsonLd = jsonLd.join("\n");
  expect(combinedJsonLd).toContain('"@type":"CollectionPage"');
  expect(combinedJsonLd.match(/"@type":"Dataset"/g)).toHaveLength(2);
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
