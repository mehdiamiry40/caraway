/**
 * Load the HTML a crawler receives from the production server.
 *
 * These checks request the production server so they see the HTML a crawler
 * receives, including nav, footer, and host-based indexing headers.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { request } from "node:http";
import { createServer } from "node:net";
import { join } from "node:path";

const CANONICAL_HOST = "caraway.au";
const MAX_BODY_BYTES = 12 * 1024 * 1024;

export function documentPaths() {
  const paths = new Set();
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), ".next", "app-path-routes-manifest.json"), "utf8"),
  );
  for (const route of Object.values(manifest)) {
    if (typeof route !== "string" || route.includes("[")) continue;
    if (
      route.startsWith("/api/") ||
      route.startsWith("/_") ||
      route === "/health" ||
      route === "/robots.txt" ||
      route === "/sitemap.xml"
    ) {
      continue;
    }
    paths.add(route);
  }

  const sitemap = readFileSync(
    join(process.cwd(), ".next", "server", "app", "sitemap.xml.body"),
    "utf8",
  );
  for (const match of sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)) {
    const loc = match[1].trim().replaceAll("&amp;", "&");
    const path = new URL(loc).pathname.replace(/\/$/, "") || "/";
    paths.add(path);
  }
  return [...paths].sort();
}

export function availablePort() {
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

export function fetchLocal(port, path, host = CANONICAL_HOST) {
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
    req.setTimeout(20_000, () => req.destroy(new Error(`Request timed out for ${path}`)));
    req.once("error", reject);
    req.end();
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitUntilReady(port, server) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) return false;
    try {
      const response = await fetchLocal(port, "/robots.txt");
      if (response.status === 200) return true;
    } catch {
      // The production server is still starting.
    }
    await delay(200);
  }
  return false;
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  for (let attempt = 0; attempt < 20 && server.exitCode === null; attempt += 1) {
    await delay(50);
  }
  if (server.exitCode === null) server.kill("SIGKILL");
}

export async function withProductionServer(run) {
  const port = await availablePort();
  const nextBinary = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const server = spawn(
    process.execPath,
    [nextBinary, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    if (!(await waitUntilReady(port, server))) {
      throw new Error(
        `production server did not start successfully: ${output.trim()}`,
      );
    }
    return await run(port);
  } finally {
    await stopServer(server);
  }
}

export async function pooled(items, concurrency, task) {
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor];
      cursor += 1;
      await task(item);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
}
