import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from "ai";
import { getVercelOidcToken } from "@vercel/oidc";

import {
  CHAT_INSTRUCTIONS,
  CHAT_MODEL,
  CHAT_PROMPT_VERSION,
  type CarawayChatMessage,
  getChatVisitorId,
} from "@/lib/chat-assistant";
import { getEnv } from "@/lib/env";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGES = 16;
const MAX_TEXT_CHARACTERS = 8_000;
const MAX_USER_MESSAGE_CHARACTERS = 1_000;

function responseHeaders(extra: Record<string, string> = {}) {
  return {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
    ...extra,
  };
}

function jsonError(message: string, status: number, headers = {}, code?: string) {
  return Response.json(
    { error: message, ...(code ? { code } : {}) },
    { status, headers: responseHeaders(headers) },
  );
}

function isFirstPartyRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function countTextCharacters(messages: CarawayChatMessage[]): number {
  return messages.reduce(
    (total, message) =>
      total +
      message.parts.reduce(
        (messageTotal, part) =>
          messageTotal + (part.type === "text" ? part.text.length : 0),
        0,
      ),
    0,
  );
}

export async function POST(request: Request) {
  if (!isFirstPartyRequest(request)) {
    return jsonError("forbidden", 403);
  }

  const clientIp = getClientIp(request);
  const visitorLimit = await rateLimit("chat", clientIp);
  if (!visitorLimit.success) {
    if (visitorLimit.mode === "unavailable") {
      return jsonError("chat temporarily unavailable", 503);
    }
    return jsonError("too many requests", 429, {
      "Retry-After": Math.max(
        1,
        Math.ceil((visitorLimit.reset - Date.now()) / 1000),
      ).toString(),
    });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError("request too large", 413, {}, "conversation_limit_reached");
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonError("request too large", 413, {}, "conversation_limit_reached");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonError("invalid request", 400);
  }

  const messages =
    payload && typeof payload === "object" && "messages" in payload
      ? (payload as { messages: unknown }).messages
      : undefined;
  const validated = await safeValidateUIMessages<CarawayChatMessage>({
    messages,
  });

  if (!validated.success) {
    return jsonError("invalid messages", 400);
  }

  if (
    validated.data.some(
      (message) => message.role !== "user" && message.role !== "assistant",
    ) ||
    validated.data.at(-1)?.role !== "user" ||
    validated.data.some(
      (message) =>
        message.role === "user" &&
        (message.parts.some((part) => part.type !== "text") ||
          message.parts.every(
            (part) => part.type !== "text" || part.text.trim().length === 0,
          ) ||
          message.parts.some(
            (part) =>
              part.type === "text" &&
              part.text.length > MAX_USER_MESSAGE_CHARACTERS,
          )),
    )
  ) {
    return jsonError("invalid messages", 400);
  }

  if (
    validated.data.length > MAX_MESSAGES ||
    countTextCharacters(validated.data) > MAX_TEXT_CHARACTERS
  ) {
    return jsonError(
      "conversation limit reached",
      400,
      {},
      "conversation_limit_reached",
    );
  }

  // The browser replays prior assistant messages on each turn. Preserve their
  // visible text, but never trust client-replayed reasoning as authoritative
  // input.
  const textOnlyMessages = validated.data
    .map((message) => ({
      ...message,
      parts: message.parts.filter((part) => part.type === "text"),
    }))
    .filter((message) => message.parts.length > 0);

  const env = getEnv();
  if (!env.AI_GATEWAY_API_KEY) {
    try {
      // Validate the same request-context/environment token that AI Gateway
      // will use. A raw request-header presence check would accept malformed
      // or expired tokens and spend shared capacity before auth fails.
      await getVercelOidcToken({ expirationBufferMs: 30_000 });
    } catch (error) {
      console.error(
        "[chat] Vercel AI Gateway credentials are unavailable:",
        error instanceof Error ? error.message : String(error),
      );
      return jsonError("chat temporarily unavailable", 503);
    }
  }

  const visitorId = getChatVisitorId(
    clientIp,
    request.headers.get("user-agent") ?? "unknown",
  );
  const modelMessages = await convertToModelMessages(textOnlyMessages);

  // Reserve deployment-wide AI capacity only after this request is known to
  // be structurally valid and immediately eligible for the paid upstream.
  const globalLimit = await rateLimit("chat-global", "global");
  if (!globalLimit.success) {
    console.error("[chat] global circuit breaker unavailable or exhausted");
    return jsonError("chat temporarily unavailable", 503);
  }

  const result = streamText({
    model: CHAT_MODEL,
    instructions: CHAT_INSTRUCTIONS,
    messages: modelMessages,
    reasoning: "low",
    maxOutputTokens: 500,
    providerOptions: {
      gateway: {
        user: visitorId,
        tags: ["caraway-chat", CHAT_PROMPT_VERSION],
      },
      openai: {
        safetyIdentifier: visitorId,
        reasoningSummary: null,
        store: false,
        textVerbosity: "low",
      },
    },
    onError({ error }) {
      console.error(
        "[chat] generation failed:",
        error instanceof Error ? error.message : String(error),
      );
    },
  });

  return createUIMessageStreamResponse({
    headers: responseHeaders(),
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: validated.data,
      sendReasoning: false,
      onError: () => "I couldn't answer that just now. Please try again or call Caraway on 0481 438 444.",
    }),
  });
}
