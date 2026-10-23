import { createHash } from "node:crypto";

import {
  CSP_SCRIPT_HASH_PLACEHOLDER,
  assertScriptHashToken,
  isPlaceholderScriptHash,
} from "./content-security-policy.ts";

export {
  CSP_SCRIPT_HASH_PLACEHOLDER,
  assertScriptHashToken,
  isPlaceholderScriptHash,
};

/**
 * SHA-256 of an inline script's HTML-decoded source text.
 *
 * Browsers hash the script element's text after character references are
 * decoded and without trimming. The digest is standard base64, which is what
 * CSP `sha256-` sources require.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

export function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g,
    (entity, body: string) => {
      if (body in NAMED_ENTITIES) return NAMED_ENTITIES[body];
      const codePoint = body.startsWith("#x")
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
        return entity;
      }
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return entity;
      }
    },
  );
}

function hasSrcAttribute(attributes: string): boolean {
  return /(?:^|\s)src\s*=/i.test(attributes);
}

/** Inline script bodies in document order. External scripts are omitted. */
export function extractInlineScripts(html: string): string[] {
  const scripts: string[] = [];
  const open = /<script\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = open.exec(html)) !== null) {
    const attributes = match[1] ?? "";
    const bodyStart = open.lastIndex;
    const closeAt = html.slice(bodyStart).search(/<\/script\s*>/i);
    if (closeAt === -1) break;
    const body = html.slice(bodyStart, bodyStart + closeAt);
    open.lastIndex = bodyStart + closeAt + "</script>".length;
    if (hasSrcAttribute(attributes) || body.length === 0) continue;
    scripts.push(decodeHtmlEntities(body));
  }
  return scripts;
}

export function hashInlineScript(source: string): string {
  const digest = createHash("sha256").update(source, "utf8").digest("base64");
  return `sha256-${digest}`;
}

export function inlineScriptHashes(html: string): string[] {
  return [...new Set(extractInlineScripts(html).map(hashInlineScript))].sort();
}
