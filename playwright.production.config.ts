import { defineConfig, devices } from "@playwright/test";
import { serverEnv } from "./playwright.config";

/**
 * Browser checks that only mean something against production output.
 *
 * By default this serves the existing `npm run build` output with `next
 * start`, so the browser enforces the hashed Content-Security-Policy the build
 * wrote. Set FORM_CHECK_BASE_URL to point the same checks at a deployed site
 * instead; nothing is started locally and the checks stay read-only.
 */
const liveBaseURL = process.env.FORM_CHECK_BASE_URL?.trim();
if (liveBaseURL && !/^https:\/\/[^/]+$/.test(liveBaseURL)) {
  throw new Error("FORM_CHECK_BASE_URL must be an https origin with no path.");
}

const port = Number(process.env.PLAYWRIGHT_PRODUCTION_PORT ?? "3101");
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(
    "PLAYWRIGHT_PRODUCTION_PORT must be an integer between 1 and 65535.",
  );
}
const localBaseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e-production",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A deployed site is reached over the public network, so allow for one bad
  // connection before calling the forms broken.
  retries: process.env.CI || liveBaseURL ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: liveBaseURL ?? localBaseURL,
    trace: "retain-on-failure",
    ...(process.env.PW_CHROMIUM_EXECUTABLE
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_EXECUTABLE } }
      : {}),
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(liveBaseURL
    ? {}
    : {
        webServer: {
          command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
          url: localBaseURL,
          reuseExistingServer: false,
          // Same blanked integration settings as the dev-server suite. These
          // checks never submit a form, and must not be able to.
          env: { ...serverEnv, NODE_ENV: "production" },
          timeout: 60_000,
        },
      }),
});
