#!/usr/bin/env node
/**
 * Post-build accessibility gate for document outline structure.
 *
 * Loads each document from the production server and verifies that every
 * page exposes exactly one <h1> and that the <h1> is the first heading in DOM
 * order. These are the WCAG 2.1 AA outline expectations the public
 * /accessibility page commits to, and they are only observable in the built
 * markup rather than in any single component's unit test.
 *
 * Pages are requested from the production server. Skipped heading ranks (for
 * example, h1 → h3) fail the build. Shared card grids and navigation labels
 * are structured so every public page can maintain a continuous outline
 * without changing its visual hierarchy.
 */
import { statSync } from "node:fs";
import { join } from "node:path";
import {
  documentPaths,
  fetchLocal,
  pooled,
  withProductionServer,
} from "./production-documents.mjs";

const BUILD_ROOT = join(process.cwd(), ".next", "server", "app");
const HEADING_PATTERN = /<h([1-6])\b/g;

function auditHeadings(route, html) {
  const levels = [...html.matchAll(HEADING_PATTERN)].map((match) =>
    Number(match[1]),
  );
  if (levels.length === 0) return { problems: [] };

  const problems = [];
  const h1Count = levels.filter((level) => level === 1).length;

  if (h1Count === 0) {
    problems.push(`${route}: no <h1> in the rendered document`);
  } else if (h1Count > 1) {
    problems.push(`${route}: ${h1Count} <h1> elements, expected exactly one`);
  }

  const firstH1 = levels.indexOf(1);
  if (firstH1 > 0) {
    problems.push(
      `${route}: <h${levels[0]}> precedes the <h1> (order: ${levels
        .slice(0, firstH1 + 1)
        .map((level) => `h${level}`)
        .join(" → ")})`,
    );
  }

  const skips = new Set();
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] - levels[i - 1] > 1) {
      skips.add(`h${levels[i - 1]} → h${levels[i]}`);
    }
  }
  for (const skip of skips) {
    problems.push(`${route}: heading level skips ${skip}`);
  }

  return { problems };
}

try {
  statSync(BUILD_ROOT);
} catch {
  console.error(
    `Heading-order check needs a production build first: ${BUILD_ROOT} is missing.`,
  );
  process.exit(1);
}

let paths;
try {
  paths = documentPaths();
} catch (error) {
  console.error(
    `Heading-order check could not list documents (${error instanceof Error ? error.message : String(error)}).`,
  );
  process.exit(1);
}

if (paths.length === 0) {
  console.error("Heading-order check found no documents to render.");
  process.exit(1);
}

const failures = [];
let audited = 0;
try {
  await withProductionServer(async (port) => {
    await pooled(paths, 6, async (path) => {
      const response = await fetchLocal(port, path);
      // A redirect never serves this URL's document. The destination is audited
      // when it is a real page.
      if (response.status >= 300 && response.status < 400) return;
      if (response.truncated) {
        failures.push(`${path}: rendered document exceeded the size limit`);
        return;
      }
      if (response.status !== 200) {
        failures.push(`${path}: rendered document returned HTTP ${response.status}`);
        return;
      }
      audited += 1;
      failures.push(...auditHeadings(path, response.body).problems);
    });
  });
} catch (error) {
  failures.push(
    `heading-order server failed (${error instanceof Error ? error.message : String(error)})`,
  );
}

if (failures.length > 0) {
  console.error("Heading-order check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Heading-order check passed across ${audited} pages.`);
