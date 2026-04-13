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
 * an attacker-controlled string could escape the script tag. The `</` →
 * `\u003c/` escape below defends against the `</script>` break-out case,
 * but does NOT sanitize arbitrary HTML or script payloads.
 */
export function JsonLd({
  data,
}: {
  data: JsonRecord | JsonRecord[];
}) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => {
        const type = item["@type"];
        const key = Array.isArray(type) ? type.join("-") : (type as string) || String(i);
        return (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(normalizeSchema(item)).replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") }}
          />
        );
      })}
    </>
  );
}
