import { describe, expect, it } from "vitest";
import {
  assertDocumentsCovered,
  assertIsrRestored,
  cspValuesForPath,
  documentScriptPolicy,
  upsertPathCsp,
} from "@/lib/csp-document-policy";
import { hashInlineScript } from "@/lib/csp-inline-scripts";

const HOME_HASH = hashInlineScript("home");
const OTHER_HASH = hashInlineScript("other");

describe("document CSP policies", () => {
  it("publishes one hash policy per prerendered path", () => {
    const rules = upsertPathCsp(
      [
        {
          source: "/(.*)",
          headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
        },
        {
          source: "/",
          headers: [{ key: "Content-Security-Policy", value: "stale" }],
        },
      ],
      [{ path: "/", policy: documentScriptPolicy([HOME_HASH]) }],
    );

    const policies = cspValuesForPath(rules, "/", (source, pathname) => {
      return source === "/(.*)" || source === pathname;
    });
    expect(policies).toHaveLength(1);
    expect(policies[0]).toContain(`'${HOME_HASH}'`);
    const scriptSrc = policies[0]
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("script-src "));
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'strict-dynamic'");
  });

  it("fails when a prerendered inline script has no matching hash", () => {
    expect(() =>
      assertDocumentsCovered(
        [{ path: "/contact", hashes: [HOME_HASH, OTHER_HASH] }],
        () => [documentScriptPolicy([HOME_HASH])],
      ),
    ).toThrow(/\/contact: missing/);
  });

  it("fails when prerender output is still dynamic", () => {
    expect(() => assertDocumentsCovered([], () => [])).toThrow(/no prerendered HTML/i);
  });

  it("requires the restored ISR windows", () => {
    const routes = {
      "/": { initialRevalidateSeconds: 3600 },
      "/about": { initialRevalidateSeconds: 3600 },
      "/blog": { initialRevalidateSeconds: 3600 },
      "/how-it-works": { initialRevalidateSeconds: 3600 },
      "/locations": { initialRevalidateSeconds: 3600 },
      "/services": { initialRevalidateSeconds: 3600 },
      "/contact": { initialRevalidateSeconds: false as const },
      ...Object.fromEntries(
        Array.from({ length: 10 }, (_, index) => [
          `/blog/post-${index}`,
          { initialRevalidateSeconds: 86400 },
        ]),
      ),
      "/blog/page/2": { initialRevalidateSeconds: 3600 },
      "/locations/logan": { initialRevalidateSeconds: 86400 },
      "/car-removal-brisbane": { initialRevalidateSeconds: 86400 },
      "/sell-my-car-brisbane": { initialRevalidateSeconds: 86400 },
      "/scrap-car-removal-brisbane": { initialRevalidateSeconds: 86400 },
      "/damaged-cars-brisbane": { initialRevalidateSeconds: 86400 },
      "/unregistered-cars-brisbane": { initialRevalidateSeconds: 86400 },
      "/hail-damaged-cars-brisbane": { initialRevalidateSeconds: 86400 },
      "/sell-toyota-hilux-brisbane": { initialRevalidateSeconds: 86400 },
    };
    expect(() => assertIsrRestored(routes)).not.toThrow();
    expect(() =>
      assertIsrRestored({
        ...routes,
        "/": { initialRevalidateSeconds: false },
      }),
    ).toThrow(/homepage|\/ revalidate/i);
  });
});
