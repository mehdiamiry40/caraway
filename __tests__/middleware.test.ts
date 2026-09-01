import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";

type ProxyModule = typeof import("../src/proxy");

async function loadProxy(): Promise<ProxyModule["proxy"]> {
  vi.resetModules();
  const mod = (await import("../src/proxy")) as ProxyModule;
  return mod.proxy;
}

function makeRequest(
  method: string,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(new URL("http://localhost/"), {
    method,
    headers,
  });
}

beforeEach(() => {
  delete process.env.SITE_URL;
  delete process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("proxy", () => {
  describe("matcher scope", () => {
    it("bypasses Vercel Analytics intake while retaining page POST protection", async () => {
      const { config } = await import("../src/proxy");

      for (const path of [
        "/_vercel/insights/script.js",
        "/_vercel/insights/view",
        "/_vercel/insights/event",
      ]) {
        expect(
          unstable_doesMiddlewareMatch({
            config,
            nextConfig: {},
            url: `https://caraway.au${path}`,
          }),
          path,
        ).toBe(false);
      }

      expect(
        unstable_doesMiddlewareMatch({
          config,
          nextConfig: {},
          url: "https://caraway.au/cash-for-cars-brisbane",
        }),
      ).toBe(true);
    });
  });

  describe("HTTP method handling", () => {
    it("passes GET requests through and noindexes non-canonical hosts", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("GET");
      const res = await middleware(req);
      // NextResponse.next() returns a 200 Response
      expect(res.status).toBe(200);
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });

    it("keeps the canonical apex host indexable", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("GET", { host: "caraway.au" });
      const res = await middleware(req);

      expect(res.headers.get("x-robots-tag")).toBeNull();
    });

    it("accepts matching proxy hosts and noindexes conflicting ones", async () => {
      const middleware = await loadProxy();
      const canonical = await middleware(
        makeRequest("GET", {
          host: "caraway.au",
          "x-forwarded-host": "caraway.au:443",
        }),
      );
      const preview = await middleware(
        makeRequest("GET", {
          host: "caraway.au",
          "x-forwarded-host": "caraway-git-example.vercel.app",
        }),
      );

      expect(canonical.headers.get("x-robots-tag")).toBeNull();
      expect(preview.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });

    it("does not set Places session cookies on HTML page requests", async () => {
      process.env.GOOGLE_PLACES_API_KEY = "places-test-secret";
      const middleware = await loadProxy();
      const req = makeRequest("GET", {
        accept: "text/html",
        "x-forwarded-for": "203.0.113.10",
        "user-agent": "Vitest Browser",
      });

      const res = await middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toBeNull();
    });
  });

  describe("CSRF / origin validation", () => {
    it("rejects POST without Origin or Referer with 403", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("POST", {
        "x-forwarded-for": "1.1.1.1",
        host: "localhost",
      });
      const res = await middleware(req);
      expect(res.status).toBe(403);
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });

    it("allows POST with matching Origin", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("POST", {
        "x-forwarded-for": "2.2.2.2",
        host: "localhost",
        origin: "http://localhost",
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it("rejects POST with mismatched Origin", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("POST", {
        "x-forwarded-for": "3.3.3.3",
        host: "localhost",
        origin: "http://evil.example.com",
      });
      const res = await middleware(req);
      expect(res.status).toBe(403);
    });

    it("falls back to Referer matching the request host", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("POST", {
        "x-forwarded-for": "4.4.4.4",
        host: "localhost",
        referer: "http://localhost/some/page",
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it("rejects POST when Referer host does not match", async () => {
      const middleware = await loadProxy();
      const req = makeRequest("POST", {
        "x-forwarded-for": "5.5.5.5",
        host: "localhost",
        referer: "http://evil.example.com/path",
      });
      const res = await middleware(req);
      expect(res.status).toBe(403);
    });
  });

  describe("rate limiting", () => {
    it("returns 503 when distributed enforcement is unavailable outside dev/test", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const middleware = await loadProxy();
      const res = await middleware(
        makeRequest("POST", {
          "x-forwarded-for": "10.20.30.40",
          host: "localhost",
          origin: "http://localhost",
        }),
      );

      expect(res.status).toBe(503);
      expect(res.headers.get("Retry-After")).toBeNull();
    });

    it("allows up to 10 POSTs from the same IP, then 429s the 11th with Retry-After", async () => {
      const middleware = await loadProxy();
      const headers = {
        "x-forwarded-for": "10.20.30.40",
        host: "localhost",
        origin: "http://localhost",
      };

      for (let i = 0; i < 10; i++) {
        const res = await middleware(makeRequest("POST", headers));
        expect(res.status).toBe(200);
      }

      const res11 = await middleware(makeRequest("POST", headers));
      expect(res11.status).toBe(429);
      expect(res11.headers.get("Retry-After")).not.toBeNull();
      expect(res11.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });

    it("does not rate-limit requests from different IPs", async () => {
      const middleware = await loadProxy();
      for (let i = 0; i < 11; i++) {
        const res = await middleware(
          makeRequest("POST", {
            "x-forwarded-for": `192.0.2.${i + 1}`,
            host: "localhost",
            origin: "http://localhost",
          }),
        );
        expect(res.status).toBe(200);
      }
    });

    it("uses only the first IP from a comma-separated x-forwarded-for", async () => {
      const middleware = await loadProxy();
      const headers = {
        "x-forwarded-for": "203.0.113.5, 198.51.100.1, 10.0.0.1",
        host: "localhost",
        origin: "http://localhost",
      };

      // 10 allowed
      for (let i = 0; i < 10; i++) {
        const res = await middleware(makeRequest("POST", headers));
        expect(res.status).toBe(200);
      }
      // 11th from "same" first-IP key should be limited
      const res11 = await middleware(makeRequest("POST", headers));
      expect(res11.status).toBe(429);

      // A different leading IP (with same trailing list) should still pass
      const res12 = await middleware(
        makeRequest("POST", {
          ...headers,
          "x-forwarded-for": "203.0.113.99, 198.51.100.1, 10.0.0.1",
        }),
      );
      expect(res12.status).toBe(200);
    });
  });
});
