#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { request } from "node:http";
import { createServer } from "node:net";
import { join } from "node:path";

const routes = ["cash-for-cars-brisbane", "car-removal-brisbane"];
const failures = [];

for (const route of routes) {
  const artifactPath = join(
    process.cwd(),
    ".next",
    "server",
    "app",
    `${route}.html`,
  );
  let html;
  try {
    html = readFileSync(artifactPath, "utf8");
  } catch (error) {
    failures.push(
      `${route}: could not read built HTML (${error instanceof Error ? error.message : String(error)})`,
    );
    continue;
  }

  const canonical = `https://caraway.au/${route}`;
  if (/name="robots" content="[^"]*noindex/i.test(html)) {
    failures.push(`${route}: built artifact contains a noindex robots meta tag`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    failures.push(`${route}: canonical link is missing or incorrect`);
  }
  if (!html.includes('"@type":"WebPage"')) {
    failures.push(`${route}: WebPage structured data is missing`);
  }
  if (!html.includes(`"mainEntity":{"@id":"${canonical}#service"}`)) {
    failures.push(`${route}: WebPage does not identify its Service main entity`);
  }
}

try {
  const robots = readFileSync(
    join(process.cwd(), ".next", "server", "app", "robots.txt.body"),
    "utf8",
  );
  if (!robots.includes("Allow: /") || !robots.includes("Sitemap: https://caraway.au/sitemap.xml")) {
    failures.push("robots.txt does not expose the canonical crawl and sitemap policy");
  }
} catch (error) {
  failures.push(
    `robots.txt: could not read built artifact (${error instanceof Error ? error.message : String(error)})`,
  );
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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

function fetchHeaders(port, host, path) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "GET",
        headers: {
          Host: host,
          "X-Forwarded-Host": host,
        },
      },
      (response) => {
        response.resume();
        response.once("end", () =>
          resolve({ status: response.statusCode, headers: response.headers }),
        );
      },
    );
    req.setTimeout(5_000, () => req.destroy(new Error("Request timed out")));
    req.once("error", reject);
    req.end();
  });
}

async function verifyRuntimeHostPolicy() {
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

  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (server.exitCode !== null) break;
      try {
        const response = await fetchHeaders(
          port,
          "preview.example.vercel.app",
          "/cash-for-cars-brisbane",
        );
        if (response.status === 200) {
          ready = true;
          break;
        }
      } catch {
        // The production server is still starting.
      }
      await delay(100);
    }

    if (!ready) {
      failures.push(
        `runtime host-policy server did not start successfully: ${serverOutput.trim()}`,
      );
      return;
    }

    for (const route of routes) {
      const path = `/${route}`;
      const preview = await fetchHeaders(
        port,
        "preview.example.vercel.app",
        path,
      );
      const production = await fetchHeaders(port, "caraway.au", path);

      if (preview.status !== 200) {
        failures.push(`${route}: preview host returned HTTP ${preview.status}`);
      }
      if (production.status !== 200) {
        failures.push(`${route}: canonical host returned HTTP ${production.status}`);
      }
      if (preview.headers["x-robots-tag"] !== "noindex, nofollow") {
        failures.push(`${route}: preview host is missing its noindex response header`);
      }
      if (production.headers["x-robots-tag"] !== undefined) {
        failures.push(`${route}: canonical host received an unexpected noindex header`);
      }
    }
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      for (let attempt = 0; attempt < 20 && server.exitCode === null; attempt += 1) {
        await delay(50);
      }
      if (server.exitCode === null) server.kill("SIGKILL");
    }
  }
}

try {
  await verifyRuntimeHostPolicy();
} catch (error) {
  failures.push(
    `runtime host-policy check failed (${error instanceof Error ? error.message : String(error)})`,
  );
}

if (failures.length > 0) {
  console.error("Indexability artifact check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Indexability checks passed for both primary service pages, robots.txt, preview hosts, and the canonical host.",
);
