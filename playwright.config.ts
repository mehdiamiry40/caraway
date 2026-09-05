import { defineConfig, devices } from "@playwright/test";

const testPort = Number(process.env.PLAYWRIGHT_PORT ?? "3100");
if (!Number.isInteger(testPort) || testPort < 1 || testPort > 65_535) {
  throw new Error("PLAYWRIGHT_PORT must be an integer between 1 and 65535.");
}
const testBaseURL = `http://127.0.0.1:${testPort}`;

// Playwright merges webServer.env over process.env. Blank inherited values
// first, retaining only the host settings required to run Node and Next.js.
const serverEnv: Record<string, string> = Object.fromEntries(
  Object.keys(process.env).map((key) => [key, ""]),
);
for (const key of ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "SystemRoot", "ComSpec", "PATHEXT", "WINDIR", "CI"]) {
  const value = process.env[key];
  if (value !== undefined) serverEnv[key] = value;
}
Object.assign(serverEnv, {
  // Next's documented test mode skips .env.local and .env.development.
  // Explicit blanks also override any future .env.test or .env values.
  NODE_ENV: "test",
  NEXT_TELEMETRY_DISABLED: "1",
  PLAYWRIGHT_TEST: "1",
  SITE_URL: "https://caraway.au",
  QUOTE_ENDPOINT: "",
  CONTACT_ENDPOINT: "",
  ALLOWED_ENDPOINT_HOSTS: "",
  RESEND_API_KEY: "",
  RESEND_BASE_URL: "",
  QUOTE_NOTIFICATION_FROM: "",
  QUOTE_NOTIFICATION_TO: "",
  CONTACT_NOTIFICATION_FROM: "",
  CONTACT_NOTIFICATION_TO: "",
  KV_REST_API_URL: "",
  KV_REST_API_TOKEN: "",
  KV_REST_API_READ_ONLY_TOKEN: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  GOOGLE_PLACES_API_KEY: "",
  PLACES_SESSION_SECRET: "",
  AI_GATEWAY_API_KEY: "",
  VERCEL_OIDC_TOKEN: "",
  VERCEL_ENV: "",
  CRON_SECRET: "",
});

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: testBaseURL,
    trace: "retain-on-failure",
    // Sandboxed environments can point at a pre-provisioned Chromium instead
    // of downloading one (e.g. /opt/pw-browsers/chromium). Unset in normal
    // CI, where `playwright install` provides the matching browser build.
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
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${testPort}`,
    url: testBaseURL,
    reuseExistingServer: false,
    env: serverEnv,
    timeout: 120_000,
  },
});
