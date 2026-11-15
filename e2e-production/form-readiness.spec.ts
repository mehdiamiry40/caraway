import { expect, test, type Page } from "@playwright/test";

/**
 * Lead forms render disabled and are switched on by client-side hydration.
 * Hydration depends on inline scripts that the Content-Security-Policy allows
 * by hash, and those hashes exist only in production output. A mismatch leaves
 * every form disabled while the dev-server suite stays green, so these checks
 * run against the built site (and, on a schedule, the deployed one).
 *
 * They are read-only: nothing is typed or submitted.
 */
const FORM_PAGES = [
  { path: "/", field: "#hero-quote-name" },
  { path: "/sell-my-car-brisbane", field: "#quote-name" },
  { path: "/locations/logan", field: "#quote-name" },
  { path: "/how-it-works", field: "#quote-name" },
  { path: "/contact", field: "#contact-name" },
] as const;

/** Collects anything the browser blocked or threw while the page was open. */
async function watchPage(page: Page) {
  const problems: string[] = [];
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(
        `[csp-violation] ${event.effectiveDirective} blocked ${event.blockedURI || "inline"} in ${event.sourceFile || "the document"}`,
      );
    });
  });
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /csp-violation|Content Security Policy/i.test(message.text())
    ) {
      problems.push(message.text());
    }
  });
  page.on("pageerror", (error) => problems.push(`uncaught: ${error.message}`));
  // A check against the deployed site must not count as a visitor.
  await page.route(/\/_vercel\/(insights|speed-insights)\//, (route) =>
    route.abort(),
  );
  return problems;
}

for (const { path, field } of FORM_PAGES) {
  test(`the form on ${path} becomes usable with no blocked scripts`, async ({
    page,
  }) => {
    const problems = await watchPage(page);
    const response = await page.goto(path, { waitUntil: "load" });

    expect(response?.status(), `${path} status`).toBe(200);
    // Without an enforced hash policy, "no violations" below proves nothing.
    const policy = response?.headers()["content-security-policy"] ?? "";
    const scriptSources = /(?:^|;)\s*script-src ([^;]*)/.exec(policy)?.[1] ?? "";
    expect(scriptSources, `${path} script-src`).toMatch(/'sha256-[A-Za-z0-9+/]{43}='/);
    expect(scriptSources, `${path} script-src`).not.toContain("'unsafe-inline'");
    expect(scriptSources, `${path} script-src`).not.toContain("'nonce-");

    // Soft, so a failure also reports what the browser blocked.
    await expect
      .soft(page.locator(field), `${path} form field`)
      .toBeEnabled({ timeout: 15_000 });
    await expect
      .soft(page.getByText("The online form is not ready yet"))
      .toHaveCount(0);
    expect(problems, `${path} blocked or failed scripts`).toEqual([]);
  });
}
