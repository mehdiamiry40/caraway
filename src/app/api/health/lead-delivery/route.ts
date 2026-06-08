import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { submitContact } from "@/actions/contact";
import { submitQuote } from "@/actions/quote";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  const timestamp = new Date().toISOString();
  const [quote, contact] = await Promise.allSettled([
    submitQuote({
      name: "Caraway Delivery Monitor",
      phone: "0400000000",
      make: "Caraway",
      model: `Synthetic monitor ${timestamp}`,
      year: new Date().getFullYear(),
      condition: "running",
      address: "1 Queen Street, Brisbane QLD 4000",
      honeypot: "",
      marketingConsent: false,
    }),
    submitContact({
      name: "Caraway Delivery Monitor",
      email: "monitor@caraway.au",
      phone: "0400000000",
      message: `Synthetic lead-delivery check generated at ${timestamp}. No response required.`,
      honeypot: "",
      marketingConsent: false,
    }),
  ]);

  const quoteOk = quote.status === "fulfilled" && quote.value.success;
  const contactOk = contact.status === "fulfilled" && contact.value.success;
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
