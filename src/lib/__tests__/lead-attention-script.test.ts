import { describe, expect, it, vi } from "vitest";
import type { Redis } from "@upstash/redis";
import { LEAD_RETENTION_MS, redisLeadStore, type LeadRecord } from "@/lib/lead-store";
import { describeRecord, parseArgs } from "../../../scripts/lead-attention.mjs";

const CAPTURED = Date.parse("2026-09-05T00:00:00.000Z");

function parked(overrides: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: `${CAPTURED}-11111111-2222-4333-8444-555555555555`,
    kind: "quote",
    fingerprint: "synthetic",
    version: 3,
    createdAt: CAPTURED,
    expiresAt: CAPTURED + LEAD_RETENTION_MS,
    payload: {
      name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
      condition: "running", suburb: "Brisbane", honeypot: "",
    },
    channels: {
      email: {
        state: "manual", configurationHash: "email", attempts: 91,
        firstAttemptAt: CAPTURED, nextAttemptAt: CAPTURED, reason: "provider_not_confirmed",
      },
      webhook: { state: "disabled", configurationHash: "webhook", attempts: 0, nextAttemptAt: CAPTURED },
    },
    ...overrides,
  };
}

describe("lead attention tool", () => {
  it("requires an explicit environment so the wrong database prefix is never guessed", () => {
    expect(() => parseArgs([])).toThrow("--environment must be one of");
    expect(() => parseArgs(["--environment=staging"])).toThrow("--environment must be one of");
    expect(() => parseArgs(["--environment=preview"])).toThrow("--branch is required");
    expect(() => parseArgs(["--environment=production", "--force"])).toThrow("Unknown option --force");
  });

  it("lists by default and only accepts a complete resolve command", () => {
    expect(parseArgs(["--environment=production"])).toMatchObject({ command: "list", environment: "production" });
    expect(parseArgs(["--env-file=.env.production.local", "--environment=production", "list"]))
      .toMatchObject({ command: "list", envFile: ".env.production.local" });
    expect(parseArgs(["--environment=preview", "--branch=fix/leads", "resolve", "contact", "abc"]))
      .toMatchObject({ command: "resolve", kind: "contact", id: "abc", branch: "fix/leads" });
    for (const incomplete of [["resolve"], ["resolve", "quote"], ["resolve", "invoice", "abc"], ["resolve", "quote", "abc", "extra"], ["requeue", "quote", "abc"]]) {
      expect(() => parseArgs(["--environment=production", ...incomplete])).toThrow("Usage: resolve");
    }
  });

  it("prints who to contact, why delivery stopped and when the copy expires", () => {
    const text = describeRecord(parked());
    expect(text).toContain(`quote ${CAPTURED}-11111111-2222-4333-8444-555555555555`);
    expect(text).toContain("email: manual, provider_not_confirmed, 91 attempt(s)");
    expect(text).toContain("name: Jane Doe");
    expect(text).toContain("phone: 0412345678");
    // Month abbreviations differ between ICU releases ("Sep" and "Sept").
    expect(text).toMatch(/Captured 5 Sept? 2026, 10:00\s?am; website copy expires 12 Sept? 2026/);
    expect(text).not.toContain("webhook");
    expect(text).not.toContain("honeypot");
  });

  it("says when an enquiry was labelled possible spam, and only then", () => {
    expect(describeRecord(parked())).not.toMatch(/spam/i);
    expect(describeRecord({ ...parked(), possibleSpam: true })).toContain(
      "Labelled possible spam: the form's hidden field was filled in",
    );
  });

  it("strips terminal control sequences from customer-supplied text", () => {
    const record = parked();
    record.payload = { ...record.payload, name: "Jane\u001b[2J\u001b]0;owned\u0007 Doe\r\nphone: 000" };
    const text = describeRecord(record);
    expect(text).not.toMatch(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/);
    expect(text.split("\n").filter((line) => line.trimStart().startsWith("phone:"))).toEqual(["  phone: 0412345678"]);
  });
});

describe("Redis attention listing", () => {
  it("reads waiting enquiries from the pending index", async () => {
    const waiting = parked();
    waiting.channels.email.state = "retry";
    const redis = { zrange: vi.fn(async () => [`quote:${waiting.id}`]), mget: vi.fn(async () => [waiting]) };
    const store = redisLeadStore(redis as unknown as Redis, "caraway:test");

    expect(await store.waiting(50)).toEqual([waiting]);
    expect(redis.zrange).toHaveBeenCalledExactlyOnceWith("caraway:test:pending", 0, 49);
  });

  it("reads the attention index in expiry order and skips expired or malformed members", async () => {
    const first = parked();
    const second = parked({ id: `${CAPTURED}-99999999-2222-4333-8444-555555555555`, kind: "contact" });
    const redis = {
      zrange: vi.fn(async () => [
        `quote:${first.id}`, "invoice:not-a-lead", "quote:", `contact:${second.id}`, "quote:expired-id",
      ]),
      mget: vi.fn(async () => [first, second, null]),
    };
    const store = redisLeadStore(redis as unknown as Redis, "caraway:test");

    expect(await store.attention(25)).toEqual([first, second]);
    expect(redis.zrange).toHaveBeenCalledExactlyOnceWith("caraway:test:attention", 0, 24);
    expect(redis.mget).toHaveBeenCalledExactlyOnceWith(
      `caraway:test:quote:${first.id}`, `caraway:test:contact:${second.id}`, "caraway:test:quote:expired-id",
    );
  });

  it("does not query records when nothing is parked", async () => {
    const redis = { zrange: vi.fn(async () => []), mget: vi.fn() };
    expect(await redisLeadStore(redis as unknown as Redis, "caraway:test").attention(25)).toEqual([]);
    expect(redis.mget).not.toHaveBeenCalled();
  });
});
