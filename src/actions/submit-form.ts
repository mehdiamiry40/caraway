"use server";

import type { ZodSchema } from "zod";
import { FORM_FETCH_TIMEOUT_MS, FORM_MOCK_DELAY_MS } from "@/data/constants";

const ALLOWED_ENDPOINTS = ["QUOTE_ENDPOINT", "CONTACT_ENDPOINT"] as const;
type AllowedEndpoint = (typeof ALLOWED_ENDPOINTS)[number];

interface SubmitFormOptions {
  schema: ZodSchema;
  data: unknown;
  endpointEnvVar: AllowedEndpoint;
  label: string;
}

/**
 * Validate that an outbound endpoint URL is safe to fetch.
 *
 * - Must be https (no plaintext, no file://, no data:, etc.)
 * - Must not target loopback, link-local, or well-known private ranges
 *   (basic SSRF hardening — this is not a full private IP check).
 * - Optionally restricted to an allowlist via ALLOWED_ENDPOINT_HOSTS
 *   (comma-separated host names). When unset, any public https host is allowed.
 */
function validateEndpoint(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }

  if (u.protocol !== "https:") return false;

  const hostname = u.hostname.toLowerCase();

  const blockedHosts = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254", // AWS/GCP instance metadata
    "metadata.google.internal",
  ]);
  if (blockedHosts.has(hostname)) return false;

  // Block RFC1918 and link-local ranges by prefix match.
  if (hostname.startsWith("10.")) return false;
  if (hostname.startsWith("192.168.")) return false;
  if (hostname.startsWith("169.254.")) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;

  const allowlistRaw = process.env.ALLOWED_ENDPOINT_HOSTS?.trim();
  if (allowlistRaw) {
    const allowed = allowlistRaw
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    if (!allowed.includes(hostname)) return false;
  }

  return true;
}

export async function submitForm({ schema, data, endpointEnvVar, label }: SubmitFormOptions) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, message: "Invalid form data" };
  }

  if (!ALLOWED_ENDPOINTS.includes(endpointEnvVar)) {
    return { success: false as const, message: "Invalid endpoint" };
  }

  const endpoint = process.env[endpointEnvVar]?.trim();
  const isMockMode = process.env.NODE_ENV === "development" && !endpoint;

  try {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, FORM_MOCK_DELAY_MS));
    } else {
      if (!endpoint) {
        throw new Error(`${label} endpoint is not configured`);
      }

      if (!validateEndpoint(endpoint)) {
        throw new Error(`${label} endpoint failed URL allowlist validation`);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(FORM_FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`${label} failed with status ${response.status}`);
      }
    }

    return { success: true as const };
  } catch (error) {
    console.error(`[submit-form] ${label} failed:`, error);
    return {
      success: false as const,
      message: `We couldn't send your request. Please try again or use the form below.`,
    };
  }
}
