#!/usr/bin/env node
/**
 * Production-like SEO crawl.
 *
 * Starts the built app with `next start`, loads the generated sitemap, and
 * checks the HTTP contract a crawler receives: every submitted URL is a direct
 * indexable 200 with a self-canonical, every emitted same-site link/asset is a
 * direct 200, and the Search Console legacy aliases stay on permanent
 * redirects to their final canonical pages.
 *
 * Run after `npm run build`.
 */
import { spawn } from "node:child_process";
import { request } from "node:http";
import { createServer } from "node:net";
import { join } from "node:path";

const SITE_ORIGIN = "https://caraway.au";
const CANONICAL_HOST = "caraway.au";
const WWW_HOST = "www.caraway.au";
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const CONCURRENCY = 8;

const legacyRedirects = new Map([
  ["/cash-for-cars-sunnybank.html", "/locations/moorooka"],
  [
    "/blog/old-car-running-costs.html",
    "/blog/repair-or-sell-your-car-brisbane",
  ],
  [
    "/blog/cash-for-cars-vs-dealer-trade-in.html",
    "/blog/how-to-sell-your-car-for-cash-brisbane",
  ],
  ["/english-privacy-policy", "/privacy"],
]);

const staleBuildTokens = [
  "e8f2fbee2754df70-s.p.1dqa_6e_ad4sj.woff2",
  "0n5rfwhd6ymvc.js",
  "0a5-qg-ovmoyp.js",
  "0md87rw18oj9s.js",
  "a218039a3287bcfd-s.p.17-1enzs_j91b.woff2",
  "0co2gjqf7e03u.js",
];

const failures = [];

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attributes(tag) {
  const result = new Map();
  for (const match of tag.matchAll(/\b([\w:-]+)\s*=\s*(["'])(.*?)\2/gis)) {
    result.set(match[1].toLowerCase(), decodeEntities(match[3]));
  }
  return result;
}

function canonicalFromHtml(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const rel = (attrs.get("rel") ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) return attrs.get("href") ?? null;
  }
  return null;
}

function hasNoindex(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (
      (attrs.get("name") ?? "").toLowerCase() === "robots" &&
      /(?:^|,)\s*noindex\b/i.test(attrs.get("content") ?? "")
    ) {
      return true;
    }
  }
  return false;
}

function internalUrl(raw, baseUrl) {
  if (!raw || raw.startsWith("#")) return null;
  if (/^(?:data|mailto|tel|javascript):/i.test(raw)) return null;
  try {
    const url = new URL(raw, baseUrl);
    if (url.protocol !== "https:" || url.hostname !== CANONICAL_HOST) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function emittedInternalUrls(html, pageUrl) {
  const urls = [];
  for (const match of html.matchAll(/<(a|img|link|script|source)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    for (const name of ["href", "src"]) {
      const url = internalUrl(attrs.get(name), pageUrl);
      if (url) urls.push(url);
    }
    const srcset = attrs.get("srcset");
    if (srcset) {
      for (const candidate of srcset.split(",")) {
        const url = internalUrl(candidate.trim().split(/\s+/)[0], pageUrl);
        if (url) urls.push(url);
      }
    }
  }
  return urls;
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

function fetchLocal(port, path, host = CANONICAL_HOST) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "GET",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          Host: host,
          "User-Agent": "Caraway-CI-SEO-Crawl/1.0",
          "X-Forwarded-Host": host,
          "X-Forwarded-Proto": "https",
        },
      },
      (response) => {
        const chunks = [];
        let size = 0;
        response.on("data", (chunk) => {
          size += chunk.length;
          if (size <= MAX_BODY_BYTES) chunks.push(chunk);
        });
        response.once("end", () =>
          resolve({
            status: response.statusCode ?? 0,
            headers: response.headers,
            body: Buffer.concat(chunks).toString("utf8"),
            truncated: size > MAX_BODY_BYTES,
          }),
        );
      },
    );
    req.setTimeout(15_000, () => req.destroy(new Error("Request timed out")));
    req.once("error", reject);
    req.end();
  });
}

function pathFor(url) {
  return `${url.pathname}${url.search}`;
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map(
    (match) => decodeEntities(match[1].trim()),
  );
}

async function pooled(items, task) {
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor];
      cursor += 1;
      await task(item);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
}

