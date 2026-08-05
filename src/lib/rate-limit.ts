import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitScope =
  | "forms"
  | "places"
  | "places-global"
  | "chat"
  | "chat-global";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  mode: "distributed" | "local";
}

const WINDOW_MS = 60_000;
const POLICIES: Record<RateLimitScope, { limit: number; prefix: string }> = {
  forms: { limit: 10, prefix: "caraway:ratelimit:forms" },
  places: { limit: 30, prefix: "caraway:ratelimit:places" },
  // Site-wide circuit breaker for the Places proxy (identifier "global").
  // Caps total upstream spend per minute no matter how many IPs an abuser
  // rotates through; legitimate traffic rarely exceeds a few calls/min.
  "places-global": { limit: 300, prefix: "caraway:ratelimit:places-global" },
  // AI requests have a real per-call cost. Keep the visitor limit generous
  // enough for a useful conversation, while the global circuit breaker caps
  // spend even when an attacker rotates IP addresses.
  chat: { limit: 12, prefix: "caraway:ratelimit:chat" },
  "chat-global": { limit: 120, prefix: "caraway:ratelimit:chat-global" },
};

const localBuckets = new Map<
  string,
  { count: number; reset: number }
>();

let distributedLimiters:
  | Record<RateLimitScope, Ratelimit>
  | null
  | undefined;

export function isDistributedRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function getDistributedLimiters(): Record<RateLimitScope, Ratelimit> | null {
  if (distributedLimiters !== undefined) return distributedLimiters;
  if (!isDistributedRateLimitConfigured()) {
    distributedLimiters = null;
    return distributedLimiters;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  distributedLimiters = Object.fromEntries(
    (Object.keys(POLICIES) as RateLimitScope[]).map((scope) => [
      scope,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(POLICIES[scope].limit, "1 m"),
        analytics: false,
        prefix: POLICIES[scope].prefix,
        timeout: 1_500,
      }),
    ]),
  ) as Record<RateLimitScope, Ratelimit>;

  return distributedLimiters;
}

function localLimit(scope: RateLimitScope, identifier: string): RateLimitResult {
  const policy = POLICIES[scope];
  const key = `${scope}:${identifier}`;
  const now = Date.now();
  const bucket = localBuckets.get(key);

  if (!bucket || bucket.reset <= now) {
    const reset = now + WINDOW_MS;
    localBuckets.set(key, { count: 1, reset });
    return {
      success: true,
      limit: policy.limit,
      remaining: policy.limit - 1,
      reset,
      mode: "local",
    };
  }

  bucket.count += 1;
  const success = bucket.count <= policy.limit;

  if (localBuckets.size > 5_000) {
    for (const [bucketKey, value] of localBuckets.entries()) {
      if (value.reset <= now) localBuckets.delete(bucketKey);
    }
  }

  return {
    success,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - bucket.count),
    reset: bucket.reset,
    mode: "local",
  };
}

export async function rateLimit(
  scope: RateLimitScope,
  identifier: string,
): Promise<RateLimitResult> {
  const limiters = getDistributedLimiters();
  if (!limiters) return localLimit(scope, identifier);

  try {
    const result = await limiters[scope].limit(identifier);
    if (result.reason === "timeout") {
      console.error(
        `[rate-limit] ${scope} distributed check timed out; using local fallback`,
      );
      return localLimit(scope, identifier);
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
      `[rate-limit] ${scope} distributed check failed; using local fallback:`,
      error instanceof Error ? error.message : String(error),
    );
    return localLimit(scope, identifier);
  }
}

export function getClientIp(request: Pick<Request, "headers">): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
