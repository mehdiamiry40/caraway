import { readOptionalEnv } from "./env";
import { validateEndpoint } from "./validate-endpoint";

const HEARTBEAT_TIMEOUT_MS = 5_000;

export interface WorkerRunCounts {
  processed: number;
  failures: number;
  pending: number;
  attention: number;
  overdue: number;
}

/**
 * Reports a delivery-worker run to an external dead-man's-switch monitor, set
 * in LEAD_WORKER_HEARTBEAT_URL. A clean run pings the URL. A run with failed,
 * parked or overdue deliveries pings `<URL>/fail`, the convention shared by
 * Healthchecks.io, Better Stack and Cronitor. A worker that stops running
 * sends nothing, which the monitor reports as a missed check-in.
 *
 * Only counts are sent, never enquiry details. This never throws: an
 * unreachable monitor must not fail the delivery run it reports on.
 */
export async function reportWorkerRun(
  healthy: boolean,
  counts?: WorkerRunCounts,
): Promise<"sent" | "skipped" | "failed"> {
  const configured = readOptionalEnv("LEAD_WORKER_HEARTBEAT_URL");
  if (!configured) return "skipped";
  try {
    if (!validateEndpoint(configured)) throw new Error("invalid_url");
    const url = new URL(configured);
    if (!healthy) url.pathname = `${url.pathname.replace(/\/+$/, "")}/fail`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: counts
        ? `processed=${counts.processed} failures=${counts.failures} pending=${counts.pending} attention=${counts.attention} overdue=${counts.overdue}`
        : "worker_unavailable",
      signal: AbortSignal.timeout(HEARTBEAT_TIMEOUT_MS),
      redirect: "error",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`status_${response.status}`);
    return "sent";
  } catch (error) {
    // The URL is a capability: never log it.
    console.error(
      "[lead-heartbeat] report_failed",
      error instanceof Error ? error.name : "unknown",
    );
    return "failed";
  }
}
