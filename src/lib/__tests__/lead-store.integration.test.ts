import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import { afterAll, describe, expect, it } from "vitest";
import {
  claimDelivery,
  finishDelivery,
  redisLeadStore,
  LEAD_RETENTION_MS,
  type LeadRecord,
} from "../lead-store";
import { createSubmissionId } from "../submission-id";

// Opt in with a disposable Redis database. Never use production credentials.
const enabled = Boolean(
  process.env.LEAD_STORE_TEST_URL && process.env.LEAD_STORE_TEST_TOKEN,
);
describe.skipIf(!enabled)("Redis lead store atomicity", () => {
  const redis = new Redis({
    url: process.env.LEAD_STORE_TEST_URL ?? "https://unused.upstash.io",
    token: process.env.LEAD_STORE_TEST_TOKEN ?? "unused",
    retry: false,
  });
  const prefix = `caraway:test:${randomUUID()}`;
  const store = redisLeadStore(redis, prefix);
  const keys = [`${prefix}:pending`, `${prefix}:attention`];
  const record = (): LeadRecord => {
    const id = createSubmissionId();
    keys.push(`${prefix}:quote:${id}`);
    return {
      id,
      kind: "quote",
      version: 1,
      createdAt: Date.now(),
      expiresAt: Date.now() + LEAD_RETENTION_MS,
      fingerprint: "synthetic",
      payload: {
        name: "Synthetic fixture",
        phone: "0400000000",
        make: "Example",
        model: "Fixture",
        year: 2000,
        condition: "running",
        suburb: "Brisbane",
        honeypot: "",
      },
      channels: {
        email: {
          state: "pending",
          configurationHash: "fixed",
          attempts: 0,
          nextAttemptAt: 0,
        },
        webhook: {
          state: "disabled",
          configurationHash: "none",
          attempts: 0,
          nextAttemptAt: 0,
        },
      },
    };
  };
  afterAll(async () => {
    await redis.del(...keys);
  });
  it("atomically captures and claims once, preserving TTL and provider receipt", async () => {
    const row = record();
    const captures = await Promise.all(
      Array.from({ length: 12 }, () => store.create(row)),
    );
    expect(captures.filter(Boolean)).toHaveLength(1);
    expect(await store.due(12)).toContainEqual({ kind: "quote", id: row.id });
    const ttl = await redis.ttl(`${prefix}:quote:${row.id}`);
    expect(ttl).toBeGreaterThan(604_700);
    expect(ttl).toBeLessThanOrEqual(604_800);
    const claims = await Promise.all(
      Array.from({ length: 8 }, () =>
        claimDelivery(store, "quote", row.id, "email", "fixed"),
      ),
    );
    const winner = claims.find(Boolean)!;
    expect(claims.filter(Boolean)).toHaveLength(1);
    expect(winner.record.channels.email.attempts).toBe(1);
    expect(
      await finishDelivery(store, "quote", row.id, "email", "wrong-token", {
        accepted: true,
      }),
    ).toBeNull();
    await finishDelivery(store, "quote", row.id, "email", winner.token, {
      accepted: true,
      providerId: "synthetic-receipt",
    });
    expect((await store.read("quote", row.id))?.channels.email).toMatchObject({
      state: "accepted",
      providerId: "synthetic-receipt",
      attempts: 1,
    });
    expect(
      await claimDelivery(store, "quote", row.id, "email", "fixed"),
    ).toBeNull();
    expect(await store.due(12)).not.toContainEqual({
      kind: "quote",
      id: row.id,
    });
  }, 30_000);
  it("does not create a partial record if an index has the wrong type", async () => {
    const brokenPrefix = `${prefix}:broken`;
    const broken = redisLeadStore(redis, brokenPrefix);
    const row = record();
    keys.push(
      `${brokenPrefix}:pending`,
      `${brokenPrefix}:attention`,
      `${brokenPrefix}:quote:${row.id}`,
    );
    await redis.set(`${brokenPrefix}:pending`, "wrong type");
    await expect(broken.create(row)).rejects.toThrow();
    expect(await broken.read("quote", row.id)).toBeNull();
  });
  it("removes expired record references from the pending queue", async () => {
    const row = record();
    await store.create(row);
    await redis.del(`${prefix}:quote:${row.id}`);
    expect(await store.due(12)).not.toContainEqual({
      kind: "quote",
      id: row.id,
    });
    expect(
      await redis.zscore(`${prefix}:pending`, `quote:${row.id}`),
    ).toBeNull();
  });
});
