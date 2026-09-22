import { expect, test } from "@playwright/test";

test("a permanent chat limit offers a working new conversation", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "conversation limit reached",
        code: "conversation_limit_reached",
      }),
    }),
  );
  await page.goto("/about");
  await page.getByRole("button", { name: "Ask Caraway", exact: true }).click();
  const input = page.locator("#caraway-chat-input");
  await input.fill("Synthetic chat question");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const reset = page.getByRole("button", {
    name: "Start a new chat",
    exact: true,
  });
  await expect(reset).toBeVisible();
  await expect(input).toBeDisabled();
  await reset.click();
  await expect(input).toBeEnabled();
  await expect(input).toBeFocused();
  await expect(
    page.getByText("Synthetic chat question", { exact: true }),
  ).toHaveCount(0);
});

test("known surrounding suburbs resolve and zero results are announced", async ({
  page,
}) => {
  await page.goto("/locations");
  const search = page.getByRole("searchbox", { name: "Search suburbs" });
  await search.fill("Indooroopilly");
  await expect(
    page.locator('main a[href="/locations/toowong"]').first(),
  ).toBeVisible();
  await expect(page.getByText(/No suburbs match/)).toHaveCount(0);
  await search.fill("Not-a-real-suburb");
  await expect(page.getByRole("status")).toContainText("0");
});

// One lead form per page: the hero form on the home page, the contact form on
// /contact. Pinning the count catches a form that stopped rendering as well as
// one that degrades wrongly.
for (const [path, expectedForms] of [
  ["/", 1],
  ["/contact", 1],
] as const) {
  test(`no-JavaScript ${path} keeps form values out of URLs`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${baseURL}${path}`);
    // Every lead form on the page has to degrade the same way.
    const forms = page.locator("form");
    await expect(forms).toHaveCount(expectedForms);
    for (let i = 0; i < expectedForms; i++) {
      const form = forms.nth(i);
      await expect(form).toHaveAttribute("method", "post");
      await expect(form).toHaveAttribute("action", "/api/forms/unavailable");
      await expect(form.locator("fieldset")).toHaveAttribute("disabled", "");
      await expect(form.locator('button[type="submit"]')).toBeDisabled();
      await expect(form.getByRole("link", { name: /call 0481/i })).toBeVisible();
    }
    const response = await request.post("/api/forms/unavailable", {
      form: {
        name: "Synthetic fixture",
        email: "fixture@example.com",
        message: "Private synthetic content",
      },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe("/form-unavailable");
    expect(await response.text()).not.toContain("Private synthetic content");
    await page.goto(`${baseURL}${response.headers().location}`);
    await expect(
      page.getByRole("heading", { name: "Please contact us directly" }),
    ).toBeVisible();
    expect(new URL(page.url()).search).toBe("");
    await context.close();
  });
}

test("an unresolved enquiry keeps its ID when details change", async ({
  page,
}) => {
  const ids: string[] = [];
  await page.route("**/api/forms/submission-id", async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    ids.push(body.id);
    await route.fulfill({ response });
  });
  let submissions = 0;
  await page.route("**/contact", async (route) => {
    if (route.request().method() === "POST") {
      submissions++;
      await route.abort("failed");
      return;
    }
    await route.continue();
  });
  await page.goto("/contact");
  await page.locator("#contact-name").fill("Synthetic fixture");
  await page.locator("#contact-email").fill("fixture@example.com");
  await page.locator("#contact-message").fill("Synthetic enquiry");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator('form [role="alert"]')).toContainText(/couldn't/i);
  const saved = await page.evaluate(() =>
    sessionStorage.getItem("caraway:submission:contact"),
  );
  await page
    .locator("#contact-message")
    .fill("Synthetic enquiry with corrected details");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect.poll(() => submissions).toBe(2);
  expect(ids).toHaveLength(1);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("caraway:submission:contact"),
    ),
  ).toBe(saved);
});
