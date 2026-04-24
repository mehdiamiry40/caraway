import { describe, expect, it } from "vitest";
import {
  issuePlacesSession,
  PLACES_SESSION_TTL_MS,
  verifyPlacesSession,
} from "@/lib/places-session";

const base = {
  secret: "places-test-secret",
  clientIp: "203.0.113.10",
  userAgent: "Vitest Browser",
};

describe("places session signing", () => {
  it("issues a token that verifies with the same nonce, IP, and user agent", async () => {
    const now = 1_800_000_000_000;
    const session = await issuePlacesSession({ ...base, now });

    await expect(
      verifyPlacesSession({
        ...base,
        token: session.token,
        nonce: session.nonce,
        now,
      }),
    ).resolves.toBe(true);
    expect(session.expiresAt).toBe(now + PLACES_SESSION_TTL_MS);
  });

  it("rejects expired sessions", async () => {
    const now = 1_800_000_000_000;
    const session = await issuePlacesSession({ ...base, now });

    await expect(
      verifyPlacesSession({
        ...base,
        token: session.token,
        nonce: session.nonce,
        now: session.expiresAt,
      }),
    ).resolves.toBe(false);
  });

  it("rejects a mismatched nonce, IP, user agent, or signature", async () => {
    const now = 1_800_000_000_000;
    const session = await issuePlacesSession({ ...base, now });

    await expect(
      verifyPlacesSession({
        ...base,
        token: session.token,
        nonce: "wrong-nonce",
        now,
      }),
    ).resolves.toBe(false);

    await expect(
      verifyPlacesSession({
        ...base,
        token: session.token,
        nonce: session.nonce,
        clientIp: "198.51.100.99",
        now,
      }),
    ).resolves.toBe(false);

    await expect(
      verifyPlacesSession({
        ...base,
        token: session.token,
        nonce: session.nonce,
        userAgent: "Different Browser",
        now,
      }),
    ).resolves.toBe(false);

    await expect(
      verifyPlacesSession({
        ...base,
        token: `${session.token}tampered`,
        nonce: session.nonce,
        now,
      }),
    ).resolves.toBe(false);
  });
});
