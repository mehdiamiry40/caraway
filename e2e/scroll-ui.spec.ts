import { expect, test } from "@playwright/test";

/**
 * Scroll-driven UI: StickyMobileCTA and ReadingProgress have no unit
 * coverage, so this spec exercises them in a real browser at a mobile
 * viewport. The sticky bar is intentionally static HTML (no scroll
 * listeners), so the spec asserts availability and navigation, not
 * show/hide behavior.
 */
test.use({ viewport: { width: 390, height: 844 } });

const STICKY_BAR = '[data-testid="sticky-mobile-cta"]';

test("sticky mobile CTA is available and jumps to the estimator", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.locator(STICKY_BAR);

  await expect(bar).toBeVisible();
  await expect(
    bar.getByRole("link", { name: /call/i }).or(bar.locator("a[href^='tel:']")),
  ).toHaveCount(1);

  await bar.getByRole("link", { name: "Get my quote" }).click();
  await expect(page.locator("#price-estimator")).toBeInViewport();
});

test("reading progress bar tracks blog post scroll", async ({ page }) => {
  await page.goto("/blog/how-much-is-scrap-car-worth-brisbane");
  const progress = page.getByRole("progressbar", { name: "Reading progress" });

  await expect(progress).toHaveAttribute("aria-valuenow", "0");

  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(async () => Number(await progress.getAttribute("aria-valuenow")), {
      timeout: 5_000,
    })
    .toBeGreaterThan(90);
});
