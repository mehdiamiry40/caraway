const encoder = new TextEncoder();

export const PLACES_SESSION_COOKIE = "caraway_places_session";
export const PLACES_NONCE_COOKIE = "caraway_places_nonce";
export const PLACES_NONCE_HEADER = "x-caraway-places-nonce";
export const PLACES_SESSION_TTL_MS = 10 * 60 * 1000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signPayload(secret: string, payload: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export async function issuePlacesSession(params: {
  secret: string;
  clientIp: string;
  userAgent: string;
  now?: number;
}) {
  const now = params.now ?? Date.now();
  const expiresAt = now + PLACES_SESSION_TTL_MS;
  const nonce = randomNonce();
  const payload = `${expiresAt}.${nonce}.${params.clientIp}.${params.userAgent}`;
  const signature = await signPayload(params.secret, payload);

  return {
    nonce,
    token: `${expiresAt}.${nonce}.${signature}`,
    expiresAt,
  };
}

export async function verifyPlacesSession(params: {
  secret: string;
  token: string | undefined;
  nonce: string | undefined;
  clientIp: string;
  userAgent: string;
  now?: number;
}) {
  const token = params.token?.trim();
  const nonce = params.nonce?.trim();
  if (!token || !nonce) return false;

  const [expiresRaw, tokenNonce, signature] = token.split(".");
  if (!expiresRaw || !tokenNonce || !signature) return false;
  if (tokenNonce !== nonce) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= (params.now ?? Date.now())) {
    return false;
  }

  const payload = `${expiresAt}.${tokenNonce}.${params.clientIp}.${params.userAgent}`;
  const expected = await signPayload(params.secret, payload);
  return constantTimeEqual(expected, signature);
}
