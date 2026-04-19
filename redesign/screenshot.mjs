import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:4301";
const OUT = path.resolve("redesign/screenshots");

const routes = [
  { slug: "home", path: "/" },
  { slug: "service", path: "/cash-for-cars-brisbane" },
  { slug: "suburb", path: "/locations/north-brisbane" },
  { slug: "locations", path: "/locations" },
  { slug: "about", path: "/about" },
  { slug: "contact", path: "/contact" },
  { slug: "faq", path: "/faq" },
  { slug: "blog", path: "/blog" },
  { slug: "blog-post", path: "/blog/sell-accident-car-brisbane" },
  { slug: "privacy", path: "/privacy" },
  { slug: "terms", path: "/terms" },
];

const viewports = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
  { name: "tablet", width: 834, height: 1194, deviceScaleFactor: 2 },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 2 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const r of routes) {
    const url = BASE + r.path;
    process.stdout.write(`[${vp.name}] ${r.slug} ${r.path} ... `);
    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });
      if (!response || !response.ok()) {
        process.stdout.write(`! ${response?.status()}\n`);
        continue;
      }
      await page.waitForTimeout(500);
      const file = path.join(OUT, `${r.slug}.${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      process.stdout.write("ok\n");
    } catch (err) {
      process.stdout.write(`x ${err.message}\n`);
    }
  }

  await context.close();
}

await browser.close();
console.log("Done.");
