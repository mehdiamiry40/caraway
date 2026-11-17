import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitScope =
  | "forms"
  | "forms-global"
  | "chat"
  | "chat-global";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  mode: "distributed" | "local" | "outage" | "unavailable";
}

const WINDOW_MS = 60_000;
const POLICIES: Record<RateLimitScope, { limit: number }> = {
  forms: { limit: 10 },
  // Deployment-wide ceiling for schema-valid lead attempts. This is consumed
  // once immediately before email/webhook work, not by malformed requests.
  "forms-global": { limit: 100 },
  // AI requests have a real per-call cost. Keep the visitor limit generous
  // enough for a useful conversation, while the global circuit breaker caps
  // spend even when an attacker rotates IP addresses.
  chat: { limit: 12 },
  "chat-global": { limit: 120 },
};

// Counters are kept per environment. Preview and production can share one
// database, and traffic to a preview must not draw down production's
// allowances, least of all the deployment-wide ones.
function counterPrefix(scope: RateLimitScope): string {
  const environment =
    process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV || "development";
  return `caraway:ratelimit:${environment.replace(/[^a-z0-9-]/gi, "_")}:${scope}`;
}

// Used only while the shared counters cannot be reached (see leadRateLimit).
// These are counted inside one server instance and several instances can be
// running, each with its own count, so they are set well below POLICIES. The
// shared figure also bounds how many enquiries one instance will email
// directly in a minute; genuine traffic is a few enquiries a day.
type LeadScope = "forms" | "forms-global";
const OUTAGE_POLICIES: Record<LeadScope, { limit: number }> = {
  forms: { limit: 4 },
  "forms-global": { limit: 10 },
};

const localBuckets = new Map<
  string,
  { count: number; reset: number }
>();

let distributedLimiters:
  | Record<RateLimitScope, Ratelimit>
  | null
  | undefined;

interface DistributedRateLimitCredentials {
  url: string;
  token: string;
}

function getCompleteCredentialPair(
  url: string | undefined,
  token: string | undefined,
): DistributedRateLimitCredentials | null {
  if (!url || !token) return null;
  return { url, token };
}

function getDistributedRateLimitCredentials(): DistributedRateLimitCredentials | null {
  const explicit = getCompleteCredentialPair(
    process.env.UPSTASH_REDIS_REST_URL?.trim(),
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
  const marketplace = getCompleteCredentialPair(
    process.env.KV_REST_API_URL?.trim(),
    process.env.KV_REST_API_TOKEN?.trim(),
  );
  const credentials = explicit ?? marketplace;

  if (!credentials) return null;

  try {
    if (new URL(credentials.url).protocol !== "https:") return null;
  } catch {
    return null;
  }

  return credentials;
}

export function isDistributedRateLimitConfigured(): boolean {
  return getDistributedRateLimitCredentials() !== null;
}

function getDistributedLimiters(): Record<RateLimitScope, Ratelimit> | null {
  if (distributedLimiters !== undefined) return distributedLimiters;
  const credentials = getDistributedRateLimitCredentials();
  if (!credentials) {
    distributedLimiters = null;
    return distributedLimiters;
  }

  const redis = new Redis(credentials);

  distributedLimiters = Object.fromEntries(
    (Object.keys(POLICIES) as RateLimitScope[]).map((scope) => [
      scope,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(POLICIES[scope].limit, "1 m"),
        analytics: false,
        prefix: counterPrefix(scope),
        timeout: 1_500,
      }),
    ]),
  ) as Record<RateLimitScope, Ratelimit>;

  return distributedLimiters;
}

function countInThisInstance(
  key: string,
  limit: number,
  mode: "local" | "outage",
): RateLimitResult {
  const now = Date.now();
  const bucket = localBuckets.get(key);

  if (!bucket || bucket.reset <= now) {
    const reset = now + WINDOW_MS;
    localBuckets.set(key, { count: 1, reset });
    return { success: true, limit, remaining: limit - 1, reset, mode };
  }

  bucket.count += 1;
  const success = bucket.count <= limit;

  if (localBuckets.size > 5_000) {
    for (const [bucketKey, value] of localBuckets.entries()) {
      if (value.reset <= now) localBuckets.delete(bucketKey);
    }
  }

  return {
    success,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.reset,
    mode,
  };
}

function localLimit(scope: RateLimitScope, identifier: string): RateLimitResult {
  return countInThisInstance(
    `${scope}:${identifier}`,
    POLICIES[scope].limit,
    "local",
  );
}

export function isLocalRateLimitFallbackAllowed(): boolean {
  return (
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
  );
}

function fallbackOrUnavailable(
  scope: RateLimitScope,
  identifier: string,
): RateLimitResult {
  if (isLocalRateLimitFallbackAllowed()) return localLimit(scope, identifier);

  return {
    success: false,
    limit: POLICIES[scope].limit,
    remaining: 0,
    reset: 0,
    mode: "unavailable",
  };
}

export async function rateLimit(
  scope: RateLimitScope,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const limiters = getDistributedLimiters();
    if (!limiters) return fallbackOrUnavailable(scope, identifier);

    const result = await limiters[scope].limit(identifier);
    if (result.reason === "timeout") {
      console.error(
        `[rate-limit] ${scope} distributed check timed out`,
      );
      return fallbackOrUnavailable(scope, identifier);
    }
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      mode: "distributed",
    };
  } catch (error) {
    console.error(
      `[rate-limit] ${scope} distributed check failed:`,
      error instanceof Error ? error.message : String(error),
    );
    return fallbackOrUnavailable(scope, identifier);
  }
}

/** Counts against the outage allowance without trying the shared counters. */
export function outageRateLimit(
  scope: LeadScope,
  identifier: string,
): RateLimitResult {
  return countInThisInstance(
    `outage:${scope}:${identifier}`,
    OUTAGE_POLICIES[scope].limit,
    "outage",
  );
}

/**
 * The limit for the public enquiry path: the request proxy, the submission ID
 * route and the form action.
 *
 * Everywhere else an unreachable counter store refuses the request. Here that
 * would turn every enquiry form into "please call us" for as long as the store
 * is down, so a sender who cannot be counted centrally is counted in this
 * server instance instead, against the smaller OUTAGE_POLICIES allowance. The
 * result says so with `mode: "outage"`.
 *
 * A deployment with no counter store configured at all is a setup mistake, not
 * an outage, and is still refused.
 */
export async function leadRateLimit(
  scope: LeadScope,
  identifier: string,
): Promise<RateLimitResult> {
  const result = await rateLimit(scope, identifier);
  return result.mode === "unavailable" && isDistributedRateLimitConfigured()
    ? outageRateLimit(scope, identifier)
    : result;
}

export function getClientIp(request: Pick<Request, "headers">): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
