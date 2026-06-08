import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitScope = "forms" | "places";

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

  distributedLimiters = {
    forms: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(POLICIES.forms.limit, "1 m"),
      analytics: false,
      prefix: POLICIES.forms.prefix,
      timeout: 1_500,
    }),
    places: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(POLICIES.places.limit, "1 m"),
      analytics: false,
      prefix: POLICIES.places.prefix,
      timeout: 1_500,
    }),
  };

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
