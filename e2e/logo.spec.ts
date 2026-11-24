import { expect, test, type Page } from "@playwright/test";

// The logo's outlines are drawn once by the root layout, and the header and
// footer logos only point at them. A logo can therefore be in the page, with
// the right name and size, and still be blank. Only a browser can tell.
async function expectBothLogosDrawn(page: Page) {
  for (const region of ["banner", "contentinfo"] as const) {
    const logo = page
      .getByRole(region)
      .getByRole("link", { name: "Caraway Cash for Cars", exact: true });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("href", "/");
    // The size of the artwork the logo resolved to, in its own units. An
    // unresolved reference measures 0 x 0.
    const ink = await logo.locator("svg use").evaluate((use) => {
      const box = (use as SVGUseElement).getBBox();
      return { width: box.width, height: box.height };
    });
    expect(ink.width).toBeCloseTo(151.12, 1);
    expect(ink.height).toBeCloseTo(48, 1);
  }
}

for (const path of ["/", "/about", "/a-page-that-does-not-exist"]) {
  test(`the header and footer logos are drawn on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expectBothLogosDrawn(page);
  });
}

test("the logos are still drawn after moving to another page without a reload", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectBothLogosDrawn(page);
});
