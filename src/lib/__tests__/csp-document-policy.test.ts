import { describe, expect, it } from "vitest";
import {
  assertDocumentsCovered,
  assertPagesAreStatic,
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

  it("requires public documents to stay fully static", () => {
    const staticRoute = { initialRevalidateSeconds: false as const };
    const routes = {
      "/": staticRoute,
      "/about": staticRoute,
      "/blog": staticRoute,
      "/how-it-works": staticRoute,
      "/locations": staticRoute,
      "/services": staticRoute,
      "/contact": staticRoute,
      ...Object.fromEntries(
        Array.from({ length: 10 }, (_, index) => [`/blog/post-${index}`, staticRoute]),
      ),
      "/blog/page/2": staticRoute,
      "/locations/logan": staticRoute,
      "/car-removal-brisbane": staticRoute,
      "/sell-my-car-brisbane": staticRoute,
      "/scrap-car-removal-brisbane": staticRoute,
      "/damaged-cars-brisbane": staticRoute,
      "/unregistered-cars-brisbane": staticRoute,
      "/hail-damaged-cars-brisbane": staticRoute,
      "/sell-toyota-hilux-brisbane": staticRoute,
    };
    expect(() => assertPagesAreStatic(routes)).not.toThrow();
    expect(() =>
      assertPagesAreStatic({
        ...routes,
        "/": { initialRevalidateSeconds: 3600 },
      }),
    ).toThrow(/\/ revalidate/);
  });
});
