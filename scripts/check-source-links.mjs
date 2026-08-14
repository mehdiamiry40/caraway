#!/usr/bin/env node
/**
 * Citation-rot gate for the primary sources behind regulated claims.
 *
 * Every blog post that carries `reviewedAt` also carries a `sources` list, and
 * those URLs are the evidence for Queensland registration, towing, write-off
 * and PPSR guidance. A silently moved or retired government page leaves the
 * claim standing with no support behind it, which no unit test can detect —
 * they only pin the strings.
 *
 * Requires outbound network access, so it is a separate gate rather than part
 * of `npm run lint`: sandboxes without egress should skip it, not fail it.
 *
 * Usage:
 *   node scripts/check-source-links.mjs            # fail on dead sources
 *   node scripts/check-source-links.mjs --report   # print a table, always exit 0
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const POSTS_DIR = join(process.cwd(), "src", "content", "blog", "posts");
const DATA_DIR = join(process.cwd(), "src", "data");
const REPORT_ONLY = process.argv.includes("--report");
const TIMEOUT_MS = 30_000;
const CONCURRENCY = 6;

/** Some government hosts reject HEAD outright; fall back to a ranged GET. */
async function probe(url) {
  const attempt = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: {
          // Several qld.gov.au endpoints 403 an empty or bot-shaped UA.
          "user-agent":
            "Mozilla/5.0 (compatible; caraway-source-check/1.0; +https://caraway.au)",
          accept: "text/html,application/xhtml+xml,*/*",
          ...(method === "GET" ? { range: "bytes=0-2047" } : {}),
        },
      });
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    const head = await attempt("HEAD");
    if (head.status < 400) {
      return { status: head.status, finalUrl: head.url };
    }
    // 403/405 from a HEAD is usually method policy, not a dead page.
    const get = await attempt("GET");
    return { status: get.status, finalUrl: get.url };
  } catch (error) {
    return {
      status: 0,
      finalUrl: url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Pull every `url: "..."` inside a `sources: [...]` block. */
function extractSources(source, label) {
  const found = [];
  const block = source.match(/sources:\s*\[([\s\S]*?)\n\s*\],/);
  if (!block) return found;
  for (const match of block[1].matchAll(/url:\s*"([^"]+)"/g)) {
    found.push({ url: match[1], cite: label });
  }
  return found;
}

const citations = [];

for (const file of readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  citations.push(
    ...extractSources(readFileSync(join(POSTS_DIR, file), "utf8"), file),
  );
}

// The open-data resource cites its licence and catalogue pages the same way.
for (const file of readdirSync(DATA_DIR)) {
  if (!file.endsWith(".json")) continue;
  const raw = readFileSync(join(DATA_DIR, file), "utf8");
  for (const match of raw.matchAll(/"(?:pageUrl|licenseUrl)":\s*"([^"]+)"/g)) {
    citations.push({ url: match[1], cite: file });
  }
}

/** Same URL cited from several posts only needs one request. */
const byUrl = new Map();
for (const { url, cite } of citations) {
  if (!byUrl.has(url)) byUrl.set(url, new Set());
  byUrl.get(url).add(cite);
}

const urls = [...byUrl.keys()].sort();
if (urls.length === 0) {
  console.error("No source URLs found — the extractor is probably stale.");
  process.exit(1);
}

console.log(`Checking ${urls.length} cited source URLs…\n`);

const results = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      results.push({ url, ...(await probe(url)) });
    }
  }),
);
results.sort((a, b) => a.url.localeCompare(b.url));

/**
 * Only a definitive "this page is gone" counts as citation rot. Government
 * hosts routinely answer 403/429 to datacenter IPs and agent proxies, and a
 * 5xx is someone else's outage — neither is evidence the citation is wrong.
 */
function classify(status) {
  if (status === 0) return "unreachable";
  if (status === 404 || status === 410) return "dead";
  if (status >= 500) return "transient";
  if (status >= 400) return "blocked";
  return "live";
}

const buckets = { live: [], dead: [], blocked: [], transient: [], unreachable: [] };
const redirected = [];

for (const result of results) {
  const citedBy = [...byUrl.get(result.url)].join(", ");
  const kind = classify(result.status);
  buckets[kind].push({ ...result, citedBy });

  const label = result.status === 0 ? "---" : String(result.status);
  if (kind === "live") {
    const from = result.url.replace(/\/$/, "");
    const to = (result.finalUrl ?? result.url).replace(/\/$/, "");
    if (to !== from) redirected.push({ ...result, citedBy });
    console.log(`  ${label} ${result.url}`);
  } else {
    console.log(`  ${label} ${result.url}\n      [${kind}] cited by ${citedBy}`);
  }
}

// A uniform non-live result across many unrelated hosts is the network telling
// us it blocked the run, not 59 simultaneous government link rewrites.
const reachable = buckets.live.length;
const environmentBlocked = reachable === 0 && results.length > 1;

if (redirected.length > 0) {
  console.log(`\n${redirected.length} source(s) redirect — consider citing the final URL:`);
  for (const result of redirected) {
    console.log(`  ${result.url}\n    → ${result.finalUrl}`);
  }
}

console.log(
  `\nlive ${buckets.live.length} · dead ${buckets.dead.length} · ` +
    `blocked ${buckets.blocked.length} · transient ${buckets.transient.length} · ` +
    `unreachable ${buckets.unreachable.length}`,
);

if (environmentBlocked) {
  console.log(
    "\nNo source resolved from this environment, so the run proves nothing " +
      "about citation health. Skipping — run it somewhere with egress.",
  );
  process.exit(0);
}

if (buckets.blocked.length > 0 || buckets.transient.length > 0) {
  console.log(
    `\n${buckets.blocked.length + buckets.transient.length} source(s) refused ` +
      `this client or errored. Not treated as rot — recheck by hand if it persists.`,
  );
}

if (buckets.dead.length > 0) {
  console.error(`\n${buckets.dead.length} cited source(s) are gone (404/410):`);
  for (const result of buckets.dead) {
    console.error(`  ${result.status} ${result.url}\n    cited by ${result.citedBy}`);
  }
  console.error(
    "\nUpdate the citation to the page that replaced it, or remove the claim " +
      "it supports. Do not repoint a source without rereading it.",
  );
  if (!REPORT_ONLY) process.exit(1);
} else {
  console.log(`\nSource-link check passed: ${reachable} live, no dead citations.`);
}
