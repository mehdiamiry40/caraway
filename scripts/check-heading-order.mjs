#!/usr/bin/env node
/**
 * Post-build accessibility gate for document outline structure.
 *
 * Reads the prerendered HTML under .next/server/app and verifies that every
 * page exposes exactly one <h1> and that the <h1> is the first heading in DOM
 * order. These are the WCAG 2.1 AA outline expectations the public
 * /accessibility page commits to, and they are only observable in the built
 * markup rather than in any single component's unit test.
 *
 * Skipped heading ranks (h1 → h3) are reported but do not fail the build. Card
 * grids and the global footer currently jump straight to <h3>, so enforcing it
 * would mean restructuring shared components rather than catching regressions.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BUILD_ROOT = join(process.cwd(), ".next", "server", "app");
const HEADING_PATTERN = /<h([1-6])\b/g;

/** Collect every prerendered HTML artifact below `dir`. */
function collectHtmlFiles(dir) {
  const found = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

/** Map a build artifact path back to the route it renders. */
function routeFor(file) {
  const route = file.slice(BUILD_ROOT.length).replace(/\.html$/, "");
  return route === "" || route === "/index" ? "/" : route;
}

function auditHeadings(route, html) {
  const levels = [...html.matchAll(HEADING_PATTERN)].map((match) =>
    Number(match[1]),
  );
  if (levels.length === 0) return { problems: [], warnings: [] };

  const problems = [];
  const warnings = [];
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
    warnings.push(`${route}: heading level skips ${skip}`);
  }

  return { problems, warnings };
}

try {
  statSync(BUILD_ROOT);
} catch {
  console.error(
    `Heading-order check needs a production build first: ${BUILD_ROOT} is missing.`,
  );
  process.exit(1);
}

const files = collectHtmlFiles(BUILD_ROOT);
if (files.length === 0) {
  console.error(`No prerendered HTML found under ${BUILD_ROOT}.`);
  process.exit(1);
}

const audited = files.map((file) =>
  auditHeadings(routeFor(file), readFileSync(file, "utf8")),
);
const failures = audited.flatMap((result) => result.problems);
const warnings = audited.flatMap((result) => result.warnings);

if (warnings.length > 0) {
  console.warn(`Heading-rank skips (not blocking) on ${warnings.length} page(s):`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
  console.warn("");
}

if (failures.length > 0) {
  console.error("Heading-order check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Heading-order check passed across ${files.length} pages.`);
