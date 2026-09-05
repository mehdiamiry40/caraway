import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { submitContact } from "@/actions/contact";
import { submitQuote } from "@/actions/quote";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getLeadStore } from "@/lib/lead-store";
import { processLead } from "@/lib/lead-processor";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const headers = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
} as const;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization?.startsWith("Bearer ")) return false;

  const supplied = authorization.slice("Bearer ".length);
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function GET(request: Request) {
  // Throttle before the auth check so a leaked or brute-forced CRON_SECRET
  // can't be used to spam synthetic leads. Keyed separately from the public
  // form limit; Vercel Cron's once-per-interval call never gets close.
  const rateLimitResult = await rateLimit(
    "forms",
    `lead-monitor:${getClientIp(request)}`,
  );
  if (!rateLimitResult.success) {
    if (rateLimitResult.mode === "unavailable") {
      return NextResponse.json(
        { status: "unavailable" },
        { status: 503, headers },
      );
    }
    return NextResponse.json(
      { status: "rate_limited" },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": Math.max(
            1,
            Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          ).toString(),
        },
      },
    );
  }

  if (!authorized(request)) {
    return NextResponse.json(
      { status: "unauthorized" },
      { status: 401, headers },
    );
  }

  if (process.env.LEAD_MONITOR_ENABLED !== "1") {
    return NextResponse.json(
      { status: "skipped", reason: "lead monitor disabled" },
      { status: 200, headers },
    );
  }

  const day = Math.floor(Date.now() / 86_400_000) * 86_400_000;
  const timestamp = new Date(day).toISOString();
  // Retrying a scheduled run must not send a fresh pair of monitor messages.
  const idFor = (kind: "quote" | "contact") => {
    const hex = createHmac("sha256", process.env.CRON_SECRET!.trim())
      .update(JSON.stringify({ purpose: "lead-monitor-v1", day, kind }))
      .digest("hex");
    return `${day}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
  };
  const quoteId = idFor("quote");
  const contactId = idFor("contact");
  const [quote, contact] = await Promise.allSettled([
    submitQuote(
      {
        name: "Caraway Delivery Monitor",
        phone: "0400000000",
        make: "Caraway",
        model: `Synthetic monitor ${timestamp}`,
        year: new Date().getFullYear(),
        condition: "running",
        address: "1 Queen Street, Brisbane QLD 4000",
        honeypot: "",
      },
      quoteId,
    ),
    submitContact(
      {
        name: "Caraway Delivery Monitor",
        email: "monitor@caraway.au",
        phone: "0400000000",
        message: `Synthetic lead-delivery check generated at ${timestamp}. No response required.`,
        honeypot: "",
        marketingConsent: false,
      },
      contactId,
    ),
  ]);

  let store: ReturnType<typeof getLeadStore>;
  try {
    store = getLeadStore();
  } catch {
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503, headers },
    );
  }
  const verified = await Promise.allSettled(
    (
      [
        ["quote", quoteId, quote],
        ["contact", contactId, contact],
      ] as const
    ).map(async ([kind, id, capture]) => {
      if (capture.status !== "fulfilled" || !capture.value.success)
        return false;
      await processLead(kind, id, store);
      const saved = await store.read(kind, id);
      if (!saved) return false;
      const configured = Object.values(saved.channels).filter(
        (channel) => channel.state !== "disabled",
      );
      return (
        configured.length > 0 &&
        configured.every((channel) => channel.state === "accepted")
      );
    }),
  );
  const quoteOk = verified[0].status === "fulfilled" && verified[0].value;
  const contactOk = verified[1].status === "fulfilled" && verified[1].value;
  const body = {
    status: quoteOk && contactOk ? "ok" : "error",
    checkedAt: timestamp,
    checks: { quote: quoteOk, contact: contactOk },
  } as const;

  return NextResponse.json(body, {
    status: quoteOk && contactOk ? 200 : 503,
    headers,
  });
}
