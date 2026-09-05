// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { useSubmissionId } from "@/hooks/use-submission-id";

const ISSUED_AT = Date.parse("2026-09-05T00:00:00.000Z");
const FIRST_ID = `${ISSUED_AT}-11111111-1111-4111-8111-111111111111`;
const SECOND_ID = `${ISSUED_AT}-22222222-2222-4222-8222-222222222222`;
const QUOTE_KEY = "caraway:submission:quote";
const CONTACT_KEY = "caraway:submission:contact";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  sessionStorage.clear();
  fetchMock = vi.fn().mockRejectedValue(new Error("Unmocked request: network is disabled in this test"));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("useSubmissionId", () => {
  it("requests an ID only when needed using POST, no-store and a five-second timeout", async () => {
    const controller = new AbortController();
    const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const { result } = renderHook(() => useSubmissionId("quote"));
    expect(fetchMock).not.toHaveBeenCalled();

    await expect(result.current.getId()).resolves.toBe(FIRST_ID);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/forms/submission-id", {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
    });
    expect(timeout).toHaveBeenCalledExactlyOnceWith(5_000);
    expect(JSON.parse(sessionStorage.getItem(QUOTE_KEY)!)).toEqual({ id: FIRST_ID });
    expect(sessionStorage.length).toBe(1);
  });

  it("keeps an unresolved ID across field edits, rerenders and retries after an unknown outcome", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const { result, rerender } = renderHook(
      ({ enquiry }) => ({ ...useSubmissionId("quote"), enquiry }),
      { initialProps: { enquiry: "First vehicle details" } },
    );
    const original = await result.current.getId();

    // A lost submission response leaves the attempt unresolved: no reset occurs.
    rerender({ enquiry: "Corrected vehicle details" });
    expect(await result.current.getId()).toBe(original);
    rerender({ enquiry: "More pickup details" });
    expect(await result.current.getId()).toBe(original);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(sessionStorage.getItem(QUOTE_KEY)!)).toEqual({ id: FIRST_ID });
    expect(sessionStorage.getItem(QUOTE_KEY)).not.toContain("vehicle");
    expect(sessionStorage.getItem(QUOTE_KEY)).not.toContain("pickup");
  });

  it("restores the unresolved ID from session storage after the hook remounts", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const firstPage = renderHook(() => useSubmissionId("quote"));
    expect(await firstPage.result.current.getId()).toBe(FIRST_ID);
    firstPage.unmount();

    // A reload replaces hook memory while keeping this tab's session storage.
    const reloadedPage = renderHook(() => useSubmissionId("quote"));

    expect(await reloadedPage.result.current.getId()).toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("starts a new attempt only after reset clears the old ID", async () => {
    fetchMock
      .mockResolvedValueOnce(Response.json({ id: FIRST_ID }))
      .mockResolvedValueOnce(Response.json({ id: SECOND_ID }));
    const { result, rerender } = renderHook(() => useSubmissionId("quote"));
    expect(await result.current.getId()).toBe(FIRST_ID);

    result.current.reset();
    expect(sessionStorage.getItem(QUOTE_KEY)).toBeNull();
    rerender();
    expect(await result.current.getId()).toBe(SECOND_ID);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(sessionStorage.getItem(QUOTE_KEY)!)).toEqual({ id: SECOND_ID });
  });

  it("keeps quote and contact attempts independent in the same tab", async () => {
    fetchMock
      .mockResolvedValueOnce(Response.json({ id: FIRST_ID }))
      .mockResolvedValueOnce(Response.json({ id: SECOND_ID }));
    const quote = renderHook(() => useSubmissionId("quote"));
    const contact = renderHook(() => useSubmissionId("contact"));
    expect(await quote.result.current.getId()).toBe(FIRST_ID);
    expect(await contact.result.current.getId()).toBe(SECOND_ID);

    contact.result.current.reset();

    expect(sessionStorage.getItem(CONTACT_KEY)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(QUOTE_KEY)!)).toEqual({ id: FIRST_ID });
    expect(await quote.result.current.getId()).toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    "2001-01-01T00:00:00.000Z",
    "2046-01-01T00:00:00.000Z",
  ])("uses the server timestamp despite an incorrect browser clock of %s", async (deviceTime) => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(deviceTime));
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const firstPage = renderHook(() => useSubmissionId("quote"));

    expect(await firstPage.result.current.getId()).toBe(FIRST_ID);
    firstPage.unmount();
    const reloadedPage = renderHook(() => useSubmissionId("quote"));
    expect(await reloadedPage.result.current.getId()).toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps an in-memory retry ID when browser storage reads and writes fail", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Storage blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage full"); });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("Storage blocked"); });
    fetchMock
      .mockResolvedValueOnce(Response.json({ id: FIRST_ID }))
      .mockResolvedValueOnce(Response.json({ id: SECOND_ID }));
    const { result, rerender } = renderHook(() => useSubmissionId("quote"));

    expect(await result.current.getId()).toBe(FIRST_ID);
    rerender();
    expect(await result.current.getId()).toBe(FIRST_ID);
    expect(await result.current.getId()).toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(() => result.current.reset()).not.toThrow();
    expect(await result.current.getId()).toBe(SECOND_ID);
    expect(await result.current.getId()).toBe(SECOND_ID);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shares one pending issuer request between concurrent getId calls", async () => {
    let resolveIssuer!: (response: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise<Response>((resolve) => { resolveIssuer = resolve; }));
    const { result } = renderHook(() => useSubmissionId("quote"));

    const requests = [result.current.getId(), result.current.getId(), result.current.getId()];
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveIssuer(Response.json({ id: FIRST_ID }));

    expect(await Promise.all(requests)).toEqual([FIRST_ID, FIRST_ID, FIRST_ID]);
    expect(await result.current.getId()).toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    { label: "null body", body: null },
    { label: "missing ID", body: {} },
    { label: "numeric ID", body: { id: ISSUED_AT } },
    { label: "malformed ID", body: { id: "not-an-issued-id" } },
    { label: "non-v4 UUID", body: { id: `${ISSUED_AT}-11111111-1111-1111-8111-111111111111` } },
  ])("rejects $label without caching it and permits a fresh issuer attempt", async ({ body }) => {
    fetchMock
      .mockResolvedValueOnce(Response.json(body))
      .mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const { result } = renderHook(() => useSubmissionId("quote"));

    await expect(result.current.getId()).rejects.toThrow("Invalid enquiry response");
    expect(sessionStorage.getItem(QUOTE_KEY)).toBeNull();
    await expect(result.current.getId()).resolves.toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each(["http", "network", "invalid JSON"])("retries after an issuer %s failure without retaining the failed promise", async (failure) => {
    if (failure === "http") {
      fetchMock.mockResolvedValueOnce(Response.json({ error: "unavailable" }, { status: 503 }));
    } else if (failure === "network") {
      fetchMock.mockRejectedValueOnce(new DOMException("Issuer timed out", "TimeoutError"));
    } else {
      fetchMock.mockResolvedValueOnce(new Response("invalid JSON", { status: 200 }));
    }
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const { result } = renderHook(() => useSubmissionId("quote"));

    await expect(result.current.getId()).rejects.toThrow();
    expect(sessionStorage.getItem(QUOTE_KEY)).toBeNull();
    await expect(result.current.getId()).resolves.toBe(FIRST_ID);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each(["invalid JSON", "null", '{"id":"invalid"}', '{"id":42}'])("replaces unusable session storage %s with a server-issued ID", async (saved) => {
    sessionStorage.setItem(QUOTE_KEY, saved);
    fetchMock.mockResolvedValueOnce(Response.json({ id: FIRST_ID }));
    const { result } = renderHook(() => useSubmissionId("quote"));

    expect(await result.current.getId()).toBe(FIRST_ID);
    expect(JSON.parse(sessionStorage.getItem(QUOTE_KEY)!)).toEqual({ id: FIRST_ID });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
