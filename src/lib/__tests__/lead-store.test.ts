import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  ChannelDelivery,
  LeadChannel,
  LeadRecord,
  LeadStore,
} from "@/lib/lead-store";

const START = Date.parse("2026-09-05T00:00:00.000Z");
const HOUR = 60 * 60 * 1_000;
const EMAIL_CONFIGURATION = "email-configuration";
const WEBHOOK_CONFIGURATION = "webhook-configuration";

let storage: typeof import("@/lib/lead-store");
let submissionIds: typeof import("@/lib/submission-id");
let store: LeadStore;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(START);
  vi.stubEnv("NODE_ENV", "test");
  for (const name of [
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ]) {
    vi.stubEnv(name, "");
  }
  fetchMock = vi.fn(() => {
    throw new Error("Lead store regression tests must not make network requests");
  });
  vi.stubGlobal("fetch", fetchMock);
  storage = await import("@/lib/lead-store");
  submissionIds = await import("@/lib/submission-id");
  store = storage.getLeadStore();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  expect(fetchMock).not.toHaveBeenCalled();
});

function channel(
  configurationHash: string,
  state: ChannelDelivery["state"] = "pending",
): ChannelDelivery {
  return { configurationHash, state, attempts: 0, nextAttemptAt: START };
}

function record(activeChannel: LeadChannel = "email"): LeadRecord {
  const payload = {
    name: "Audit Example",
    email: "audit@example.com",
    phone: "0400000000",
    message: "Synthetic storage regression test.",
    honeypot: "",
    marketingConsent: false,
  };
  return {
    id: submissionIds.createSubmissionId(),
    kind: "contact",
    fingerprint: storage.fingerprint(payload),
    version: 1,
    createdAt: START,
    expiresAt: START + storage.LEAD_RETENTION_MS,
    payload,
    channels: {
      email: channel(EMAIL_CONFIGURATION, activeChannel === "email" ? "pending" : "disabled"),
      webhook: channel(WEBHOOK_CONFIGURATION, activeChannel === "webhook" ? "pending" : "disabled"),
    },
  };
}

async function create(activeChannel: LeadChannel = "email") {
  const lead = record(activeChannel);
  expect(await store.create(lead)).toBe(true);
  return lead;
}

async function read(lead: LeadRecord) {
  const current = await store.read(lead.kind, lead.id);
  expect(current).not.toBeNull();
  return current!;
}

describe("submission identifiers", () => {
  it("preserves the issue time and rejects identifiers without a timestamp and UUID v4", () => {
    const first = submissionIds.createSubmissionId();
    const second = submissionIds.createSubmissionId();
    expect(first).not.toBe(second);
    expect(submissionIds.submissionIssuedAt(first)).toBe(START);
    for (const invalid of [
      undefined,
      START,
      "",
      "00000000-0000-4000-8000-000000000000",
      `${START}-00000000-0000-1000-8000-000000000000`,
      `${START}-00000000-0000-4000-0000-000000000000`,
      `${first}-extra`,
    ]) {
      expect(submissionIds.submissionIssuedAt(invalid)).toBeNull();
    }
  });
});

