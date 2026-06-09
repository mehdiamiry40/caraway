import { expect, test } from "@playwright/test";

/**
 * Scroll-driven UI: StickyMobileCTA, BackToTopButton, and ReadingProgress
 * have no unit coverage (their behavior is window-scroll driven), so this
 * spec exercises them in a real browser at a mobile viewport.
 */
test.use({ viewport: { width: 390, height: 844 } });

// The sticky CTA wrapper is the only fixed, full-width, bottom-pinned div.
const STICKY_BAR = "div.fixed.inset-x-0.bottom-0";

test("sticky mobile CTA appears past the hero and hides at the estimator", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.locator(STICKY_BAR);

  // At the top of the page the bar is parked out of the accessibility tree.
  await expect(bar).toHaveAttribute("aria-hidden", "true");

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(bar).toHaveAttribute("aria-hidden", "false");

  // Tapping the CTA scrolls to the estimator, which re-hides the bar.
  await bar.getByRole("button", { name: "Get my quote" }).click();
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#price-estimator")).toBeInViewport();
});

test("back-to-top button returns the page to the top", async ({ page }) => {
  await page.goto("/");
  const backToTop = page.getByRole("button", { name: "Scroll to top" });

  await expect(backToTop).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(backToTop).toHaveCSS("opacity", "1");

  await backToTop.click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
    .toBeLessThan(50);
});

test("reading progress bar tracks blog post scroll", async ({ page }) => {
  await page.goto("/blog/free-car-removal-brisbane");
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
