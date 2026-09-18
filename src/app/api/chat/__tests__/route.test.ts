import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.doUnmock("ai");
  vi.doUnmock("@vercel/oidc");
  vi.doUnmock("@/lib/rate-limit");
  vi.resetModules();
});

function allowedLimit(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    limit: 120,
    remaining: 119,
    reset: Date.now() + 60_000,
    mode: "distributed",
    ...overrides,
  };
}

function chatRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://caraway.au/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "sec-fetch-site": "same-origin",
      "user-agent": "Test browser",
      "x-forwarded-for": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("chat API route", () => {
  it("rejects cross-site requests before generation", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest(
        { messages: [] },
        { "sec-fetch-site": "cross-site", origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns 503 instead of 429 when shared enforcement is unavailable", async () => {
    const rateLimit = vi.fn().mockResolvedValue(
      allowedLimit({ success: false, remaining: 0, mode: "unavailable" }),
    );
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));

    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(chatRequest({ messages: [] }));

    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBeNull();
  });

  it("rejects malformed message payloads", async () => {
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(chatRequest({ messages: "not-an-array" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid messages" });
    expect(rateLimit).toHaveBeenCalledTimes(1);
    expect(rateLimit).toHaveBeenCalledWith("chat", "203.0.113.10");
  });

  it("rejects an invalid OIDC credential before consuming shared capacity", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", undefined);
    vi.stubEnv("VERCEL_OIDC_TOKEN", undefined);
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    const getVercelOidcToken = vi
      .fn()
      .mockRejectedValue(new Error("invalid token"));
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    vi.doMock("@vercel/oidc", () => ({ getVercelOidcToken }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest(
        {
          messages: [
            {
              id: "message-1",
              role: "user",
              parts: [{ type: "text", text: "Do you buy damaged cars?" }],
            },
          ],
        },
        { "x-vercel-oidc-token": "junk" },
      ),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "chat temporarily unavailable",
    });
    expect(getVercelOidcToken).toHaveBeenCalledOnce();
    expect(rateLimit.mock.calls).toEqual([["chat", "203.0.113.10"]]);
  });

  it("accepts a validated Vercel runtime OIDC credential", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", undefined);
    vi.stubEnv("VERCEL_OIDC_TOKEN", undefined);
    const streamText = vi.fn(() => ({ stream: new ReadableStream() }));
    const getVercelOidcToken = vi.fn().mockResolvedValue("runtime-oidc-token");
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    vi.doMock("@vercel/oidc", () => ({ getVercelOidcToken }));
    vi.doMock("ai", async (importOriginal) => ({
      ...(await importOriginal<typeof import("ai")>()),
      streamText,
    }));

    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest(
        {
          messages: [
            {
              id: "message-1",
              role: "user",
              parts: [{ type: "text", text: "Do you buy damaged cars?" }],
            },
          ],
        },
        { "x-vercel-oidc-token": "runtime-oidc-token" },
      ),
    );

    expect(response.status).toBe(200);
    expect(streamText).toHaveBeenCalledOnce();
    expect(getVercelOidcToken).toHaveBeenCalledWith({
      expirationBufferMs: 30_000,
    });
    expect(rateLimit.mock.calls).toEqual([
      ["chat", "203.0.113.10"],
      ["chat-global", "global"],
    ]);
  });

  it("does not start generation when the validated request cannot reserve shared capacity", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    const streamText = vi.fn(() => ({ stream: new ReadableStream() }));
    const rateLimit = vi
      .fn()
      .mockResolvedValueOnce(allowedLimit({ limit: 12, remaining: 11 }))
      .mockResolvedValueOnce(
        allowedLimit({ success: false, remaining: 0 }),
      );
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    vi.doMock("ai", async (importOriginal) => ({
      ...(await importOriginal<typeof import("ai")>()),
      streamText,
    }));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest({
        messages: [
          {
            id: "message-1",
            role: "user",
            parts: [{ type: "text", text: "Do you buy damaged cars?" }],
          },
        ],
      }),
    );

    expect(response.status).toBe(503);
    expect(streamText).not.toHaveBeenCalled();
    expect(rateLimit.mock.calls).toEqual([
      ["chat", "203.0.113.10"],
      ["chat-global", "global"],
    ]);
  });

  it("rejects oversized requests", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest(
        { messages: [] },
        { "content-length": "24001" },
      ),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      error: "request too large",
      code: "conversation_limit_reached",
    });
  });

  it.each([
    {
      limit: "message count",
      messages: Array.from({ length: 17 }, (_, index) => ({
        id: `message-${index}`,
        role: index % 2 === 0 ? "user" : "assistant",
        parts: [{ type: "text", text: "A short message" }],
      })),
    },
    {
      limit: "total text length",
      messages: [
        { id: "assistant", role: "assistant", parts: [{ type: "text", text: "a".repeat(7_001) }] },
        { id: "user", role: "user", parts: [{ type: "text", text: "b".repeat(1_000) }] },
      ],
    },
  ])("identifies the $limit limit as requiring a new conversation", async ({ messages }) => {
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    const streamText = vi.fn();
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    vi.doMock("ai", async (importOriginal) => ({
      ...(await importOriginal<typeof import("ai")>()),
      streamText,
    }));
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(chatRequest({ messages }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "conversation limit reached",
      code: "conversation_limit_reached",
    });
    expect(streamText).not.toHaveBeenCalled();
    expect(rateLimit.mock.calls).toEqual([["chat", "203.0.113.10"]]);
  });

  it("uses a reset response for an oversized Unicode history without a content-length header", async () => {
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(chatRequest({
      messages: [{ id: "history", role: "assistant", parts: [{ type: "text", text: "車".repeat(8_000) }] }],
    }));

    expect(response.status).toBe(413);
    expect((await response.json()).code).toBe("conversation_limit_reached");
    expect(rateLimit.mock.calls).toEqual([["chat", "203.0.113.10"]]);
  });

  it("still accepts a history at the message and text limits", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    const rateLimit = vi.fn().mockResolvedValue(allowedLimit());
    const streamText = vi.fn(() => ({ stream: new ReadableStream() }));
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: () => "203.0.113.10",
      rateLimit,
    }));
    vi.doMock("ai", async (importOriginal) => ({
      ...(await importOriginal<typeof import("ai")>()),
      streamText,
    }));
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(chatRequest({
      messages: Array.from({ length: 16 }, (_, index) => ({
        id: `message-${index}`,
        role: index % 2 === 0 ? "assistant" : "user",
        parts: [{ type: "text", text: "a".repeat(500) }],
      })),
    }));

    expect(response.status).toBe(200);
    expect(streamText).toHaveBeenCalledOnce();
    expect(rateLimit.mock.calls).toEqual([
      ["chat", "203.0.113.10"],
      ["chat-global", "global"],
    ]);
  });

  it("rejects user-supplied files before they reach the model", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const response = await POST(
      chatRequest({
        messages: [
          {
            id: "message-with-file",
            role: "user",
            parts: [
              {
                type: "file",
                mediaType: "image/jpeg",
                url: "https://example.com/large-image.jpg",
              },
            ],
          },
        ],
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "invalid messages",
    });
  });
});
