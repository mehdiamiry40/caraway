import * as z from "zod/mini";

const envSchema = z.object({
  QUOTE_ENDPOINT: z.optional(z.url()),
  CONTACT_ENDPOINT: z.optional(z.url()),
  // Optional defense-in-depth allowlist. When unset, outbound endpoints
  // are still protected from SSRF via the private-IP block in
  // validate-endpoint.ts — the allowlist is an additional layer for
  // production deployments that want to pin fetches to known hosts.
  ALLOWED_ENDPOINT_HOSTS: z.optional(z.string()),
  // Lead notification email delivery (Resend). When RESEND_API_KEY is set
  // alongside the matching NOTIFICATION_FROM/NOTIFICATION_TO pair, the
  // quote / contact server actions also email the formatted lead to the
  // business inbox in parallel with the webhook POST. Either channel
  // succeeding is enough for the user to see a success response — this
  // is what keeps the forms working when a webhook is misconfigured.
  RESEND_API_KEY: z.optional(z.string().check(z.minLength(1))),
  QUOTE_NOTIFICATION_FROM: z.optional(z.string().check(z.minLength(1))),
  QUOTE_NOTIFICATION_TO: z.optional(z.email()),
  CONTACT_NOTIFICATION_FROM: z.optional(z.string().check(z.minLength(1))),
  CONTACT_NOTIFICATION_TO: z.optional(z.email()),
  // Google Places proxy — used by /api/places/autocomplete to return
  // address suggestions without exposing the API key to the client.
  GOOGLE_PLACES_API_KEY: z.optional(z.string().check(z.minLength(1))),
  SITE_URL: z.optional(z.url()),
  VERCEL_ENV: z.optional(z.enum(["production", "preview", "development"])),
  VERCEL_GIT_COMMIT_SHA: z.optional(z.string()),
  VERCEL_REGION: z.optional(z.string()),
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
