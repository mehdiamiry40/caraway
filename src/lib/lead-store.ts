import { createHash, randomUUID } from "node:crypto";
import type { Redis } from "@upstash/redis";
import { createLeadRedis, getRedisCredentials } from "./redis-connection";
import type { LeadKind } from "./lead-config";
import type { QuoteFormValues, ContactFormValues } from "./quote-schema";

export type LeadChannel = "email" | "webhook";
export type ChannelState =
  "pending" | "sending" | "retry" | "accepted" | "manual" | "disabled";
export interface ChannelDelivery {
  state: ChannelState;
  configurationHash: string;
  attempts: number;
  firstAttemptAt?: number;
  nextAttemptAt: number;
  leaseUntil?: number;
  leaseToken?: string;
  providerId?: string;
  reason?: string;
}
export interface LeadRecord {
  id: string;
  kind: LeadKind;
  fingerprint: string;
  version: number;
  createdAt: number;
  expiresAt: number;
  payload: QuoteFormValues | ContactFormValues;
  channels: Record<LeadChannel, ChannelDelivery>;
}

export const LEAD_RETENTION_MS = 7 * 24 * 60 * 60 * 1_000;
export const MAX_NEW_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1_000;
export const EMAIL_RETRY_WINDOW_MS = 22 * 60 * 60 * 1_000;
export const DELIVERY_LEASE_MS = 30_000;
const MAX_ATTEMPTS = 4;

export function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function namespace() {
  const environment =
    process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV || "development";
  const branch =
    environment === "preview"
      ? (process.env.VERCEL_GIT_COMMIT_REF ?? "preview")
      : "";
  return `caraway:leads:v1:${environment}:${fingerprint(branch).slice(0, 12)}`;
}

function queueState(record: LeadRecord) {
  const active = Object.values(record.channels).flatMap((channel) => {
    if (channel.state === "sending")
      return [channel.leaseUntil ?? record.createdAt];
    if (channel.state === "pending" || channel.state === "retry")
      return [channel.nextAttemptAt];
    return [];
  });
  return {
    due: active.length ? Math.min(...active) : -1,
    attention: Object.values(record.channels).some(
      (channel) => channel.state === "manual",
    ),
  };
}

// All key types are checked before writes: Lua errors do not roll back Redis writes.
const WRITE = `
  for i=2,3 do
    local t=redis.call('TYPE',KEYS[i]).ok
    if t~='none' and t~='zset' then return redis.error_reply('Invalid lead index type') end
  end
  local old=redis.call('GET',KEYS[1])
  if ARGV[1]=='create' then
    if old then return 0 end
  elseif not old or cjson.decode(old).version~=tonumber(ARGV[1]) then
    return 0
  end
  redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3])
  if tonumber(ARGV[5])<0 then redis.call('ZREM',KEYS[2],ARGV[4])
  else redis.call('ZADD',KEYS[2],ARGV[5],ARGV[4]) end
  if ARGV[6]=='1' then redis.call('ZADD',KEYS[3],ARGV[7],ARGV[4])
  else redis.call('ZREM',KEYS[3],ARGV[4]) end
  return 1
`;

export interface LeadStore {
  read(kind: LeadKind, id: string): Promise<LeadRecord | null>;
  create(record: LeadRecord): Promise<boolean>;
  replace(previous: LeadRecord, next: LeadRecord): Promise<boolean>;
  due(limit: number): Promise<Array<{ kind: LeadKind; id: string }>>;
  health(): Promise<{ pending: number; attention: number }>;
}

export function redisLeadStore(redis: Redis, prefix = namespace()): LeadStore {
  const pending = `${prefix}:pending`;
  const attention = `${prefix}:attention`;
  const key = (kind: LeadKind, id: string) => `${prefix}:${kind}:${id}`;
  const write = async (record: LeadRecord, version: string) => {
    const state = queueState(record);
    const ttl = Math.ceil((record.expiresAt - Date.now()) / 1_000);
    if (ttl <= 0) throw new Error("Lead record expired");
    return (
      (await redis.eval<Array<string | number>, number>(
        WRITE,
        [key(record.kind, record.id), pending, attention],
        [
          version,
          JSON.stringify(record),
          ttl,
          `${record.kind}:${record.id}`,
          state.due,
          state.attention ? "1" : "0",
          record.expiresAt,
        ],
      )) === 1
    );
  };
  return {
    read: (kind, id) => redis.get<LeadRecord>(key(kind, id)),
    create: (record) => write(record, "create"),
    replace: (previous, next) => write(next, String(previous.version)),
    async due(limit) {
      const members = await redis.zrange<string[]>(pending, 0, Date.now(), {
        byScore: true,
        offset: 0,
        count: limit,
      });
      const result: Array<{ kind: LeadKind; id: string }> = [];
      const candidates = members.map((member) => ({
        member,
        parts: member.split(":"),
      }));
      const valid = candidates.filter(
        ({ parts: [kind, id] }) =>
          (kind === "quote" || kind === "contact") && id,
      );
      const records = valid.length
        ? await redis.mget<Array<LeadRecord | null>>(
            ...valid.map(({ parts: [kind, id] }) => key(kind as LeadKind, id)),
          )
        : [];
      let index = 0;
      const missing: string[] = [];
      for (const member of members) {
        const [kind, id] = member.split(":");
        const valid = (kind === "quote" || kind === "contact") && Boolean(id);
        const record = valid ? records[index++] : null;
        if (!valid || !record) {
          missing.push(member);
        } else result.push({ kind, id });
      }
      if (missing.length) await redis.zrem(pending, ...missing);
      return result;
    },
    async health() {
      await redis.zremrangebyscore(attention, 0, Date.now());
      const [pendingCount, attentionCount] = await Promise.all([
        redis.zcard(pending),
        redis.zcard(attention),
      ]);
      return { pending: pendingCount, attention: attentionCount };
    },
  };
}

