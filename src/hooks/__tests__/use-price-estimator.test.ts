// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/actions/quote", () => ({
  submitQuote: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

import { submitQuote } from "@/actions/quote";
import { usePriceEstimator } from "@/hooks/use-price-estimator";

const mockedSubmitQuote = vi.mocked(submitQuote);

const CALCULATE_DELAY_MS = 600;

function fillVehicle(
  result: { current: ReturnType<typeof usePriceEstimator> },
  overrides: Partial<{ make: string; model: string; year: string; condition: string }> = {},
) {
  act(() => {
    result.current.setMake(overrides.make ?? "Toyota");
    result.current.setModel(overrides.model ?? "Corolla");
    result.current.setYear(overrides.year ?? "2015");
    result.current.setCondition(
      (overrides.condition ?? "running") as never,
    );
  });
}

function calculate(result: { current: ReturnType<typeof usePriceEstimator> }) {
  act(() => {
    result.current.handleEstimate();
  });
  act(() => {
    vi.advanceTimersByTime(CALCULATE_DELAY_MS);
  });
}

function fillContact(result: { current: ReturnType<typeof usePriceEstimator> }) {
  act(() => {
    result.current.setName("Jane Tester");
    result.current.setPhone("0412345678");
    result.current.setAddress("12 George St, Brisbane");
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  mockedSubmitQuote.mockReset();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("usePriceEstimator", () => {
  it("starts on step 1 with calculation gated until the vehicle is complete", () => {
    const { result } = renderHook(() => usePriceEstimator());

    expect(result.current.step).toBe(1);
    expect(result.current.canCalculate).toBe(false);
    expect(result.current.result).toBeNull();

    fillVehicle({ current: result.current });
    expect(result.current.canCalculate).toBe(true);
  });

  it("allows 'Other' make without a model", () => {
    const { result } = renderHook(() => usePriceEstimator());

    fillVehicle({ current: result.current }, { make: "Other", model: "" });
    expect(result.current.canCalculate).toBe(true);
  });

  it("rejects out-of-range years", () => {
    const { result } = renderHook(() => usePriceEstimator());

    fillVehicle({ current: result.current }, { year: "1925" });
    expect(result.current.canCalculate).toBe(false);
  });

  it("produces a buyer assessment and advances to step 2 after the reveal delay", () => {
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });

    act(() => {
      result.current.handleEstimate();
    });
    expect(result.current.isCalculating).toBe(true);
    expect(result.current.result).not.toBeNull();
    expect(result.current.step).toBe(1);

    act(() => {
      vi.advanceTimersByTime(CALCULATE_DELAY_MS);
    });
    expect(result.current.isCalculating).toBe(false);
    expect(result.current.step).toBe(2);
    expect(result.current.result).toMatchObject({
      status: "manual_review",
      quote: null,
    });
  });

  it("blocks submission and surfaces field errors when contact details are missing", async () => {
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedSubmitQuote).not.toHaveBeenCalled();
    expect(result.current.nameError).not.toBeNull();
    expect(result.current.phoneError).not.toBeNull();
    expect(result.current.addressError).not.toBeNull();
    expect(result.current.isSuccess).toBe(false);
  });

  it("submits the lead and reaches the success state", async () => {
    mockedSubmitQuote.mockResolvedValue({ success: true });
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });
    fillContact({ current: result.current });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedSubmitQuote).toHaveBeenCalledTimes(1);
    expect(mockedSubmitQuote.mock.calls[0][0]).toMatchObject({
      name: "Jane Tester",
      phone: "0412345678",
      make: "Toyota",
      model: "Corolla",
      year: 2015,
      condition: "running",
      honeypot: "",
    });
    expect(mockedSubmitQuote.mock.calls[0][0]).not.toHaveProperty("quoteAmount");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.submitError).toBe("");
  });

  it("defaults an empty model to 'Other' so Other-make leads pass the server schema", async () => {
    mockedSubmitQuote.mockResolvedValue({ success: true });
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current }, { make: "Other", model: "" });
    calculate({ current: result.current });
    fillContact({ current: result.current });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedSubmitQuote.mock.calls[0][0]).toMatchObject({
      make: "Other",
      model: "Other",
    });
  });

  it("shows the server failure message when delivery fails", async () => {
    mockedSubmitQuote.mockResolvedValue({
      success: false,
      message: "We couldn't send your request.",
    });
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });
    fillContact({ current: result.current });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.submitError).toContain("couldn't send");
  });

  it("falls back to a generic error when the action rejects in transit", async () => {
    mockedSubmitQuote.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });
    fillContact({ current: result.current });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.submitError).toMatch(/something went wrong/i);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("fakes success on honeypot hits without calling the server", async () => {
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });
    fillContact({ current: result.current });
    act(() => {
      result.current.setHoneypot("spam");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSuccess).toBe(true);
    expect(mockedSubmitQuote).not.toHaveBeenCalled();
  });

  it("returns to a clean step-1 state on reset", async () => {
    mockedSubmitQuote.mockResolvedValue({ success: true });
    const { result } = renderHook(() => usePriceEstimator());
    fillVehicle({ current: result.current });
    calculate({ current: result.current });
    fillContact({ current: result.current });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.make).toBe("");
    expect(result.current.result).toBeNull();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.canCalculate).toBe(false);
  });
});
