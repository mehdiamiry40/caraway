import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type MiddlewareModule = typeof import("../middleware");

async function loadMiddleware(): Promise<MiddlewareModule["middleware"]> {
  vi.resetModules();
  const mod = (await import("../middleware")) as MiddlewareModule;
  return mod.middleware;
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
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("middleware", () => {
  describe("HTTP method handling", () => {
    it("passes GET requests through without rate limiting or origin checks", async () => {
      const middleware = await loadMiddleware();
      const req = makeRequest("GET");
      const res = await middleware(req);
      // NextResponse.next() returns a 200 Response
      expect(res.status).toBe(200);
    });
  });

  describe("CSRF / origin validation", () => {
    it("rejects POST without Origin or Referer with 403", async () => {
      const middleware = await loadMiddleware();
      const req = makeRequest("POST", {
        "x-forwarded-for": "1.1.1.1",
        host: "localhost",
      });
      const res = await middleware(req);
      expect(res.status).toBe(403);
    });

    it("allows POST with matching Origin", async () => {
      const middleware = await loadMiddleware();
      const req = makeRequest("POST", {
        "x-forwarded-for": "2.2.2.2",
        host: "localhost",
        origin: "http://localhost",
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it("rejects POST with mismatched Origin", async () => {
      const middleware = await loadMiddleware();
      const req = makeRequest("POST", {
        "x-forwarded-for": "3.3.3.3",
        host: "localhost",
        origin: "http://evil.example.com",
      });
      const res = await middleware(req);
      expect(res.status).toBe(403);
    });

    it("falls back to Referer matching the request host", async () => {
      const middleware = await loadMiddleware();
      const req = makeRequest("POST", {
        "x-forwarded-for": "4.4.4.4",
        host: "localhost",
        referer: "http://localhost/some/page",
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it("rejects POST when Referer host does not match", async () => {
      const middleware = await loadMiddleware();
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
    it("allows up to 10 POSTs from the same IP, then 429s the 11th with Retry-After", async () => {
      const middleware = await loadMiddleware();
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
    });

    it("does not rate-limit requests from different IPs", async () => {
      const middleware = await loadMiddleware();
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
      const middleware = await loadMiddleware();
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
