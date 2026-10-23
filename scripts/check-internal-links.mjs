#!/usr/bin/env node
/**
 * Internal-link audit.
 *
 * Discovery speed depends on a page being reachable. A post that nothing links
 * to, or that is only linked from deep pagination, gets crawled late or not at
 * all — regardless of how good the sitemap is.
 *
 * Reads the HTML the production server returns so it measures the links a
 * crawler actually receives, including nav and footer, rather than what the
 * source appears to render. Pages are requested rather than read from
 * prerendered files because the document CSP nonce makes every page dynamic.
 * Run after `npm run build`.
 *
 * Two kinds of page are exempt from needing inbound links, both detected from
 * the rendered response rather than a list maintained by hand:
 *
 *   - Pages that declare their own noindex (the review handoff pages) — being
 *     unlisted is the point.
 *   - Redirect stubs such as retired URLs, which exist to catch old inbound
 *     links and forward them. Linking to one from the site would be a
 *     deliberate extra hop.
 */
import { sep } from "node:path";
import {
  documentPaths,
  fetchLocal,
  pooled,
  withProductionServer,
} from "./production-documents.mjs";

const SITE_URL = "https://caraway.au";

/** Deep pagination is crawled rarely, so it is a weak discovery path. */
const PAGINATION = /^\/blog\/page\/\d+$/;

/** `.next/server/app/blog/category/guides.html` -> `/blog/category/guides` */
export function routeForFile(relativePath) {
  const withoutExtension = relativePath.slice(0, -".html".length);
  const segments = withoutExtension.split(sep);
  if (segments.length === 1 && segments[0] === "index") return "/";
  return `/${segments.join("/")}`;
}

/** Normalise an href to a site-relative path, or null if it is not internal. */
export function internalPath(href) {
  if (!href || href.startsWith("#")) return null;

  let path;
  if (href.startsWith("/")) {
    path = href;
  } else if (href.startsWith(`${SITE_URL}/`) || href === SITE_URL) {
    path = href.slice(SITE_URL.length) || "/";
  } else {
    return null;
  }

  // Query strings and fragments address the same document for crawl purposes.
  path = path.split("#")[0].split("?")[0];
  if (path === "") return "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** Anchor hrefs only. Next also embeds URLs in its RSC payload scripts, which
 *  are not links a crawler can follow. */
export function extractLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)]
    .map((match) => internalPath(match[1]))
    .filter((path) => path !== null);
}

export function isNoindex(html) {
  return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
}

/**
 * A prerendered redirect still emits an .html artifact, so the status lives in
 * the .meta sidecar next to it. Anything 3xx never serves that HTML.
 */
export function redirectStatusFromMeta(metaContents) {
  if (metaContents === null) return null;
  try {
    const status = JSON.parse(metaContents).status;
    return typeof status === "number" && status >= 300 && status < 400
      ? status
      : null;
  } catch {
    return null;
  }
}

/**
 * Split the link graph into the two findings that matter for discovery.
 *
 * `pages` maps a route to `{ links: Set<string>, noindex: boolean }`. The home
 * page is never an orphan — it is the crawl entry point.
 */
export function analyze(pages) {
  const inbound = new Map([...pages.keys()].map((route) => [route, new Set()]));
  for (const [from, page] of pages) {
    for (const to of page.links) {
      // Self-links are not discovery, and links off the built graph are not
      // ours to police.
      if (to !== from && inbound.has(to)) inbound.get(to).add(from);
    }
  }

  const indexable = [...pages.entries()].filter(([, page]) => !page.noindex);

  const orphans = indexable
    .filter(([route]) => route !== "/" && inbound.get(route).size === 0)
    .map(([route]) => route);

  const paginationOnly = indexable
    .filter(([route]) => {
      const sources = inbound.get(route);
      return (
        sources.size > 0 && [...sources].every((source) => PAGINATION.test(source))
      );
    })
    .map(([route]) => route);

  return { orphans, paginationOnly };
}

async function main() {
  let paths;
  try {
    paths = documentPaths();
  } catch (error) {
    console.error(
      `Internal-link audit could not list documents (${error instanceof Error ? error.message : String(error)}). Run npm run build first.`,
    );
    process.exit(1);
  }

  const pages = new Map();
  const redirects = [];
  const failures = [];
  try {
    await withProductionServer(async (port) => {
      await pooled(paths, 6, async (path) => {
        const response = await fetchLocal(port, path);
        if (response.status >= 300 && response.status < 400) {
          redirects.push(path);
          return;
        }
        if (response.status !== 200 || response.truncated) {
          failures.push(
            `${path}: rendered document returned HTTP ${response.status}${response.truncated ? " truncated" : ""}`,
          );
          return;
        }
        pages.set(path, {
          links: new Set(extractLinks(response.body)),
          noindex: isNoindex(response.body),
        });
      });
    });
  } catch (error) {
    console.error(
      `Internal-link audit could not render documents (${error instanceof Error ? error.message : String(error)}).`,
    );
    process.exit(1);
  }

  if (failures.length > 0) {
    console.error("Internal-link audit could not read every document:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  if (pages.size === 0) {
    console.error("Internal-link audit found no built pages. Run npm run build first.");
    process.exit(1);
  }

  const { orphans, paginationOnly } = analyze(pages);

  if (paginationOnly.length > 0) {
    console.warn(
      `Reachable only from paginated archives (not blocking) — ${paginationOnly.length} page(s):`,
    );
    for (const route of paginationOnly.sort()) console.warn(`  - ${route}`);
    console.warn(
      "  These are crawled infrequently. A link from a hub or a related-posts block discovers them sooner.\n",
    );
  }

  if (orphans.length > 0) {
    console.error(
      `Internal-link audit failed — ${orphans.length} indexable page(s) with no inbound internal link:`,
    );
    for (const route of orphans.sort()) console.error(`  - ${route}`);
    console.error(
      "\nNothing links to these, so a crawler can only reach them through the sitemap.\nLink them from a relevant page, or mark them noindex if being unlisted is intended.",
    );
    process.exit(1);
  }

  const exempt = [...pages.values()].filter((page) => page.noindex).length;
  console.log(
    `Internal-link audit passed across ${pages.size} built page(s) — ${exempt} noindex and ${redirects.length} redirect page(s) exempt from needing inbound links.`,
  );
}

if (process.argv[1] && process.argv[1].endsWith("check-internal-links.mjs")) {
  await main();
}
