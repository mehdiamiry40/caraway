import { escapeJsonForScript, findSuspiciousMarkup } from "@/lib/json-ld";

type JsonRecord = Record<string, unknown>;

function normalizeSchema(data: JsonRecord): JsonRecord {
  const hasContext = "@context" in data;
  return hasContext ? data : { "@context": "https://schema.org", ...data };
}

/**
 * Renders schema.org JSON-LD inside a `<script type="application/ld+json">`.
 *
 * SECURITY: This component serialises its `data` prop via `JSON.stringify`
 * and injects the result with `dangerouslySetInnerHTML`. Callers MUST only
 * pass trusted, build-time data — never user-generated content — otherwise
 * an attacker-controlled string could escape the script tag. The escapes
 * applied by `escapeJsonForScript` defend against the `</script>`,
 * `<!--`, and U+2028/U+2029 break-out cases, but do NOT sanitize arbitrary
 * HTML or script payloads. In development, a runtime check warns if any
 * string value looks like markup — a hint that user input may have leaked
 * into a build-time schema.
 */
export function JsonLd({
  data,
}: {
  data: JsonRecord | JsonRecord[];
}) {
  const items = Array.isArray(data) ? data : [data];
  if (process.env.NODE_ENV !== "production") {
    items.forEach((item, i) => {
      const hits = findSuspiciousMarkup(item, `data[${i}]`);
      if (hits.length > 0) {
        console.warn(
          `[JsonLd] Suspicious HTML-looking content at: ${hits.join(", ")}. JSON-LD must only carry trusted, build-time data.`
        );
      }
    });
  }
  return (
    <>
      {items.map((item, i) => {
        const type = item["@type"];
        const typePart = Array.isArray(type) ? type.join("-") : (type as string) || "schema";
        // Index suffix: many graphs repeat the same @type (e.g. multiple Review blocks).
        const key = `${typePart}-${i}`;
        return (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: escapeJsonForScript(JSON.stringify(normalizeSchema(item))) }}
          />
        );
      })}
    </>
  );
}
