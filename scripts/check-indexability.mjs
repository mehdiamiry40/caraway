#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fetchLocal, withProductionServer } from "./production-documents.mjs";

const routes = ["sell-my-car-brisbane", "car-removal-brisbane"];
const preferredImages = new Map([
  [
    "sell-my-car-brisbane",
    "/images/cash-for-cars-quote-readiness-v1.jpg",
  ],
  [
    "car-removal-brisbane",
    "/images/car-removal-brisbane-access-readiness-v1.jpg",
  ],
]);
const failures = [];

function auditServicePage(route, html) {
  const canonical = `https://caraway.au/${route}`;
  const preferredImage = preferredImages.get(route);
  const absoluteImage = preferredImage
    ? `https://caraway.au${preferredImage}`
    : undefined;
  if (/name="robots" content="[^"]*noindex/i.test(html)) {
    failures.push(`${route}: built artifact contains a noindex robots meta tag`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    failures.push(`${route}: canonical link is missing or incorrect`);
  }
  if (!html.includes('"@type":"WebPage"')) {
    failures.push(`${route}: WebPage structured data is missing`);
  }
  if (!html.includes(`"mainEntity":{"@id":"${canonical}#service"}`)) {
    failures.push(`${route}: WebPage does not identify its Service main entity`);
  }
  if (!preferredImage || !absoluteImage) {
    failures.push(`${route}: preferred-image policy is not configured`);
    return;
  }
  if (!html.includes(preferredImage)) {
    failures.push(`${route}: visible or metadata image is missing from built HTML`);
  }
  if (!html.includes('"primaryImageOfPage":{"@type":"ImageObject"')) {
    failures.push(`${route}: WebPage primaryImageOfPage is missing`);
  }
  if (!html.includes(`"image":"${absoluteImage}"`)) {
    failures.push(`${route}: Service image does not match the preferred image`);
  }
  if (html.includes("qld-vehicle-sale-record-builder")) {
    failures.push(`${route}: paperwork builder leaked onto a money page`);
  }
}

for (const route of routes) {
  const preferredImage = preferredImages.get(route);
  if (!preferredImage) continue;
  try {
    const asset = readFileSync(
      join(process.cwd(), "public", preferredImage.replace(/^\//, "")),
    );
    if (asset.byteLength < 50_000 || asset.byteLength > 250_000) {
      failures.push(
        `${route}: preferred image is outside the 50–250 KB crawl/performance budget`,
      );
    }
  } catch (error) {
    failures.push(
      `${route}: preferred image asset is unreadable (${error instanceof Error ? error.message : String(error)})`,
    );
  }
}

try {
  const robots = readFileSync(
    join(process.cwd(), ".next", "server", "app", "robots.txt.body"),
    "utf8",
  );
  if (!robots.includes("Allow: /") || !robots.includes("Sitemap: https://caraway.au/sitemap.xml")) {
    failures.push("robots.txt does not expose the canonical crawl and sitemap policy");
  }
} catch (error) {
  failures.push(
    `robots.txt: could not read built artifact (${error instanceof Error ? error.message : String(error)})`,
  );
}

try {
  const sitemap = readFileSync(
    join(process.cwd(), ".next", "server", "app", "sitemap.xml.body"),
    "utf8",
  );
  for (const [route, preferredImage] of preferredImages) {
    const absoluteImage = `https://caraway.au${preferredImage}`;
    if (!sitemap.includes(`<image:loc>${absoluteImage}</image:loc>`)) {
      failures.push(`${route}: preferred image is missing from sitemap.xml`);
    }
  }
} catch (error) {
  failures.push(
    `sitemap.xml: could not read built artifact (${error instanceof Error ? error.message : String(error)})`,
  );
}

try {
  await withProductionServer(async (port) => {
    for (const route of routes) {
      const response = await fetchLocal(port, `/${route}`);
      if (response.status !== 200) {
        failures.push(`${route}: rendered document returned HTTP ${response.status}`);
      } else {
        auditServicePage(route, response.body);
      }
    }

    const home = await fetchLocal(port, "/");
    if (home.status !== 200) {
      failures.push(`homepage: rendered document returned HTTP ${home.status}`);
    } else {
      const canonicalMatches = home.body.match(
        /<link rel="canonical" href="https:\/\/caraway\.au\/"/g,
      );
      const openGraphUrlMatches = home.body.match(
        /<meta property="og:url" content="https:\/\/caraway\.au\/"/g,
      );
      if (canonicalMatches?.length !== 1) {
        failures.push("homepage: slash-bearing canonical must appear exactly once");
      }
      if (openGraphUrlMatches?.length !== 1) {
        failures.push("homepage: slash-bearing Open Graph URL must appear exactly once");
      }
    }

    const paperwork = await fetchLocal(port, "/blog/what-paperwork-to-sell-a-car-qld");
    if (paperwork.status !== 200) {
      failures.push(
        `paperwork guide: rendered document returned HTTP ${paperwork.status}`,
      );
    } else {
      if (!paperwork.body.includes('id="qld-vehicle-sale-record-builder"')) {
        failures.push("paperwork guide: builder anchor is missing from built HTML");
      }
      if (!paperwork.body.includes('"@type":"BlogPosting"')) {
        failures.push("paperwork guide: BlogPosting structured data is missing");
      }
      if (/"@type":"(?:Calculator|FAQPage|Product)"/.test(paperwork.body)) {
        failures.push("paperwork guide: unsupported tool rich-result type is present");
      }
    }

    const unrelated = await fetchLocal(port, "/blog/tow-truck-cost-brisbane");
    if (unrelated.status !== 200) {
      failures.push(
        `unrelated guide: rendered document returned HTTP ${unrelated.status}`,
      );
    } else if (unrelated.body.includes("qld-vehicle-sale-record-builder")) {
      failures.push("unrelated guide: paperwork builder leaked into built HTML");
    }

    for (const route of routes) {
      const path = `/${route}`;
      const preview = await fetchLocal(port, path, "preview.example.vercel.app");
      const production = await fetchLocal(port, path);

      if (preview.status !== 200) {
        failures.push(`${route}: preview host returned HTTP ${preview.status}`);
      }
      if (production.status !== 200) {
        failures.push(`${route}: canonical host returned HTTP ${production.status}`);
      }
      if (preview.headers["x-robots-tag"] !== "noindex, nofollow") {
        failures.push(`${route}: preview host is missing its noindex response header`);
      }
      if (production.headers["x-robots-tag"] !== undefined) {
        failures.push(`${route}: canonical host received an unexpected noindex header`);
      }
    }
  });
} catch (error) {
  failures.push(
    `runtime host-policy check failed (${error instanceof Error ? error.message : String(error)})`,
  );
}

if (failures.length > 0) {
  console.error("Indexability artifact check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Indexability checks passed for the homepage, both primary service pages, their preferred images, robots.txt, preview hosts, and the canonical host.",
);