// Development/test only, matching the existing local delivery mock. Never a
// fallback from a configured/unreachable production database.
function memoryLeadStore(): LeadStore {
  const rows = new Map<string, LeadRecord>();
  const key = (kind: LeadKind, id: string) => `${kind}:${id}`;
  const read = async (kind: LeadKind, id: string) => {
    const record = rows.get(key(kind, id));
    if (!record || record.expiresAt <= Date.now()) {
      rows.delete(key(kind, id));
      return null;
    }
    return structuredClone(record);
  };
  return {
    read,
    async create(record) {
      const k = key(record.kind, record.id);
      if (rows.has(k)) return false;
      rows.set(k, structuredClone(record));
      return true;
    },
    async replace(previous, next) {
      const k = key(previous.kind, previous.id);
      if (rows.get(k)?.version !== previous.version) return false;
      rows.set(k, structuredClone(next));
      return true;
    },
    async due(limit) {
      return [...rows.values()]
        .filter(
          (r) =>
            r.expiresAt > Date.now() &&
            queueState(r).due >= 0 &&
            queueState(r).due <= Date.now(),
        )
        .sort((a, b) => queueState(a).due - queueState(b).due)
        .slice(0, limit)
        .map(({ kind, id }) => ({ kind, id }));
    },
    async health() {
      const live = [...rows.values()].filter((r) => r.expiresAt > Date.now());
      return {
        pending: live.filter((r) => queueState(r).due >= 0).length,
        attention: live.filter((r) => queueState(r).attention).length,
      };
    },
  };
}

const localStore = memoryLeadStore();
export function getLeadStore(): LeadStore {
  const redis = createLeadRedis();
  if (redis) return redisLeadStore(redis);
  const configured = Boolean(
    process.env.KV_REST_API_URL ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_TOKEN,
  );
  if (
    !configured &&
    (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
  )
    return localStore;
  throw new Error("Lead storage unavailable");
}

export function isLeadStorageConfigured() {
  return getRedisCredentials() !== null;
}

async function update(
  store: LeadStore,
  kind: LeadKind,
  id: string,
  change: (record: LeadRecord) => boolean,
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const previous = await store.read(kind, id);
    if (!previous) return null;
    const next = structuredClone(previous);
    if (!change(next)) return null;
    next.version = previous.version + 1;
    if (await store.replace(previous, next)) return next;
  }
  throw new Error("Concurrent lead update did not settle");
}

export async function claimDelivery(
  store: LeadStore,
  kind: LeadKind,
  id: string,
  channel: LeadChannel,
  configurationHash: string,
) {
  const token = randomUUID();
  const now = Date.now();
  const record = await update(store, kind, id, (row) => {
    const state = row.channels[channel];
    if (
      state.state === "accepted" ||
      state.state === "disabled" ||
      state.state === "manual"
    )
      return false;
    if (state.state === "sending" && (state.leaseUntil ?? 0) > now)
      return false;
    if (state.nextAttemptAt > now) return false;
    const oldAttempt = state.firstAttemptAt !== undefined;
    if (
      state.configurationHash !== configurationHash ||
      state.attempts >= MAX_ATTEMPTS ||
      (oldAttempt &&
        (channel === "webhook" ||
          now - state.firstAttemptAt! >= EMAIL_RETRY_WINDOW_MS))
    ) {
      state.state = "manual";
      state.reason = "delivery_requires_reconciliation";
      return true;
    }
    state.state = "sending";
    state.leaseToken = token;
    state.leaseUntil = now + DELIVERY_LEASE_MS;
    state.firstAttemptAt ??= now;
    state.attempts++;
    return true;
  });
  return record?.channels[channel].leaseToken === token &&
    record.channels[channel].state === "sending"
    ? { record, token }
    : null;
}

export async function finishDelivery(
  store: LeadStore,
  kind: LeadKind,
  id: string,
  channel: LeadChannel,
  token: string,
  outcome: {
    accepted: boolean;
    providerId?: string;
    retryable?: boolean;
    reason?: string;
  },
) {
  return update(store, kind, id, (row) => {
    const state = row.channels[channel];
    if (state.state !== "sending" || state.leaseToken !== token) return false;
    delete state.leaseToken;
    delete state.leaseUntil;
    if (outcome.accepted) {
      state.state = "accepted";
      state.providerId = outcome.providerId;
      delete state.reason;
    } else {
      const canRetry =
        channel === "email" &&
        outcome.retryable &&
        state.attempts < MAX_ATTEMPTS &&
        Date.now() - state.firstAttemptAt! < EMAIL_RETRY_WINDOW_MS;
      state.state = canRetry ? "retry" : "manual";
      state.reason = outcome.reason ?? "provider_unavailable";
      state.nextAttemptAt =
        Date.now() + Math.min(60_000 * 2 ** (state.attempts - 1), 15 * 60_000);
    }
    return true;
  });
}
