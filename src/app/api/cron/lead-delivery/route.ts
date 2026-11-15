import { isAuthorizedCron } from "@/lib/cron-auth";
import { reportWorkerRun } from "@/lib/lead-heartbeat";
import { processPendingLeads } from "@/lib/lead-processor";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
export async function GET(request: Request) {
  if (!isAuthorizedCron(request))
    return Response.json({ status: "unauthorized" }, { status: 401, headers });
  try {
    const result = await processPendingLeads();
    const ok =
      result.failures === 0 && result.attention === 0 && result.overdue === 0;
    // Nothing reads this response, so an HTTP 503 alone alerts nobody. The
    // external monitor is what turns a failed, parked or overdue delivery
    // into an alert.
    await reportWorkerRun(ok, result);
    return Response.json(
      { status: ok ? "ok" : "attention", ...result },
      { status: ok ? 200 : 503, headers },
    );
  } catch {
    await reportWorkerRun(false);
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
}
