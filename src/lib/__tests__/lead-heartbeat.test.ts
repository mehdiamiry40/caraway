import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportWorkerRun } from "@/lib/lead-heartbeat";

const MONITOR = "https://hc-ping.com/11111111-2222-4333-8444-555555555555";
const counts = { processed: 3, failures: 0, pending: 1, attention: 0, overdue: 0 };
let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;
let errorLog: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "");
  vi.stubEnv("LEAD_WORKER_HEARTBEAT_URL", MONITOR);
  fetchMock = vi.fn<typeof fetch>(async () => new Response("OK"));
  vi.stubGlobal("fetch", fetchMock);
  errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function sent() {
  const [url, init] = fetchMock.mock.calls[0];
  return { url: String(url), init: init! };
}

describe("lead worker heartbeat", () => {
  it.each(["", "   "])("does nothing when no monitor is configured: %j", async (value) => {
    vi.stubEnv("LEAD_WORKER_HEARTBEAT_URL", value);
    expect(await reportWorkerRun(false, counts)).toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pings the monitor with counts only after a clean run", async () => {
    expect(await reportWorkerRun(true, counts)).toBe("sent");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const { url, init } = sent();
    expect(url).toBe(MONITOR);
    expect(init).toMatchObject({ method: "POST", redirect: "error" });
    expect(init.body).toBe("processed=3 failures=0 pending=1 attention=0 overdue=0");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    [MONITOR, `${MONITOR}/fail`],
    [`${MONITOR}/`, `${MONITOR}/fail`],
    [`${MONITOR}?rid=abc`, `${MONITOR}/fail?rid=abc`],
  ])("reports a failed or parked delivery to the failure address of %s", async (configured, expected) => {
    vi.stubEnv("LEAD_WORKER_HEARTBEAT_URL", configured);
    expect(await reportWorkerRun(false, { ...counts, attention: 2 })).toBe("sent");
    expect(sent().url).toBe(expected);
    expect(sent().init.body).toBe("processed=3 failures=0 pending=1 attention=2 overdue=0");
  });

  it("reports a run that could not reach storage without counts", async () => {
    expect(await reportWorkerRun(false)).toBe("sent");
    expect(sent().url).toBe(`${MONITOR}/fail`);
    expect(sent().init.body).toBe("worker_unavailable");
  });

  it.each([
    "http://hc-ping.com/plain-http",
    "https://localhost/ping",
    "https://169.254.169.254/latest",
    "https://hc-ping.com:8443/port",
    "not a url",
  ])("never calls an unsafe monitor address: %s", async (value) => {
    vi.stubEnv("LEAD_WORKER_HEARTBEAT_URL", value);
    expect(await reportWorkerRun(true, counts)).toBe("failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("respects the outbound host allowlist", async () => {
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "hooks.example.com");
    expect(await reportWorkerRun(true, counts)).toBe("failed");
    expect(fetchMock).not.toHaveBeenCalled();
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "hooks.example.com, hc-ping.com");
    expect(await reportWorkerRun(true, counts)).toBe("sent");
  });

  it.each([
    ["a network error", () => Promise.reject(new TypeError("fetch failed"))],
    ["an error status", () => Promise.resolve(new Response("nope", { status: 500 }))],
  ])("survives %s from the monitor without logging its address", async (_label, respond) => {
    fetchMock.mockImplementation(respond);
    await expect(reportWorkerRun(true, counts)).resolves.toBe("failed");
    expect(errorLog).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("hc-ping.com");
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("11111111");
  });
});
