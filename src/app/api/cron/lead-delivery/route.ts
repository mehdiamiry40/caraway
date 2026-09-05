import { isAuthorizedCron } from "@/lib/cron-auth";
import { processPendingLeads } from "@/lib/lead-processor";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
export async function GET(request: Request) {
  if (!isAuthorizedCron(request))
    return Response.json({ status: "unauthorized" }, { status: 401, headers });
  try {
    const result = await processPendingLeads();
    const ok = result.failures === 0 && result.attention === 0;
    return Response.json(
      { status: ok ? "ok" : "attention", ...result },
      { status: ok ? 200 : 503, headers },
    );
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
}
