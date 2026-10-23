/**
 * Publish per-document CSP script hashes for prerendered HTML.
 *
 * `next build` captures headers before the HTML exists. On Vercel the platform
 * adapter then freezes those headers into `.vercel/output`. This module runs
 * from that adapter's onBuildComplete, after prerender and before the platform
 * adapter writes the deployment, and again after the build to refuse a
 * placeholder or an inline script with no matching hash.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { inlineScriptHashes } from "../src/lib/csp-inline-scripts.ts";
import {
  assertDocumentsCovered,
  assertIsrRestored,
  cspValuesForPath,
  documentScriptPolicy,
  upsertPathCsp,
} from "../src/lib/csp-document-policy.ts";

const require = createRequire(import.meta.url);
const { buildCustomRoute } = require("next/dist/lib/build-custom-route");
const { normalizeRouteRegex } = require("next/dist/lib/load-custom-routes");
const { modifyRouteRegex } = require("next/dist/lib/redirect-status");
const { pathToRegexp } = require("next/dist/compiled/path-to-regexp");
const { convertHeaders } = require("next/dist/compiled/@vercel/routing-utils");

const PLACEHOLDER = `sha256-${"A".repeat(43)}`;

export function installDocumentCsp({
  distDir,
  projectDir,
  routing,
  outputs,
}) {
  const documents = discoverDocuments({ distDir, outputs });
  assertRepresentativeDocuments(documents);
  const entries = documents.map((document) => ({
    path: document.path,
    hashes: document.hashes,
    policy: documentScriptPolicy(document.hashes),
  }));
  const policyByPath = new Map(entries.map((entry) => [entry.path, entry.policy]));

  if (routing) applyRoutingHeaders(routing, entries);
  if (outputs) applyPrerenderHeaders(outputs, policyByPath);

  const routesManifest = patchRoutesManifest(distDir, entries);
  patchPrerenderManifest(distDir, policyByPath);
  writeFileSync(
    join(distDir, "csp-documents.json"),
    `${JSON.stringify({
      documents: documents.map((document) => ({
        path: document.path,
        file: relative(projectDir, document.file),
        hashes: document.hashes,
      })),
    })}\n`,
  );

  assertDocumentsCovered(entries, (path) =>
    cspValuesForPath(routesManifest.headers, path, sourceMatchesPath),
  );
  assertIsrRestored(readPrerenderRoutes(distDir));
  assertNoUnlistedHtml(distDir, documents);

  const largest = entries.reduce((max, entry) => Math.max(max, entry.policy.length), 0);
  console.log(
    `CSP script hashes: ${entries.length} documents, largest policy ${largest} characters.`,
  );
  return entries;
}

export function verifyCapturedCsp({ distDir, projectDir }) {
  const manifestPath = join(distDir, "csp-documents.json");
  if (!existsSync(manifestPath)) {
    throw new Error(
      "CSP hash manifest is missing. The build did not hash prerendered inline scripts before headers were captured.",
    );
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const documents = (manifest.documents ?? []).map((document) => {
    const file = join(projectDir, document.file);
    const hashes = inlineScriptHashes(readFileSync(file, "utf8"));
    if (hashes.join("\n") !== document.hashes.join("\n")) {
      throw new Error(
        `Inline scripts for ${document.path} changed after the CSP header was captured (${file}).`,
      );
    }
    return { path: document.path, hashes, file };
  });
  const routesManifest = JSON.parse(readFileSync(join(distDir, "routes-manifest.json"), "utf8"));
  assertDocumentsCovered(documents, (path) =>
    cspValuesForPath(routesManifest.headers ?? [], path, sourceMatchesPath),
  );
  assertIsrRestored(readPrerenderRoutes(distDir));
  assertNoUnlistedHtml(distDir, documents);
  verifyVercelOutput(projectDir, documents);
}

function discoverDocuments({ distDir, outputs }) {
  const appDir = join(distDir, "server", "app");
  const fromApp = existsSync(appDir) ? discoverFromAppDir(appDir) : [];
  const fromOutputs = discoverFromOutputs(outputs);
  return mergeDocuments([...fromApp, ...fromOutputs]);
}

function discoverFromAppDir(appDir) {
  const documents = [];
  for (const file of walkHtml(appDir)) {
    const path = routeFromAppHtml(file, appDir);
    if (!isDocumentPath(path)) continue;
    documents.push({ path, file });
  }
  return documents;
}

function discoverFromOutputs(outputs) {
  if (!outputs) return [];
  const documents = [];
  for (const prerender of outputs.prerenders ?? []) {
    const file = prerender.fallback?.filePath;
    const path = normalizePath(prerender.pathname);
    if (!file || !String(file).endsWith(".html") || !isDocumentPath(path)) continue;
    documents.push({ path, file });
  }
  for (const file of outputs.staticFiles ?? []) {
    const path = normalizePath(file.pathname);
    if (!file.filePath || !String(file.filePath).endsWith(".html")) continue;
    if (!isDocumentPath(path) || path.startsWith("/_next")) continue;
    documents.push({ path, file: file.filePath });
  }
  return documents;
}

function mergeDocuments(documents) {
  const byPath = new Map();
  for (const document of documents) {
    const existing = byPath.get(document.path);
    if (!existing) {
      byPath.set(document.path, {
        path: document.path,
        file: document.file,
        hashes: inlineScriptHashes(readFileSync(document.file, "utf8")),
      });
      continue;
    }
    const hashes = inlineScriptHashes(readFileSync(document.file, "utf8"));
    if (hashes.join("\n") !== existing.hashes.join("\n")) {
      throw new Error(
        `Prerendered HTML for ${document.path} differs between ${existing.file} and ${document.file}.`,
      );
    }
  }
  return [...byPath.values()].sort((left, right) => left.path.localeCompare(right.path));
}

function assertRepresentativeDocuments(documents) {
  const paths = documents.map((document) => document.path);
  const problems = [];
  if (!paths.includes("/")) problems.push("homepage");
  if (!paths.includes("/contact")) problems.push("contact page");
  if (!paths.some((path) => /^\/blog\/[^/]+$/.test(path))) problems.push("a blog post");
  if (!paths.some((path) => /^\/locations\/[^/]+$/.test(path))) problems.push("a location page");
  if (problems.length > 0) {
    throw new Error(
      `CSP hash check did not find prerendered HTML for ${problems.join(", ")}.`,
    );
  }
}

function applyRoutingHeaders(routing, entries) {
  const headerKey = cspHeaderKey(routing);
  const owned = new Set(entries.map((entry) => entry.path));
  routing.beforeMiddleware = (routing.beforeMiddleware ?? []).filter((route) => {
    if (!owned.has(route.source) || !route.headers) return true;
    const keys = Object.keys(route.headers);
    return !(
      keys.length === 1 && keys[0].toLowerCase() === "content-security-policy"
    );
  });
  for (const entry of entries) {
    routing.beforeMiddleware.push(adapterHeaderRoute(entry.path, entry.policy, headerKey));
  }
}

function cspHeaderKey(routing) {
  for (const route of routing.beforeMiddleware ?? []) {
    const key = Object.keys(route.headers ?? {}).find(
      (name) => name.toLowerCase() === "content-security-policy",
    );
    if (key) return key;
  }
  return "Content-Security-Policy";
}

function adapterHeaderRoute(pathname, policy, headerKey) {
  const manifestRoute = buildCustomRoute("header", {
    source: pathname,
    headers: [{ key: headerKey, value: policy }],
  });
  const converted = convertHeaders([manifestRoute])[0];
  return {
    source: pathname,
    sourceRegex: modifyRouteRegex(converted.src || manifestRoute.regex),
    headers: converted.headers ?? { [headerKey]: policy },
  };
}

function applyPrerenderHeaders(outputs, policyByPath) {
  for (const prerender of outputs.prerenders ?? []) {
    const policy = policyByPath.get(normalizePath(prerender.pathname));
    const headers = prerender.fallback?.initialHeaders;
    if (!policy || !headers) continue;
    const type = String(headers["content-type"] ?? headers["Content-Type"] ?? "");
    const file = String(prerender.fallback?.filePath ?? "");
    if (!type.includes("text/html") && !file.endsWith(".html")) continue;
    setCsp(headers, policy);
  }
}

function patchRoutesManifest(distDir, entries) {
  const manifestPath = join(distDir, "routes-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.headers = upsertPathCsp(manifest.headers ?? [], entries).map((rule) =>
    rule.regex ? rule : buildCustomRoute("header", rule),
  );
  writeFileSync(manifestPath, JSON.stringify(manifest));
  return manifest;
}

function patchPrerenderManifest(distDir, policyByPath) {
  const manifestPath = join(distDir, "prerender-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const [path, policy] of policyByPath) {
    const route = manifest.routes?.[path];
    if (!route) continue;
    route.initialHeaders = route.initialHeaders ?? {};
    setCsp(route.initialHeaders, policy);
  }
  writeFileSync(manifestPath, JSON.stringify(manifest));
}

function setCsp(headers, policy) {
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === "content-security-policy" && key !== "content-security-policy") {
      delete headers[key];
    }
  }
  headers["content-security-policy"] = policy;
}

function verifyVercelOutput(projectDir, documents) {
  const configPath = join(projectDir, ".vercel", "output", "config.json");
  if (!existsSync(configPath)) {
    if (process.env.VERCEL) {
      throw new Error(
        "Vercel did not produce .vercel/output/config.json, so the CSP hashes were not captured into the deployment headers.",
      );
    }
    return;
  }
  const raw = readFileSync(configPath, "utf8");
  if (raw.includes(PLACEHOLDER)) {
    throw new Error(
      "Vercel output config.json still contains a placeholder CSP script hash. The deployment would block every inline script.",
    );
  }
  const config = JSON.parse(raw);
  assertDocumentsCovered(documents, (path) => policiesFromVercelConfig(config, path));
  assertTreeHasNoPlaceholder(join(projectDir, ".vercel", "output"));
}

function policiesFromVercelConfig(config, pathname) {
  const policies = [];
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry);
      return;
    }
    const headers = value.headers;
    const policy = headerRecordValue(headers, "content-security-policy");
    const source = typeof value.src === "string" ? value.src : undefined;
    if (policy && source && new RegExp(source).test(pathname)) policies.push(policy);
    if (policy && !source && typeof value.source === "string" && sourceMatchesPath(value.source, pathname)) {
      policies.push(policy);
    }
  };
  visit(config.routes ?? config);
  return policies;
}

function headerRecordValue(headers, name) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) return undefined;
  const key = Object.keys(headers).find((header) => header.toLowerCase() === name);
  const value = key ? headers[key] : undefined;
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : undefined;
}

function assertTreeHasNoPlaceholder(directory) {
  for (const file of walkFiles(directory)) {
    // Skip server bundles. The hash checker itself mentions the placeholder
    // shape, and a folded copy of that string is not a served CSP header.
    if (!file.endsWith(".json") && !file.endsWith(".html")) continue;
    const raw = readFileSync(file, "utf8");
    if (raw.includes(PLACEHOLDER)) {
      throw new Error(`Placeholder CSP hash remains in ${file}`);
    }
  }
}

function assertNoUnlistedHtml(distDir, documents) {
  const listed = new Set(documents.map((document) => document.file));
  const knownHashes = new Set(documents.flatMap((document) => document.hashes));
  const serverDir = join(distDir, "server");
  if (!existsSync(serverDir)) return;
  for (const file of walkHtml(serverDir)) {
    if (listed.has(file) || file.includes(`${sep}chunks${sep}`)) continue;
    const hashes = inlineScriptHashes(readFileSync(file, "utf8"));
    const missing = hashes.filter((hash) => !knownHashes.has(hash));
    if (missing.length > 0) {
      throw new Error(
        `Prerendered HTML ${relative(distDir, file)} has inline script ${missing[0]} with no CSP hash.`,
      );
    }
  }
}

function readPrerenderRoutes(distDir) {
  const manifest = JSON.parse(readFileSync(join(distDir, "prerender-manifest.json"), "utf8"));
  return manifest.routes ?? {};
}

export function sourceMatchesPath(source, pathname) {
  const compiled = pathToRegexp(source, [], {
    strict: true,
    sensitive: false,
    delimiter: "/",
  });
  const regex = normalizeRouteRegex(modifyRouteRegex(compiled.source));
  return new RegExp(regex).test(pathname);
}

function routeFromAppHtml(file, appDir) {
  let route = relative(appDir, file).split(sep).join("/");
  if (!route.endsWith(".html")) return "";
  if (route.includes(".segments/")) return "";
  route = `/${route.slice(0, -".html".length)}`;
  if (route.endsWith("/index")) route = route.slice(0, -"/index".length) || "/";
  if (route === "/index") route = "/";
  return route;
}

function isDocumentPath(pathname) {
  if (!pathname?.startsWith("/")) return false;
  if (/[[\]()]/.test(pathname) || pathname.includes(".")) return false;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) return false;
  return true;
}

function normalizePath(pathname) {
  if (typeof pathname !== "string" || pathname.length === 0) return "";
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) return withSlash.slice(0, -1);
  return withSlash;
}

function walkHtml(directory) {
  return walkFiles(directory).filter((file) => file.endsWith(".html"));
}

function walkFiles(directory) {
  const found = [];
  const visit = (current) => {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue;
        visit(full);
      } else if (entry.isFile()) {
        found.push(full);
      }
    }
  };
  visit(directory);
  return found;
}
