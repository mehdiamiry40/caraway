import { z } from "zod";

const envSchema = z.object({
  QUOTE_ENDPOINT: z.string().url().optional(),
  CONTACT_ENDPOINT: z.string().url().optional(),
  ALLOWED_ENDPOINT_HOSTS: z.string().optional(),
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
