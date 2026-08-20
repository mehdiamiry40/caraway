import { SITE_URL } from "@/lib/site";

/**
 * IndexNow key. The same value is served as a plain-text file at
 * `${SITE_URL}/${INDEXNOW_KEY}.txt`, which is how the receiving engines
 * verify we are allowed to submit URLs for this host.
 *
 * Rotating it means renaming that file in `public/` to match.
 */
export const INDEXNOW_KEY = "6e594df3508e5450fa02564903a80125";

/** Shared submission endpoint; it forwards to every participating engine. */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

/** IndexNow rejects batches larger than this. */
export const INDEXNOW_MAX_URLS = 10_000;

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

/**
 * Build a submission body. Only same-origin URLs are accepted — the engines
 * reject a batch outright if any entry is off-host, so filtering here keeps
 * one stray URL from discarding the whole submission.
 */
export function buildIndexNowPayload(urls: string[]): IndexNowPayload | null {
  const host = new URL(SITE_URL).host;
  const sameHost = urls.filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });
  const unique = Array.from(new Set(sameHost)).slice(0, INDEXNOW_MAX_URLS);
  if (unique.length === 0) return null;

  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: unique,
  };
}
