import { describe, expect, it } from "vitest";
import { parsePersistedState } from "@/lib/persisted-estimator-state";

describe("parsePersistedState", () => {
  it("returns null for invalid JSON", () => {
    expect(parsePersistedState("not json")).toBeNull();
    expect(parsePersistedState("{")).toBeNull();
  });

  it("returns null for non-object payloads", () => {
    expect(parsePersistedState("null")).toBeNull();
    expect(parsePersistedState("42")).toBeNull();
    expect(parsePersistedState('"string"')).toBeNull();
    expect(parsePersistedState("[]")).toBeNull();
  });

  it("accepts a valid payload and preserves recognised fields", () => {
    const raw = JSON.stringify({
      step: 2,
      make: "Toyota",
      model: "Corolla",
      year: "2015",
      condition: "running",
    });
    expect(parsePersistedState(raw)).toEqual({
      step: 2,
      make: "Toyota",
      model: "Corolla",
      year: "2015",
      condition: "running",
    });
  });

  it("drops unknown condition values", () => {
    const raw = JSON.stringify({ condition: "BANANA" });
    expect(parsePersistedState(raw)).toEqual({});
  });

  it("preserves the empty-string condition (initial UI state)", () => {
    const raw = JSON.stringify({ condition: "" });
    expect(parsePersistedState(raw)).toEqual({ condition: "" });
  });

  it("rejects non-string make/model/year (e.g. corrupted entry)", () => {
    const raw = JSON.stringify({ make: 42, model: { x: 1 }, year: true });
    expect(parsePersistedState(raw)).toEqual({});
  });

  it("rejects step values outside 1-3", () => {
    expect(parsePersistedState(JSON.stringify({ step: 0 }))).toEqual({});
    expect(parsePersistedState(JSON.stringify({ step: 4 }))).toEqual({});
    expect(parsePersistedState(JSON.stringify({ step: "2" }))).toEqual({});
  });

  it("ignores extra unknown fields", () => {
    const raw = JSON.stringify({ make: "Ford", surprise: "data", admin: true });
    expect(parsePersistedState(raw)).toEqual({ make: "Ford" });
  });
});
