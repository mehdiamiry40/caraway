import { z } from "zod";

const envSchema = z.object({
  QUOTE_ENDPOINT: z.string().url().optional(),
  CONTACT_ENDPOINT: z.string().url().optional(),
  // Optional defense-in-depth allowlist. When unset, outbound endpoints
  // are still protected from SSRF via the private-IP block in
  // validate-endpoint.ts — the allowlist is an additional layer for
  // production deployments that want to pin fetches to known hosts.
  ALLOWED_ENDPOINT_HOSTS: z.string().optional(),
  // Quote notification email delivery (Resend). When all three are set,
  // the quote server action also emails the formatted lead to
  // QUOTE_NOTIFICATION_TO in parallel with the webhook POST. Either
  // channel succeeding is enough for the user to see a success response.
  RESEND_API_KEY: z.string().min(1).optional(),
  QUOTE_NOTIFICATION_FROM: z.string().min(1).optional(),
  QUOTE_NOTIFICATION_TO: z.string().email().optional(),
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
