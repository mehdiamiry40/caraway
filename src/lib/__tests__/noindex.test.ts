import { describe, expect, it } from "vitest";
import {
  getRequestHostname,
  normalizeRequestHostname,
  shouldNoindexHostname,
} from "@/lib/noindex";

function headers(values: Record<string, string>): Pick<Headers, "get"> {
  return {
    get(name: string) {
      return values[name.toLowerCase()] ?? null;
    },
  };
}

describe("request-host indexability", () => {
  it("normalizes ports, casing, trailing dots, and proxy chains", () => {
    expect(normalizeRequestHostname("CARAWAY.AU.:443, proxy.internal")).toBe(
      "caraway.au",
    );
  });

  it("rejects malformed authority values", () => {
    expect(normalizeRequestHostname("caraway.au/path")).toBeNull();
    expect(normalizeRequestHostname("user@caraway.au")).toBeNull();
    expect(normalizeRequestHostname(null)).toBeNull();
    expect(shouldNoindexHostname("caraway.au.example.com")).toBe(true);
  });

  it("accepts matching proxy hosts and fails closed on conflicts", () => {
    expect(
      getRequestHostname(
        headers({
          "x-forwarded-host": "caraway.au:443",
          host: "caraway.au",
        }),
        "localhost",
      ),
    ).toBe("caraway.au");
    expect(
      getRequestHostname(
        headers({
          "x-forwarded-host": "caraway.au",
          host: "preview.example.vercel.app",
        }),
        "preview.example.vercel.app",
      ),
    ).toBeNull();
    expect(
      getRequestHostname(
        headers({
          host: "caraway.au/path",
          "x-forwarded-host": "caraway.au",
        }),
        "caraway.au",
      ),
    ).toBeNull();
    expect(getRequestHostname(headers({}), "localhost")).toBe("localhost");
  });

  it("allows indexing only on the canonical apex hostname", () => {
    expect(shouldNoindexHostname("caraway.au")).toBe(false);
    expect(shouldNoindexHostname("www.caraway.au")).toBe(true);
    expect(shouldNoindexHostname("preview.example.vercel.app")).toBe(true);
    expect(shouldNoindexHostname(null)).toBe(true);
  });
});
