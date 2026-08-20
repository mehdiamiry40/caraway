#!/usr/bin/env node
/**
 * Notify IndexNow-participating search engines about pages whose sitemap
 * `lastmod` changed recently.
 *
 * Google does not consume IndexNow, so this speeds up Bing, Yandex, Seznam and
 * Naver only. Google discovery still comes from the sitemap and Search Console.
 *
 * Reads the built sitemap artifact rather than fetching the live site, so a
 * submission always describes the deployment that produced it. Run after
 * `npm run build`.
 */
import { readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://caraway.au";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const MAX_URLS = 10_000;

/** Only submit pages changed within this window. */
const DEFAULT_WINDOW_DAYS = 3;

function parseArgs(argv) {
  const args = { dryRun: false, windowDays: DEFAULT_WINDOW_DAYS };
  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("--days=")) {
      const value = Number(arg.slice("--days=".length));
      if (Number.isFinite(value) && value >= 0) args.windowDays = value;
    }
  }
  return args;
}

/** Pull <url><loc>/<lastmod> pairs out of the built sitemap. */
export function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap((block) => {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) return [];
    const lastmod = block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    return [{ loc, lastmod }];
  });
}

/** Entries whose lastmod falls inside the window, newest first. */
export function recentUrls(entries, windowDays, now = Date.now()) {
  const cutoff = now - windowDays * 86_400_000;
  return entries
    .flatMap((entry) => {
      if (!entry.lastmod) return [];
      const time = Date.parse(entry.lastmod);
      if (!Number.isFinite(time) || time < cutoff) return [];
      return [{ loc: entry.loc, time }];
    })
    .sort((a, b) => b.time - a.time)
    .map((entry) => entry.loc)
    .slice(0, MAX_URLS);
}

function readKey() {
  const source = readFileSync(join(process.cwd(), "src", "lib", "indexnow.ts"), "utf8");
  const key = source.match(/INDEXNOW_KEY\s*=\s*"([0-9a-f]{8,128})"/)?.[1];
  if (!key) throw new Error("Could not read INDEXNOW_KEY from src/lib/indexnow.ts");
  return key;
}

async function main() {
  const { dryRun, windowDays } = parseArgs(process.argv.slice(2));

  let xml;
  try {
    xml = readFileSync(
      join(process.cwd(), ".next", "server", "app", "sitemap.xml.body"),
      "utf8",
    );
  } catch (error) {
    console.error(
      `IndexNow: could not read the built sitemap (${error instanceof Error ? error.message : String(error)}). Run npm run build first.`,
    );
    process.exit(1);
  }

  const key = readKey();
  const urls = recentUrls(parseSitemap(xml), windowDays);

  if (urls.length === 0) {
    console.log(
      `IndexNow: no pages changed in the last ${windowDays} day(s) — nothing to submit.`,
    );
    return;
  }

  console.log(`IndexNow: submitting ${urls.length} URL(s) changed in the last ${windowDays} day(s):`);
  for (const url of urls.slice(0, 10)) console.log(`  ${url}`);
  if (urls.length > 10) console.log(`  … and ${urls.length - 10} more`);

  if (dryRun) {
    console.log("IndexNow: --dry-run set, not submitting.");
    return;
  }

  const host = new URL(SITE_URL).host;
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: urls,
    }),
  });

  // 200 accepted, 202 accepted but key still being verified. Both are fine.
  if (response.status === 200 || response.status === 202) {
    console.log(`IndexNow: accepted (HTTP ${response.status}).`);
    return;
  }

  console.error(
    `IndexNow: submission rejected (HTTP ${response.status} ${response.statusText}).`,
  );
  process.exit(1);
}

// Only run when invoked directly, so the parsers above stay unit-testable.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
