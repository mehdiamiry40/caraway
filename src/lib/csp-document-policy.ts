import { buildContentSecurityPolicy } from "./content-security-policy.ts";
import { assertScriptHashToken } from "./csp-inline-scripts.ts";

export type HeaderRule = {
  source: string;
  headers: { key: string; value: string }[];
  regex?: string;
};

export type PrerenderRouteMeta = {
  initialRevalidateSeconds?: number | false;
};

const REQUIRED_STATIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/how-it-works",
  "/locations",
  "/services",
] as const;

const SERVICE_PATHS = [
  "/car-removal-brisbane",
  "/sell-my-car-brisbane",
  "/scrap-car-removal-brisbane",
  "/damaged-cars-brisbane",
  "/unregistered-cars-brisbane",
  "/hail-damaged-cars-brisbane",
  "/sell-toyota-hilux-brisbane",
] as const;

const MAX_DOCUMENT_POLICY_CHARS = 8_000;

export function documentScriptPolicy(hashes: readonly string[]): string {
  const tokens = [...new Set(hashes.map(assertScriptHashToken))].sort();
  if (tokens.length === 0) {
    throw new Error("Refusing to publish a document CSP with no inline-script hashes");
  }
  const policy = buildContentSecurityPolicy({
    mode: "production",
    scriptHashes: tokens,
  });
  if (policy.length > MAX_DOCUMENT_POLICY_CHARS) {
    throw new Error(
      `Document CSP is ${policy.length} characters. Per-page hash policies must stay within ${MAX_DOCUMENT_POLICY_CHARS}.`,
    );
  }
  assertProductionDocumentPolicy(policy, tokens);
  return policy;
}

export function assertProductionDocumentPolicy(
  policy: string,
  hashes: readonly string[],
): void {
  const scriptSrc = directive(policy, "script-src");
  if (scriptSrc.includes("'unsafe-inline'") || scriptSrc.includes("'unsafe-eval'")) {
    throw new Error("Production document script-src relaxed a forbidden source");
  }
  if (scriptSrc.includes("'nonce-") || scriptSrc.includes("'strict-dynamic'")) {
    throw new Error(
      "Production document script-src must use hashes so prerendered script tags can stay static",
    );
  }
  if (policy.includes("sha256-" + "A".repeat(43))) {
    throw new Error("Production document CSP still contains a placeholder script hash");
  }
  for (const hash of hashes) {
    if (!policy.includes(`'${hash}'`)) {
      throw new Error(`Production document CSP is missing '${hash}'`);
    }
  }
}

export function upsertPathCsp(
  rules: readonly HeaderRule[],
  entries: readonly { path: string; policy: string }[],
): HeaderRule[] {
  const owned = new Set(entries.map((entry) => entry.path));
  const kept = rules.filter((rule) => {
    if (!owned.has(rule.source)) return true;
    return !isCspOnlyRule(rule);
  });
  return [
    ...kept,
    ...entries.map((entry) => ({
      source: entry.path,
      headers: [{ key: "Content-Security-Policy", value: entry.policy }],
    })),
  ];
}

function isCspOnlyRule(rule: HeaderRule): boolean {
  return (
    rule.headers.length === 1 &&
    rule.headers[0]?.key.toLowerCase() === "content-security-policy"
  );
}

export function cspValuesForPath(
  rules: readonly HeaderRule[],
  pathname: string,
  matches: (source: string, pathname: string) => boolean,
): string[] {
  const values: string[] = [];
  for (const rule of rules) {
    if (!matches(rule.source, pathname)) continue;
    for (const header of rule.headers) {
      if (header.key.toLowerCase() === "content-security-policy") {
        values.push(header.value);
      }
    }
  }
  return values;
}

export function assertDocumentsCovered(
  documents: readonly { path: string; hashes: readonly string[] }[],
  policiesForPath: (path: string) => readonly string[],
): void {
  if (documents.length === 0) {
    throw new Error(
      "CSP hash check found no prerendered HTML. Pages are still dynamic, so a static script hash cannot be published.",
    );
  }
  const problems: string[] = [];
  for (const document of documents) {
    if (document.hashes.length === 0) {
      problems.push(`${document.path}: prerendered HTML has no inline script to hash`);
      continue;
    }
    const policies = policiesForPath(document.path);
    if (policies.length === 0) {
      problems.push(`${document.path}: no Content-Security-Policy matches this document`);
      continue;
    }
    for (const policy of policies) {
      if (policy.includes(CSP_PLACEHOLDER_BODY)) {
        problems.push(`${document.path}: CSP still contains a placeholder script hash`);
      }
      const scriptSrc = directive(policy, "script-src");
      if (
        scriptSrc.includes("'unsafe-inline'") ||
        scriptSrc.includes("'unsafe-eval'") ||
        scriptSrc.includes("'nonce-")
      ) {
        problems.push(`${document.path}: document CSP is not hash-only`);
      }
      for (const hash of document.hashes) {
        if (!policy.includes(`'${hash}'`)) {
          problems.push(`${document.path}: missing ${hash}`);
        }
      }
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `CSP script hash check failed (${problems.length}):\n${problems
        .slice(0, 40)
        .map((problem) => `  - ${problem}`)
        .join("\n")}`,
    );
  }
}

const CSP_PLACEHOLDER_BODY = "sha256-" + "A".repeat(43);

/**
 * Public HTML must stay fully static. A timed revalidate renders new flight
 * script bytes while the CDN keeps the build-time CSP hashes, and the browser
 * then blocks that script. `false` means the prerendered file is what is served
 * until the next deploy.
 */
export function assertPagesAreStatic(
  routes: Readonly<Record<string, PrerenderRouteMeta>>,
): void {
  const problems: string[] = [];
  for (const path of REQUIRED_STATIC_PATHS) {
    if (!routes[path]) problems.push(`${path} was not prerendered`);
  }

  const blogPosts = Object.keys(routes).filter((path) => /^\/blog\/[^/]+$/.test(path));
  if (blogPosts.length < 10) {
    problems.push(`expected prerendered blog posts, found ${blogPosts.length}`);
  }

  const locations = Object.keys(routes).filter((path) =>
    /^\/locations\/[^/]+$/.test(path),
  );
  if (locations.length < 1) problems.push("no prerendered location pages");

  for (const path of SERVICE_PATHS) {
    if (!routes[path]) problems.push(`${path} was not prerendered`);
  }

  for (const [path, route] of Object.entries(routes)) {
    if (!isStaticDocumentPath(path)) continue;
    if (route.initialRevalidateSeconds !== false) {
      problems.push(
        `${path} revalidate is ${String(route.initialRevalidateSeconds)}, expected a fully static page`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Public pages must stay static so CSP script hashes match the HTML:\n${problems
        .map((problem) => `  - ${problem}`)
        .join("\n")}`,
    );
  }
}

function isStaticDocumentPath(pathname: string): boolean {
  if (!pathname.startsWith("/") || pathname.includes(".")) return false;
  if (pathname.startsWith("/_") || pathname.startsWith("/api")) return false;
  return true;
}

function directive(policy: string, name: string): string {
  return (
    policy
      .split(";")
      .map((part) => part.trim())
      .find((part) => part === name || part.startsWith(`${name} `)) ?? ""
  );
}
