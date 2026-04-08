"use server";

import type { ZodSchema } from "zod";
import { BUSINESS } from "@/lib/site";

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

  const endpoint = process.env[endpointEnvVar]?.trim();
  const isMockMode = process.env.NODE_ENV === "development" && !endpoint;

  try {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      if (!endpoint) {
        throw new Error(`${label} endpoint is not configured`);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(`${label} failed with status ${response.status}`);
      }
    }

    return { success: true as const };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`${label} Error:`, error);
    }
    return {
      success: false as const,
      message: `We couldn't send your request right now. Please call ${BUSINESS.phone}.`,
    };
  }
}