describe("local lead storage", () => {
  it("creates one record for concurrent duplicate submissions and preserves the first payload", async () => {
    const lead = record();
    const duplicate = structuredClone(lead);
    duplicate.payload.name = "Changed duplicate";
    duplicate.fingerprint = storage.fingerprint(duplicate.payload);

    const created = await Promise.all([store.create(lead), store.create(duplicate)]);

    expect(created).toEqual([true, false]);
    lead.payload.name = "Changed caller reference";
    const saved = await read(lead);
    expect(saved.payload.name).toBe("Audit Example");
    expect(saved.fingerprint).not.toBe(duplicate.fingerprint);
    saved.payload.name = "Changed read reference";
    expect((await read(lead)).payload.name).toBe("Audit Example");
  });

  it("uses version comparison to reject stale concurrent writes", async () => {
    const lead = await create();
    const previous = await read(lead);
    const first = structuredClone(previous);
    first.version++;
    first.channels.email.state = "accepted";
    const stale = structuredClone(previous);
    stale.version++;
    stale.channels.email.state = "manual";

    expect(await Promise.all([
      store.replace(previous, first),
      store.replace(previous, stale),
    ])).toEqual([true, false]);
    expect((await read(lead)).channels.email.state).toBe("accepted");
    expect(await store.replace(previous, stale)).toBe(false);
  });

  it("lets exactly one concurrent worker claim a channel", async () => {
    const lead = await create();
    const claims = await Promise.all(Array.from({ length: 8 }, () =>
      storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION),
    ));

    const winners = claims.filter((claim) => claim !== null);
    expect(winners).toHaveLength(1);
    expect((await read(lead)).channels.email).toMatchObject({
      state: "sending",
      attempts: 1,
      firstAttemptAt: START,
      leaseToken: winners[0]!.token,
      leaseUntil: START + 30_000,
    });
    expect(await store.due(10)).toEqual([]);
  });

  it("reclaims an expired email lease and rejects completion by the stale worker", async () => {
    const lead = await create();
    const first = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
    expect(first).not.toBeNull();
    vi.setSystemTime(START + 29_999);
    expect(await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION)).toBeNull();

    vi.setSystemTime(START + 30_000);
    expect(await store.due(10)).toEqual([{ kind: lead.kind, id: lead.id }]);
    const second = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
    expect(second).not.toBeNull();
    expect(second!.token).not.toBe(first!.token);
    expect(second!.record.channels.email.attempts).toBe(2);
    expect(await storage.finishDelivery(store, lead.kind, lead.id, "email", first!.token, {
      accepted: true,
      providerId: "stale-worker-provider-id",
    })).toBeNull();

    await storage.finishDelivery(store, lead.kind, lead.id, "email", second!.token, {
      accepted: true,
      providerId: "current-worker-provider-id",
    });
    const state = (await read(lead)).channels.email;
    expect(state).toMatchObject({ state: "accepted", attempts: 2, providerId: "current-worker-provider-id" });
    expect(state).not.toHaveProperty("leaseToken");
    expect(state).not.toHaveProperty("leaseUntil");
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
  });

  it("requires manual reconciliation after an unknown webhook outcome without replay", async () => {
    const lead = await create("webhook");
    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "webhook", WEBHOOK_CONFIGURATION);
    expect(claim).not.toBeNull();
    await storage.finishDelivery(store, lead.kind, lead.id, "webhook", claim!.token, {
      accepted: false,
      retryable: true,
      reason: "unknown_provider_outcome",
    });

    vi.setSystemTime(START + HOUR);
    expect(await storage.claimDelivery(store, lead.kind, lead.id, "webhook", WEBHOOK_CONFIGURATION)).toBeNull();
    expect((await read(lead)).channels.webhook).toMatchObject({
      state: "manual", attempts: 1, reason: "unknown_provider_outcome",
    });
    expect(await store.due(10)).toEqual([]);
    expect(await store.health()).toEqual({ pending: 0, attention: 1 });
  });

  it("moves an expired webhook lease to manual review instead of sending again", async () => {
    const lead = await create("webhook");
    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "webhook", WEBHOOK_CONFIGURATION);
    expect(claim).not.toBeNull();
    vi.setSystemTime(START + 30_000);

    expect(await storage.claimDelivery(store, lead.kind, lead.id, "webhook", WEBHOOK_CONFIGURATION)).toBeNull();
    expect((await read(lead)).channels.webhook).toMatchObject({
      state: "manual", attempts: 1, reason: "delivery_requires_reconciliation",
    });
    expect(await storage.finishDelivery(store, lead.kind, lead.id, "webhook", claim!.token, {
      accepted: true,
    })).toBeNull();
    expect(await store.health()).toEqual({ pending: 0, attention: 1 });
  });

  it("backs off retryable email failures up to a 15-minute ceiling and keeps retrying past four attempts", async () => {
    const lead = await create();
    const MINUTE = 60_000;
    const expectedDelays = [1, 2, 4, 8, 15, 15, 15].map((minutes) => minutes * MINUTE);
    for (const [index, delay] of expectedDelays.entries()) {
      const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
      expect(claim).not.toBeNull();
      expect(claim!.record.channels.email.attempts).toBe(index + 1);
      await storage.finishDelivery(store, lead.kind, lead.id, "email", claim!.token, {
        accepted: false, retryable: true, reason: "provider_temporarily_unavailable",
      });
      const current = (await read(lead)).channels.email;
      expect(current.state).toBe("retry");
      expect(current.nextAttemptAt - Date.now()).toBe(delay);
      vi.setSystemTime(current.nextAttemptAt - 1);
      expect(await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION)).toBeNull();
      expect(await store.due(10)).toEqual([]);
      vi.setSystemTime(current.nextAttemptAt);
    }
    expect(await store.health()).toEqual({ pending: 1, attention: 0 });
  });

  it("retries a failing email for the whole 22-hour window, then parks it for an operator", async () => {
    const lead = await create();
    let attempts = 0;
    for (;;) {
      const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
      if (!claim) break;
      attempts++;
      await storage.finishDelivery(store, lead.kind, lead.id, "email", claim.token, {
        accepted: false, retryable: true,
      });
      const current = (await read(lead)).channels.email;
      if (current.state !== "retry") break;
      vi.setSystemTime(current.nextAttemptAt);
    }

    const parked = (await read(lead)).channels.email;
    expect(parked.state).toBe("manual");
    expect(parked.attempts).toBe(attempts);
    expect(attempts).toBeGreaterThan(80);
    expect(Date.now() - parked.firstAttemptAt!).toBeGreaterThanOrEqual(22 * HOUR - storage.EMAIL_RETRY_MAX_DELAY_MS);
    expect(Date.now() - parked.firstAttemptAt!).toBeLessThanOrEqual(22 * HOUR);
    expect(await store.health()).toEqual({ pending: 0, attention: 1 });
  });

  it("reclaims an expired email lease on a later attempt while inside the retry window", async () => {
    const lead = record();
    lead.channels.email = {
      ...lead.channels.email,
      state: "sending", attempts: 4, firstAttemptAt: START,
      leaseToken: "fourth-worker", leaseUntil: START + 30_000,
    };
    await store.create(lead);
    vi.setSystemTime(START + 30_000);

    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);

    expect(claim).not.toBeNull();
    expect((await read(lead)).channels.email).toMatchObject({ state: "sending", attempts: 5 });
    expect(await storage.finishDelivery(store, lead.kind, lead.id, "email", "fourth-worker", {
      accepted: true,
    })).toBeNull();
  });

  it("sends a permanent email failure to manual review without retrying", async () => {
    const lead = await create();
    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
    expect(claim).not.toBeNull();

    await storage.finishDelivery(store, lead.kind, lead.id, "email", claim!.token, {
      accepted: false, retryable: false, reason: "provider_rejected_request",
    });

    expect((await read(lead)).channels.email).toMatchObject({
      state: "manual", attempts: 1, reason: "provider_rejected_request",
    });
    expect(await store.due(10)).toEqual([]);
  });

  it.each([
    { elapsed: 22 * HOUR - 1, expected: "sending" },
    { elapsed: 22 * HOUR, expected: "manual" },
  ] as const)("uses a strict 22-hour retry window at elapsed=$elapsed", async ({ elapsed, expected }) => {
    const lead = record();
    lead.channels.email = {
      ...lead.channels.email,
      state: "retry", attempts: 1, firstAttemptAt: START, nextAttemptAt: START + 60_000,
    };
    await store.create(lead);
    vi.setSystemTime(START + elapsed);

    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);

    expect(Boolean(claim)).toBe(expected === "sending");
    expect((await read(lead)).channels.email).toMatchObject({
      state: expected, attempts: expected === "sending" ? 2 : 1,
    });
  });

  it("does not schedule a retry when an email failure finishes at the 22-hour boundary", async () => {
    const lead = record();
    lead.channels.email = {
      ...lead.channels.email,
      state: "retry", attempts: 1, firstAttemptAt: START, nextAttemptAt: START + 60_000,
    };
    await store.create(lead);
    vi.setSystemTime(START + 22 * HOUR - 1);
    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
    expect(claim).not.toBeNull();
    vi.setSystemTime(START + 22 * HOUR);

    await storage.finishDelivery(store, lead.kind, lead.id, "email", claim!.token, {
      accepted: false, retryable: true,
    });

    expect((await read(lead)).channels.email.state).toBe("manual");
    expect(await store.due(10)).toEqual([]);
  });

  it.each(["email", "webhook"] as const)("quarantines %s delivery when its configuration changes", async (target) => {
    const lead = await create(target);

    expect(await storage.claimDelivery(store, lead.kind, lead.id, target, "changed-configuration")).toBeNull();

    expect((await read(lead)).channels[target]).toMatchObject({
      state: "manual", attempts: 0, reason: "delivery_requires_reconciliation",
    });
    const originalConfiguration = target === "email" ? EMAIL_CONFIGURATION : WEBHOOK_CONFIGURATION;
    expect(await storage.claimDelivery(store, lead.kind, lead.id, target, originalConfiguration)).toBeNull();
    expect(await store.health()).toEqual({ pending: 0, attention: 1 });
  });

  it("claims a record whose fingerprint is an accepted earlier form of the same destination", async () => {
    const lead = await create();

    expect(await storage.claimDelivery(
      store, lead.kind, lead.id, "email", "current-format", ["unrelated", EMAIL_CONFIGURATION],
    )).not.toBeNull();
    expect((await read(lead)).channels.email).toMatchObject({ state: "sending", attempts: 1 });
  });

  it("lists parked enquiries soonest-expiry first and clears them once an operator resolves them", async () => {
    const later = record();
    later.channels.email.state = "manual";
    later.channels.email.reason = "provider_not_confirmed";
    const sooner = record("webhook");
    sooner.channels.webhook.state = "manual";
    sooner.expiresAt = later.expiresAt - HOUR;
    const healthy = record();
    for (const lead of [later, sooner, healthy]) await store.create(lead);

    expect((await store.attention(10)).map((lead) => lead.id)).toEqual([sooner.id, later.id]);
    expect((await store.attention(1)).map((lead) => lead.id)).toEqual([sooner.id]);

    const resolved = await storage.resolveDelivery(store, later.kind, later.id);

    expect(resolved?.channels.email).toMatchObject({ state: "resolved", reason: "provider_not_confirmed" });
    expect(resolved?.expiresAt).toBe(later.expiresAt);
    expect((await store.attention(10)).map((lead) => lead.id)).toEqual([sooner.id]);
    expect(await store.health()).toEqual({ pending: 1, attention: 1 });
    expect(await storage.claimDelivery(store, later.kind, later.id, "email", EMAIL_CONFIGURATION)).toBeNull();
    expect(await storage.resolveDelivery(store, later.kind, later.id)).toBeNull();
    expect(await storage.resolveDelivery(store, healthy.kind, healthy.id)).toBeNull();
    expect((await read(healthy)).version).toBe(1);
  });

  it.each(["accepted", "disabled", "manual", "resolved"] as const)("does not claim a channel in terminal state %s", async (state) => {
    const lead = record();
    lead.channels.email.state = state;
    await store.create(lead);

    expect(await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION)).toBeNull();
    expect((await read(lead)).version).toBe(1);
  });

  it("expires payloads at seven days without extending retention for a delivery update", async () => {
    expect(storage.LEAD_RETENTION_MS).toBe(7 * 24 * HOUR);
    const lead = await create();
    vi.setSystemTime(START + 6 * 24 * HOUR);
    const claim = await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION);
    expect(claim).not.toBeNull();
    await storage.finishDelivery(store, lead.kind, lead.id, "email", claim!.token, { accepted: true });
    vi.setSystemTime(lead.expiresAt - 1);
    expect((await read(lead)).expiresAt).toBe(lead.expiresAt);
    vi.setSystemTime(lead.expiresAt);

    expect(await store.read(lead.kind, lead.id)).toBeNull();
    expect(await store.due(10)).toEqual([]);
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
    expect(await storage.claimDelivery(store, lead.kind, lead.id, "email", EMAIL_CONFIGURATION)).toBeNull();
  });

  it("orders and limits due work while counting future work and manual attention separately", async () => {
    const older = record();
    older.channels.email.nextAttemptAt = START - 1_000;
    const current = record("webhook");
    const future = record();
    future.channels.email.nextAttemptAt = START + 60_000;
    const sending = record();
    sending.channels.email = {
      ...sending.channels.email,
      state: "sending", attempts: 1, firstAttemptAt: START,
      leaseToken: "active-worker", leaseUntil: START + 30_000,
    };
    const manual = record();
    manual.channels.email.state = "manual";
    const mixed = record();
    mixed.channels.email.nextAttemptAt = START + 1_000;
    mixed.channels.webhook.state = "manual";
    const accepted = record();
    accepted.channels.email.state = "accepted";
    const expired = record();
    expired.expiresAt = START - 1;
    vi.setSystemTime(START - 2);
    await store.create(expired);
    vi.setSystemTime(START);
    for (const lead of [future, current, older, sending, manual, mixed, accepted]) {
      await store.create(lead);
    }

    expect(await store.health()).toEqual({ pending: 5, attention: 2 });
    expect(await store.due(1)).toEqual([{ kind: older.kind, id: older.id }]);
    expect(await store.due(10)).toEqual([
      { kind: older.kind, id: older.id },
      { kind: current.kind, id: current.id },
    ]);
    vi.setSystemTime(START + 30_000);
    expect(await store.due(10)).toEqual([
      { kind: older.kind, id: older.id },
      { kind: current.kind, id: current.id },
      { kind: mixed.kind, id: mixed.id },
      { kind: sending.kind, id: sending.id },
    ]);
  });

  it("refuses to fall back to memory in production or with incomplete Redis credentials", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => storage.getLeadStore()).toThrow("Lead storage unavailable");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("KV_REST_API_URL", "https://redis.example.com");
    expect(() => storage.getLeadStore()).toThrow("Lead storage unavailable");
  });
});
