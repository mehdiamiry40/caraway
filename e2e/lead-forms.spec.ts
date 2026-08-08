import { expect, test } from "@playwright/test";

test("submits the homepage estimator lead flow", async ({ page }) => {
  await page.goto("/");

  // The estimator hydrates lazily once it approaches the viewport
  // (see LazyPriceEstimator), so bring it into view before interacting.
  await page.locator("#price-estimator").scrollIntoViewIfNeeded();

  await page.locator("#est-make").selectOption("Toyota");
  await page.locator("#est-model").selectOption("Corolla");
  await page.locator("#est-year").selectOption("2015");
  await page.locator("#est-condition").selectOption("running");
  await page.getByRole("button", { name: "See my quote" }).click();

  await expect(
    page.getByRole("button", { name: "Request buyer assessment" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Request buyer assessment" }).click();

  await page.getByLabel("Your name").fill("Browser Monitor");
  await page.getByLabel("Phone number").fill("0400000000");
  await page.getByLabel("Pickup address").fill("1 Queen Street, Brisbane QLD 4000");
  await page.getByRole("button", { name: "Request buyer assessment" }).click();

  await expect(
    page.getByRole("heading", { name: "Your offer request is in." }),
  ).toBeVisible();
});

test("submits the contact form", async ({ page }) => {
  await page.goto("/contact");

  await page.locator("#contact-name").fill("Browser Monitor");
  await page.locator("#contact-email").fill("monitor@example.com");
  await page.locator("#contact-phone").fill("0400000000");
  await page
    .locator("#contact-message")
    .fill("Synthetic browser check. No response is required.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(
    page.getByRole("heading", { name: "Message sent — thanks!" }),
  ).toBeVisible();
});
