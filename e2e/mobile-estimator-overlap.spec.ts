import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 320, height: 568 },
  reducedMotion: "reduce",
});

test("fixed controls do not obstruct the mobile estimator", async ({ page }) => {
  await page.goto("/");

  const chatLauncher = page.getByTestId("chat-launcher");
  const stickyCta = page.getByTestId("sticky-mobile-cta");
  await expect(chatLauncher).toHaveAttribute("aria-hidden", "true");
  await expect(stickyCta).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("link", { name: "Get my quote" }).first().click();
  await expect(page.locator("#price-estimator")).toBeInViewport();
  await expect(chatLauncher).toHaveAttribute("aria-hidden", "true");
  await expect(stickyCta).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("textbox", { name: "Website" })).toHaveCount(0);

  await page.locator("#est-make").selectOption("Toyota");
  const model = page.locator("#est-model");
  await expect(model).toBeVisible();
  await model.scrollIntoViewIfNeeded();
  await expect(chatLauncher).toHaveAttribute("aria-hidden", "true");
  await expect(stickyCta).toHaveAttribute("aria-hidden", "true");
  const box = await model.boundingBox();
  expect(box).not.toBeNull();
  const topElementId = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.id,
    { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
  );
  expect(topElementId).toBe("est-model");
});
