#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { request } from "node:http";
import { createServer } from "node:net";
import { join } from "node:path";

const routes = ["cash-for-cars-brisbane", "car-removal-brisbane"];
const preferredImages = new Map([
  [
    "cash-for-cars-brisbane",
    "/images/cash-for-cars-brisbane-quote-readiness-v1.jpg",
  ],
  [
    "car-removal-brisbane",
    "/images/car-removal-brisbane-access-readiness-v1.jpg",
  ],
]);
const failures = [];

for (const route of routes) {
  const artifactPath = join(
    process.cwd(),
    ".next",
    "server",
    "app",
    `${route}.html`,
  );
  let html;
  try {
    html = readFileSync(artifactPath, "utf8");
  } catch (error) {
    failures.push(
      `${route}: could not read built HTML (${error instanceof Error ? error.message : String(error)})`,
    );
    continue;
  }

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
    continue;
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
  const homeHtml = readFileSync(
    join(process.cwd(), ".next", "server", "app", "index.html"),
    "utf8",
  );
  const canonicalMatches = homeHtml.match(
    /<link rel="canonical" href="https:\/\/caraway\.au\/"/g,
  );
  const openGraphUrlMatches = homeHtml.match(
    /<meta property="og:url" content="https:\/\/caraway\.au\/"/g,
  );
  if (canonicalMatches?.length !== 1) {
    failures.push("homepage: slash-bearing canonical must appear exactly once");
  }
  if (openGraphUrlMatches?.length !== 1) {
    failures.push("homepage: slash-bearing Open Graph URL must appear exactly once");
  }
} catch (error) {
  failures.push(
    `homepage: could not read built HTML (${error instanceof Error ? error.message : String(error)})`,
  );
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
  const paperworkHtml = readFileSync(
    join(
      process.cwd(),
      ".next",
      "server",
      "app",
      "blog",
      "what-paperwork-to-sell-a-car-qld.html",
    ),
    "utf8",
  );
  if (!paperworkHtml.includes('id="qld-vehicle-sale-record-builder"')) {
    failures.push("paperwork guide: builder anchor is missing from built HTML");
  }
  if (!paperworkHtml.includes('"@type":"BlogPosting"')) {
    failures.push("paperwork guide: BlogPosting structured data is missing");
  }
  if (/"@type":"(?:Calculator|FAQPage|Product)"/.test(paperworkHtml)) {
    failures.push("paperwork guide: unsupported tool rich-result type is present");
  }
} catch (error) {
  failures.push(
    `paperwork guide: could not read built artifact (${error instanceof Error ? error.message : String(error)})`,
  );
}

try {
  const unrelatedHtml = readFileSync(
    join(
      process.cwd(),
      ".next",
      "server",
      "app",
      "blog",
      "tow-truck-cost-brisbane.html",
    ),
    "utf8",
  );
  if (unrelatedHtml.includes("qld-vehicle-sale-record-builder")) {
    failures.push("unrelated guide: paperwork builder leaked into built HTML");
  }
} catch (error) {
  failures.push(
    `unrelated guide: could not read built artifact (${error instanceof Error ? error.message : String(error)})`,
  );
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (port) resolve(port);
        else reject(new Error("Could not reserve a local port"));
      });
    });
  });
}

function fetchHeaders(port, host, path) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "GET",
        headers: {
          Host: host,
          "X-Forwarded-Host": host,
        },
      },
      (response) => {
        response.resume();
        response.once("end", () =>
          resolve({ status: response.statusCode, headers: response.headers }),
        );
      },
    );
    req.setTimeout(5_000, () => req.destroy(new Error("Request timed out")));
    req.once("error", reject);
    req.end();
  });
}

async function verifyRuntimeHostPolicy() {
  const port = await availablePort();
  const nextBinary = join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const server = spawn(
    process.execPath,
    [nextBinary, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let serverOutput = "";
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (server.exitCode !== null) break;
      try {
        const response = await fetchHeaders(
          port,
          "preview.example.vercel.app",
          "/cash-for-cars-brisbane",
        );
        if (response.status === 200) {
          ready = true;
          break;
        }
      } catch {
        // The production server is still starting.
      }
      await delay(100);
    }

    if (!ready) {
      failures.push(
        `runtime host-policy server did not start successfully: ${serverOutput.trim()}`,
      );
      return;
    }

    for (const route of routes) {
      const path = `/${route}`;
      const preview = await fetchHeaders(
        port,
        "preview.example.vercel.app",
        path,
      );
      const production = await fetchHeaders(port, "caraway.au", path);

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
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      for (let attempt = 0; attempt < 20 && server.exitCode === null; attempt += 1) {
        await delay(50);
      }
      if (server.exitCode === null) server.kill("SIGKILL");
    }
  }
}

try {
  await verifyRuntimeHostPolicy();
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
