"use server";

import type { ZodSchema } from "zod";
import { FORM_FETCH_TIMEOUT_MS, FORM_MOCK_DELAY_MS } from "@/data/constants";
import { getEnv } from "@/lib/env";
import { validateEndpoint } from "@/lib/validate-endpoint";

const ALLOWED_ENDPOINTS = ["QUOTE_ENDPOINT", "CONTACT_ENDPOINT"] as const;
type AllowedEndpoint = (typeof ALLOWED_ENDPOINTS)[number];

interface SubmitFormOptions {
  schema: ZodSchema;
  data: unknown;
  endpointEnvVar: AllowedEndpoint;
  label: string;
}

export async function submitForm({ schema, data, endpointEnvVar, label }: SubmitFormOptions) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, message: "Invalid form data" };
  }

  if (!ALLOWED_ENDPOINTS.includes(endpointEnvVar)) {
    return { success: false as const, message: "Invalid endpoint" };
  }

  const env = getEnv();
  const endpoint = env[endpointEnvVar]?.trim();
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
        redirect: "error",
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
