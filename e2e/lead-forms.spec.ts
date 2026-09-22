import { expect, test } from "@playwright/test";

test("submits the homepage hero quote form", async ({ page }) => {
  await page.goto("/");

  await page.locator("#quote-form").scrollIntoViewIfNeeded();

  await page.locator("#hero-quote-make").selectOption("Toyota");
  await page.locator("#hero-quote-model").selectOption("Corolla");
  await page.locator("#hero-quote-year").selectOption("2015");
  await page.locator("#hero-quote-condition").selectOption("running");
  await page.locator("#hero-quote-name").fill("Browser Monitor");
  await page.locator("#hero-quote-phone").fill("0400000000");
  await page
    .locator("#hero-quote-address")
    .fill("1 Queen Street, Brisbane QLD 4000");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.getByRole("heading", { name: "Thanks — we've got your details" }),
  ).toBeVisible();
});

// The full quote form is no longer on the home page; a service page is the
// remaining surface that carries expected price and the vehicle notes.
test("submits the full quote form on a service page", async ({ page }) => {
  await page.goto("/cash-for-cars-brisbane");

  await page.locator("#quote-form").scrollIntoViewIfNeeded();

  await page.locator("#quote-make").selectOption("Toyota");
  await page.locator("#quote-model").selectOption("Corolla");
  await page.locator("#quote-year").selectOption("2015");
  await page.locator("#quote-condition").selectOption("running");
  await page.locator("#quote-name").fill("Browser Monitor");
  await page.locator("#quote-phone").fill("0400000000");
  await page.locator("#quote-address").fill("1 Queen Street, Brisbane QLD 4000");
  await page.locator("#quote-expected-price").fill("3500");
  await page.getByRole("button", { name: "Get my quote" }).click();

  await expect(
    page.getByRole("heading", { name: "Thanks — we've got your details" }),
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
    page.getByRole("heading", { name: "Message received — thanks!" }),
  ).toBeVisible();
});
