import { expect, test } from "@playwright/test";

test("submits the homepage quote form", async ({ page }) => {
  await page.goto("/");

  await page.locator("#quote-form").scrollIntoViewIfNeeded();

  await page.locator("#quote-make").selectOption("Toyota");
  await page.locator("#quote-model").selectOption("Corolla");
  await page.locator("#quote-year").selectOption("2015");
  await page.locator("#quote-condition").selectOption("running");
  await page.locator("#quote-name").fill("Browser Monitor");
  await page.locator("#quote-phone").fill("0400000000");
  await page.locator("#quote-address").fill("1 Queen Street, Brisbane QLD 4000");
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
    page.getByRole("heading", { name: "Message sent — thanks!" }),
  ).toBeVisible();
});
