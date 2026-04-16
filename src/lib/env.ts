import { z } from "zod";

const envSchema = z.object({
  QUOTE_ENDPOINT: z.string().url().optional(),
  CONTACT_ENDPOINT: z.string().url().optional(),
  // Optional defense-in-depth allowlist. When unset, outbound endpoints
  // are still protected from SSRF via the private-IP block in
  // validate-endpoint.ts — the allowlist is an additional layer for
  // production deployments that want to pin fetches to known hosts.
  ALLOWED_ENDPOINT_HOSTS: z.string().optional(),
  // Lead notification email delivery (Resend). When RESEND_API_KEY is set
  // alongside the matching NOTIFICATION_FROM/NOTIFICATION_TO pair, the
  // quote / contact server actions also email the formatted lead to the
  // business inbox in parallel with the webhook POST. Either channel
  // succeeding is enough for the user to see a success response — this
  // is what keeps the forms working when a webhook is misconfigured.
  RESEND_API_KEY: z.string().min(1).optional(),
  QUOTE_NOTIFICATION_FROM: z.string().min(1).optional(),
  QUOTE_NOTIFICATION_TO: z.string().email().optional(),
  CONTACT_NOTIFICATION_FROM: z.string().min(1).optional(),
  CONTACT_NOTIFICATION_TO: z.string().email().optional(),
  SITE_URL: z.string().url().optional(),
  VERCEL_ENV: z
    .enum(["production", "preview", "development"])
    .optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_REGION: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Lazy validation — deferred to first access to avoid module-level side
// effects in Edge Runtime (middleware). Still early enough to catch
// misconfiguration on the first form submission or middleware invocation.
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) _env = envSchema.parse(process.env);
  return _env;
}
