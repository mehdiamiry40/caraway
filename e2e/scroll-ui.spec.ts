import { expect, test } from "@playwright/test";

/**
 * Scroll-driven UI: StickyMobileCTA and ReadingProgress have no unit
 * coverage, so this spec exercises them in a real browser at a mobile
 * viewport.
 */
test.use({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});

const STICKY_BAR = '[data-testid="sticky-mobile-cta"]';
const TARGET_SERVICE_PATHS = [
  "/cash-for-cars-brisbane",
  "/car-removal-brisbane",
] as const;

test("sticky mobile CTA is available and jumps to the quote form", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.locator(STICKY_BAR);

  await expect(bar).toHaveAttribute("aria-hidden", "true");
  // getBoundingClientRect, not offsetTop: #quote-form now sits inside the
  // hero's positioned column, so offsetTop is not document-relative.
  await page.locator("#quote-form").evaluate((quoteForm) => {
    const rect = quoteForm.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.bottom + 100);
  });
  await expect(bar).toBeVisible();
  await expect(bar).not.toHaveAttribute("aria-hidden", "true");
  await expect(
    bar.getByRole("link", { name: /call/i }).or(bar.locator("a[href^='tel:']")),
  ).toHaveCount(1);

  await bar.getByRole("button", { name: "Get my quote" }).click();
  await expect(page.locator("#quote-form")).toBeInViewport();
});

for (const path of TARGET_SERVICE_PATHS) {
  test(`sticky mobile CTA stays on ${path} and uses its quote form`, async ({
    page,
  }) => {
    await page.goto(path);
    const bar = page.locator(STICKY_BAR);
    const quoteForm = page.locator("#quote-form");

    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(bar).not.toHaveAttribute("aria-hidden", "true");

    const serviceUrl = page.url();
    await bar.getByRole("button", { name: "Get my quote" }).click();

    await expect(page).toHaveURL(serviceUrl);
    await expect(quoteForm).toBeInViewport();
    await expect(bar).toHaveAttribute("aria-hidden", "true");
  });
}

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
