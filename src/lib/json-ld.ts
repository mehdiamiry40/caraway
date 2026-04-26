// U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) are valid in
// JSON but invalid in JavaScript string literals before ES2019. Built via
// `new RegExp` so the source file does not contain the literals (which
// confuse parsers/linters when embedded in regex literals).
const LINE_SEPARATOR_RE = new RegExp("\\u2028", "g");
const PARAGRAPH_SEPARATOR_RE = new RegExp("\\u2029", "g");

// Escapes a JSON payload so it can be safely embedded inside an HTML
// `<script>` tag without breaking out of the tag, the surrounding HTML
// comment, or a JS string literal.
export function escapeJsonForScript(json: string): string {
  return json
    .replace(/<\/(script)/gi, "<\\/$1")
    .replace(/<!--/g, "<\\!--")
    .replace(LINE_SEPARATOR_RE, "\\u2028")
    .replace(PARAGRAPH_SEPARATOR_RE, "\\u2029");
}

// Sentinel for "did user content sneak into a build-time schema?". Walks the
// tree and reports paths whose string values contain HTML-looking markup.
// Production behaviour is unchanged — `escapeJsonForScript` already
// neutralises the most dangerous breakout sequences. This guard is for
// development feedback only.
const SUSPICIOUS_MARKUP = /<\/?(script|iframe|style|object|embed)\b/i;

export function findSuspiciousMarkup(
  value: unknown,
  path = "",
  hits: string[] = []
): string[] {
  if (typeof value === "string") {
    if (SUSPICIOUS_MARKUP.test(value)) hits.push(path || "(root)");
    return hits;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => findSuspiciousMarkup(item, `${path}[${i}]`, hits));
    return hits;
  }
  if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      findSuspiciousMarkup(v, path === "" ? k : `${path}.${k}`, hits);
    }
  }
  return hits;
}
