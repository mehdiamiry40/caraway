import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import type { RateLimitResult } from "@/lib/rate-limit";
import * as submissionIds from "@/lib/submission-id";
import { POST } from "../route";

const mocks = vi.hoisted(() => ({
  getClientIp: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => mocks);

const SERVER_TIME = new Date("2026-09-05T02:00:00.000Z");
const CLIENT_IP = "203.0.113.42";
const admission: RateLimitResult = {
  success: true,
  limit: 10,
  remaining: 9,
  reset: SERVER_TIME.getTime() + 60_000,
  mode: "distributed",
};
const fetchMock = vi.fn<typeof fetch>(() => {
  throw new Error("Unexpected network request in submission ID route test");
});
let issueSpy: MockInstance<typeof submissionIds.createSubmissionId>;

function request(
  origin: string | null = "https://caraway.au",
  urlOrigin = "https://caraway.au",
) {
  return new Request(`${urlOrigin}/api/forms/submission-id`, {
    method: "POST",
    headers: origin === null ? {} : { origin },
  });
}

function expectPrivacyHeaders(response: Response) {
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("x-robots-tag")).toBe("noindex");
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(SERVER_TIME);
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
  mocks.getClientIp.mockReset().mockReturnValue(CLIENT_IP);
  mocks.rateLimit.mockReset().mockResolvedValue(admission);
  // Observe issuance without replacing the real clock-and-UUID implementation.
  issueSpy = vi.spyOn(submissionIds, "createSubmissionId");
});

afterEach(() => {
  try {
    expect(fetchMock).not.toHaveBeenCalled();
  } finally {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});

describe("POST /api/forms/submission-id", () => {
  it.each([
    ["https://caraway.au", "distributed"],
    ["http://localhost:3000", "local"],
  ] as const)(
    "issues a server-timed ID anonymously for same-origin %s",
    async (origin, mode) => {
      mocks.rateLimit.mockResolvedValue({ ...admission, mode });
      const incoming = request(origin, origin);

      expect(incoming.headers.has("authorization")).toBe(false);
      expect(incoming.headers.has("cookie")).toBe(false);

      const response = await POST(incoming);
      const body = await response.json();

      expect(response.status).toBe(200);
      expectPrivacyHeaders(response);
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(body).toEqual({ id: expect.any(String) });
      expect(body.id).toMatch(
        /^\d{13}-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(submissionIds.submissionIssuedAt(body.id)).toBe(
        SERVER_TIME.getTime(),
      );
      expect(mocks.getClientIp).toHaveBeenCalledExactlyOnceWith(incoming);
      expect(mocks.rateLimit).toHaveBeenCalledExactlyOnceWith(
        "forms",
        `submission-id:${CLIENT_IP}`,
      );
      expect(issueSpy).toHaveBeenCalledExactlyOnceWith();
    },
  );

  it("issues distinct IDs even when the server clock has not advanced", async () => {
    const first = await POST(request());
    const second = await POST(request());
    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expectPrivacyHeaders(first);
    expectPrivacyHeaders(second);
    expect(firstBody.id).not.toBe(secondBody.id);
    expect(submissionIds.submissionIssuedAt(firstBody.id)).toBe(
      SERVER_TIME.getTime(),
    );
    expect(submissionIds.submissionIssuedAt(secondBody.id)).toBe(
      SERVER_TIME.getTime(),
    );
    expect(issueSpy).toHaveBeenCalledTimes(2);
  });

  it("uses the public Host when Next supplies an internal URL hostname", async () => {
    const response = await POST(
      new Request("http://localhost:3212/api/forms/submission-id", {
        method: "POST",
        headers: {
          origin: "http://127.0.0.1:3212",
          host: "127.0.0.1:3212",
          "sec-fetch-site": "same-origin",
        },
      }),
    );
    expect(response.status).toBe(200);
    expectPrivacyHeaders(response);
  });

  it("rejects cross-site metadata even with a matching host", async () => {
    const response = await POST(
      new Request("https://caraway.au/api/forms/submission-id", {
        method: "POST",
        headers: {
          origin: "https://caraway.au",
          "sec-fetch-site": "cross-site",
        },
      }),
    );
    expect(response.status).toBe(403);
    expect(mocks.rateLimit).not.toHaveBeenCalled();
  });

  it("waits for rate-limit admission before issuing an ID", async () => {
    let allowRequest!: (result: RateLimitResult) => void;
    mocks.rateLimit.mockReturnValue(
      new Promise<RateLimitResult>((resolve) => {
        allowRequest = resolve;
      }),
    );

    const pending = POST(request());

    expect(mocks.rateLimit).toHaveBeenCalledTimes(1);
    expect(issueSpy).not.toHaveBeenCalled();
    allowRequest(admission);
    const response = await pending;

    expect(response.status).toBe(200);
    expectPrivacyHeaders(response);
    expect(issueSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["missing", null],
    ["empty", ""],
    ["opaque", "null"],
    ["another host", "https://example.com"],
    ["another scheme", "http://caraway.au"],
    ["another port", "https://caraway.au:8443"],
    ["a subdomain", "https://www.caraway.au"],
    ["malformed", "not-an-origin"],
  ])(
    "rejects %s Origin before IP lookup, rate limiting, or issuance",
    async (_label, origin) => {
      const response = await POST(request(origin));

      expect(response.status).toBe(403);
      expectPrivacyHeaders(response);
      await expect(response.json()).resolves.toEqual({ error: "forbidden" });
      expect(mocks.getClientIp).not.toHaveBeenCalled();
      expect(mocks.rateLimit).not.toHaveBeenCalled();
      expect(issueSpy).not.toHaveBeenCalled();
    },
  );

  it.each([
    ["distributed", 429],
    ["local", 429],
    ["unavailable", 503],
  ] as const)(
    "returns the %s limiter rejection as %i without issuing an ID",
    async (mode, status) => {
      mocks.rateLimit.mockResolvedValue({
        ...admission,
        success: false,
        remaining: 0,
        mode,
      });

      const response = await POST(request());

      expect(response.status).toBe(status);
      expectPrivacyHeaders(response);
      await expect(response.json()).resolves.toEqual({
        error: "temporarily unavailable",
      });
      expect(mocks.rateLimit).toHaveBeenCalledExactlyOnceWith(
        "forms",
        `submission-id:${CLIENT_IP}`,
      );
      expect(issueSpy).not.toHaveBeenCalled();
    },
  );
});
