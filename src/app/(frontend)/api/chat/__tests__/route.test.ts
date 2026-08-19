import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.doUnmock("ai");
  vi.resetModules();
});

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
    const { POST } = await import("@/app/(frontend)/api/chat/route");
    const response = await POST(
      chatRequest(
        { messages: [] },
        { "sec-fetch-site": "cross-site", origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects malformed message payloads", async () => {
    const { POST } = await import("@/app/(frontend)/api/chat/route");
    const response = await POST(chatRequest({ messages: "not-an-array" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid messages" });
  });

  it("fails closed when local Gateway credentials are unavailable", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", undefined);
    vi.stubEnv("VERCEL_OIDC_TOKEN", undefined);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await import("@/app/(frontend)/api/chat/route");
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
    await expect(response.json()).resolves.toEqual({
      error: "chat temporarily unavailable",
    });
  });

  it("accepts Vercel's runtime OIDC credential", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", undefined);
    vi.stubEnv("VERCEL_OIDC_TOKEN", undefined);
    const streamText = vi.fn(() => ({ stream: new ReadableStream() }));
    vi.doMock("ai", async (importOriginal) => ({
      ...(await importOriginal<typeof import("ai")>()),
      streamText,
    }));

    const { POST } = await import("@/app/(frontend)/api/chat/route");
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
  });

  it("rejects oversized requests", async () => {
    const { POST } = await import("@/app/(frontend)/api/chat/route");
    const response = await POST(
      chatRequest(
        { messages: [] },
        { "content-length": "24001" },
      ),
    );

    expect(response.status).toBe(413);
  });

  it("rejects user-supplied files before they reach the model", async () => {
    const { POST } = await import("@/app/(frontend)/api/chat/route");
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
      error: "conversation limit reached",
    });
  });
});
