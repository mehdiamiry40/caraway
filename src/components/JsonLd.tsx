type JsonRecord = Record<string, unknown>;

function normalizeSchema(data: JsonRecord): JsonRecord {
  const hasContext = "@context" in data;
  return hasContext ? data : { "@context": "https://schema.org", ...data };
}

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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(normalizeSchema(item)).replace(/</g, "\\u003c") }}
          />
        );
      })}
    </>
  );
}
