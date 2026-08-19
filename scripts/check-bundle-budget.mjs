#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const statsPath = join(
  process.cwd(),
  ".next",
  "diagnostics",
  "route-bundle-stats.json",
);

const defaultBudget = 1_250_000;

// The Payload admin panel is a private authoring tool behind a login, not a
// page Google measures. Its bundle is Payload's to size, not ours, so it is
// excluded rather than given an inflated budget that would hide regressions.
const exemptRoutes = new Set(["/admin/[[...segments]]"]);

const routeBudgets = new Map([
  ["/", 1_200_000],
  ["/contact", 1_200_000],
  ["/locations/[slug]", 1_200_000],
  ["/[slug]", 1_200_000],
]);

let stats;
try {
  stats = JSON.parse(readFileSync(statsPath, "utf8"));
} catch (error) {
  console.error(
    `Bundle budget check could not read ${statsPath}. Run npm run build first.`,
  );
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (!Array.isArray(stats)) {
  console.error("Bundle budget stats have an unexpected format.");
  process.exit(1);
}

const failures = [];
for (const entry of stats) {
  if (
    typeof entry?.route !== "string" ||
    typeof entry?.firstLoadUncompressedJsBytes !== "number"
  ) {
    continue;
  }

  if (exemptRoutes.has(entry.route)) {
    continue;
  }

  const budget = routeBudgets.get(entry.route) ?? defaultBudget;
  if (entry.firstLoadUncompressedJsBytes > budget) {
    failures.push({
      route: entry.route,
      actual: entry.firstLoadUncompressedJsBytes,
      budget,
    });
  }
}

if (failures.length > 0) {
  console.error("Route bundle budget exceeded:");
  for (const failure of failures) {
    console.error(
      `- ${failure.route}: ${failure.actual.toLocaleString()} bytes (budget ${failure.budget.toLocaleString()})`,
    );
  }
  process.exit(1);
}

const largest = [...stats]
  .filter(
    (entry) =>
      typeof entry?.firstLoadUncompressedJsBytes === "number" &&
      !exemptRoutes.has(entry.route),
  )
  .sort(
    (a, b) =>
      b.firstLoadUncompressedJsBytes - a.firstLoadUncompressedJsBytes,
  )[0];

console.log(
  `Bundle budget passed. Largest route: ${largest?.route ?? "unknown"} (${(largest?.firstLoadUncompressedJsBytes ?? 0).toLocaleString()} bytes).`,
);
