import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createSubmissionId } from "@/lib/submission-id";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
export async function POST(request: Request) {
  let sameOrigin = false;
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    // Next may use its internal hostname in request.url. Host is the public
    // request authority used by the browser and the existing action proxy.
    const host = request.headers.get("host") ?? new URL(request.url).host;
    const site = request.headers.get("sec-fetch-site");
    sameOrigin =
      (origin.protocol === "http:" || origin.protocol === "https:") &&
      origin.protocol === new URL(request.url).protocol &&
      origin.host.toLowerCase() === host.toLowerCase() &&
      (!site || site === "same-origin");
  } catch {
    /* Malformed or absent Origin is rejected before admission. */
  }
  if (!sameOrigin) {
    return Response.json({ error: "forbidden" }, { status: 403, headers });
  }
  const admission = await rateLimit(
    "forms",
    `submission-id:${getClientIp(request)}`,
  );
  if (!admission.success) {
    return Response.json(
      { error: "temporarily unavailable" },
      {
        status: admission.mode === "unavailable" ? 503 : 429,
        headers,
      },
    );
  }
  return Response.json({ id: createSubmissionId() }, { headers });
}
