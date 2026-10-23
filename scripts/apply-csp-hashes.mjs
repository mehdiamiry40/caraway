#!/usr/bin/env node
/**
 * Finish the CSP hash install after `next build`.
 *
 * Local and CI builds have no platform adapter, so this process writes the
 * per-page policies into the routes manifest Next serves. Vercel builds run
 * the hash adapter during `next build`; this process then refuses to succeed
 * unless those hashes are what `.vercel/output` will serve.
 */
import { join } from "node:path";
import { installDocumentCsp, verifyCapturedCsp } from "./csp-hashes.mjs";

const projectDir = process.cwd();
const distDir = join(projectDir, ".next");

try {
  if (process.env.NEXT_ADAPTER_PATH) {
    verifyCapturedCsp({ distDir, projectDir });
  } else {
    installDocumentCsp({ distDir, projectDir });
    verifyCapturedCsp({ distDir, projectDir });
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
