import { Redis } from "@upstash/redis";

export function getRedisCredentials() {
  const pairs = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
  ];
  const pair = pairs.find(([url, token]) => url?.trim() && token?.trim());
  if (!pair) return null;
  const [url, token] = pair.map((value) => value!.trim());
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { url, token };
}

export function createLeadRedis() {
  const credentials = getRedisCredentials();
  return credentials
    ? new Redis({
        ...credentials,
        retry: false,
        signal: () => AbortSignal.timeout(2_000),
        enableAutoPipelining: false,
      })
    : null;
}
