/**
 * Next.js build adapter that hashes prerendered inline scripts and installs
 * those hashes into the routing headers before Vercel's adapter writes
 * `.vercel/output`.
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { installDocumentCsp } from "./csp-hashes.mjs";

const require = createRequire(import.meta.url);
const SELF = require.resolve("./csp-hash-adapter.mjs");

async function loadUpstream() {
  const spec = process.env.NEXT_ADAPTER_PATH;
  if (!spec) return null;
  let resolved;
  try {
    resolved = require.resolve(spec);
  } catch {
    return null;
  }
  if (resolved === SELF) return null;
  const imported = await import(pathToFileURL(resolved).href);
  return imported.default ?? imported;
}

const adapter = {
  name: "caraway-csp-script-hashes",

  async modifyConfig(config, ctx) {
    const upstream = await loadUpstream();
    const next = upstream?.modifyConfig ? await upstream.modifyConfig(config, ctx) : config;
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
    if (typeof upstream?.onBuildComplete === "function") {
      await upstream.onBuildComplete(ctx);
    }
  },
};

export default adapter;
