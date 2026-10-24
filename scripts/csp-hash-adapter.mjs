/**
 * Next.js build adapter that hashes prerendered inline scripts and installs
 * those hashes into the routing headers before Vercel's adapter writes
 * `.next/output/config.json`. Vercel publishes that directory as
 * `.vercel/output` only after this build command exits.
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { installDocumentCsp } from "./csp-hashes.mjs";

const require = createRequire(import.meta.url);
const SELF = require.resolve("./csp-hash-adapter.mjs");

async function loadUpstream() {
  const spec = process.env.NEXT_ADAPTER_PATH;
  if (!spec) {
    throw new Error(
      "NEXT_ADAPTER_PATH is unset, so the CSP adapter cannot call the platform adapter that writes the deployment headers.",
    );
  }
  let resolved;
  try {
    resolved = require.resolve(spec);
  } catch (error) {
    throw new Error(
      `Could not resolve the platform Next.js adapter at NEXT_ADAPTER_PATH (${spec}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (resolved === SELF) {
    throw new Error(
      "NEXT_ADAPTER_PATH points at the CSP adapter. The platform adapter must stay available so deployment headers are written.",
    );
  }
  const imported = await import(pathToFileURL(resolved).href);
  const upstream = imported.default ?? imported;
  if (typeof upstream?.onBuildComplete !== "function") {
    throw new Error(
      `The platform Next.js adapter at ${resolved} does not export onBuildComplete.`,
    );
  }
  return upstream;
}

const adapter = {
  name: "caraway-csp-script-hashes",

  async modifyConfig(config, ctx) {
    const upstream = await loadUpstream();
    const next = upstream.modifyConfig ? await upstream.modifyConfig(config, ctx) : config;
    return { ...next, adapterPath: SELF };
  },

  async onBuildComplete(ctx) {
    installDocumentCsp({
      distDir: ctx.distDir,
      projectDir: ctx.projectDir,
      routing: ctx.routing,
      outputs: ctx.outputs,
    });
    const upstream = await loadUpstream();
    await upstream.onBuildComplete(ctx);
  },
};

export default adapter;