async function waitUntilReady(port, server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) return false;
    try {
      const response = await fetchLocal(port, "/sitemap.xml");
      if (response.status === 200) return true;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

async function verifyRedirects(port) {
  for (const [source, destination] of legacyRedirects) {
    const apex = await fetchLocal(port, source);
    if (apex.status !== 308 || apex.headers.location !== destination) {
      failures.push(
        `${source}: canonical-host redirect was ${apex.status} → ${apex.headers.location ?? "(no location)"}; expected 308 → ${destination}`,
      );
    }

    const www = await fetchLocal(port, source, WWW_HOST);
    const expectedWww = `${SITE_ORIGIN}${destination}`;
    if (www.status !== 308 || www.headers.location !== expectedWww) {
      failures.push(
        `${WWW_HOST}${source}: redirect was ${www.status} → ${www.headers.location ?? "(no location)"}; expected 308 → ${expectedWww}`,
      );
    }
  }

  const wwwService = await fetchLocal(port, "/services", WWW_HOST);
  if (
    wwwService.status !== 308 ||
    wwwService.headers.location !== `${SITE_ORIGIN}/services`
  ) {
    failures.push(
      `${WWW_HOST}/services: redirect was ${wwwService.status} → ${wwwService.headers.location ?? "(no location)"}; expected 308 → ${SITE_ORIGIN}/services`,
    );
  }
}

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

let submittedCount = 0;
let emittedCount = 0;

try {
  if (!(await waitUntilReady(port, server))) {
    failures.push(
      `production crawl server did not start successfully: ${serverOutput.trim()}`,
    );
  } else {
    const sitemapResponse = await fetchLocal(port, "/sitemap.xml");
    const submitted = sitemapUrls(sitemapResponse.body);
    submittedCount = submitted.length;

    if (submitted.length === 0) {
      failures.push("sitemap.xml contains no submitted URLs");
    }
    if (new Set(submitted).size !== submitted.length) {
      failures.push("sitemap.xml contains duplicate URLs");
    }

    const emitted = new Map();
    await pooled(submitted, async (value) => {
      let url;
      try {
        url = new URL(value);
      } catch {
        failures.push(`sitemap.xml contains an invalid URL: ${value}`);
        return;
      }
      if (url.origin !== SITE_ORIGIN) {
        failures.push(`sitemap URL is not on the canonical origin: ${value}`);
        return;
      }

      let response;
      try {
        response = await fetchLocal(port, pathFor(url));
      } catch (error) {
        failures.push(
          `${value}: request failed (${error instanceof Error ? error.message : String(error)})`,
        );
        return;
      }
      if (response.status !== 200) {
        failures.push(`${value}: sitemap URL returned HTTP ${response.status}`);
        return;
      }
      if (!String(response.headers["content-type"] ?? "").includes("text/html")) {
        failures.push(`${value}: sitemap URL did not return HTML`);
        return;
      }
      if (response.truncated) {
        failures.push(`${value}: HTML exceeded the ${MAX_BODY_BYTES} byte crawl limit`);
        return;
      }

      const canonical = canonicalFromHtml(response.body);
      if (canonical !== value) {
        failures.push(
          `${value}: canonical is ${canonical ?? "missing"}; expected ${value}`,
        );
      }
      if (hasNoindex(response.body)) {
        failures.push(`${value}: sitemap page contains a noindex directive`);
      }
      if (response.body.includes("https://www.caraway.au")) {
        failures.push(`${value}: emitted HTML references the non-canonical www host`);
      }
      for (const token of staleBuildTokens) {
        if (response.body.includes(token)) {
          failures.push(`${value}: emitted HTML references stale build asset ${token}`);
        }
      }

      for (const internal of emittedInternalUrls(response.body, value)) {
        emitted.set(internal.href, internal);
      }
    });

    const emittedUrls = [...emitted.values()];
    emittedCount = emittedUrls.length;
    await pooled(emittedUrls, async (url) => {
      try {
        const response = await fetchLocal(port, pathFor(url));
        if (response.status !== 200) {
          failures.push(
            `${url.href}: emitted same-site target returned HTTP ${response.status}`,
          );
        }
      } catch (error) {
        failures.push(
          `${url.href}: emitted same-site request failed (${error instanceof Error ? error.message : String(error)})`,
        );
      }
    });

    await verifyRedirects(port);
  }
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    for (let attempt = 0; attempt < 30 && server.exitCode === null; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}

if (failures.length > 0) {
  console.error("Production SEO crawl failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Production SEO crawl passed: ${submittedCount} sitemap page(s), ${emittedCount} unique emitted same-site target(s), and ${legacyRedirects.size + 1} Search Console redirect contract(s).`,
);
