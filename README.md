# Caraway

Cash-for-cars marketing and lead-generation site for Caraway, Brisbane.
Built with Next.js 16 (App Router) and deployed on Vercel.

## Tech stack

- **Framework:** Next.js 16 (App Router, Server Actions, RSC)
- **Runtime:** React 19, Node.js 24
- **Language:** TypeScript 6 (strict)
- **Styling:** Tailwind CSS 4
- **Forms / validation:** react-hook-form + zod
- **Testing:** Vitest 4
- **Linting:** ESLint 9 (`eslint-config-next`)
- **Hosting:** Vercel (auto-deploy from `main`, PR previews)
- **Monitoring:** Vercel Analytics, Speed Insights

## Prerequisites

- Node.js **>= 20.11** (see `.nvmrc` for the version CI/Vercel pin to; use `nvm use` to pick up)
- npm 10+
- A Vercel account for preview/production deploys

## Getting started

```bash
git clone <repo-url> caraway
cd caraway
cp .env.example .env.local   # fill in local values
npm ci
npm run dev
```

The dev server starts on <http://localhost:3000>.

## Environment variables

Each public form (quote, contact) must have **at least one** delivery
channel configured — either the webhook or the Resend email channel.
Both forms run both channels in parallel and treat either success as
overall success, so configuring both gives you redundancy.

| Variable                   | Required        | Description                                                                 |
| -------------------------- | --------------- | --------------------------------------------------------------------------- |
| `SITE_URL`                 | yes (prod)      | Canonical site origin, e.g. `https://caraway.au`. Used for metadata + SEO.  |
| `QUOTE_ENDPOINT`           | quote channel A | HTTPS webhook URL the quote server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone. |
| `CONTACT_ENDPOINT`         | contact channel A | HTTPS webhook URL the contact server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone. |
| `ALLOWED_ENDPOINT_HOSTS`   | when webhooks set | Comma-separated allowlist of hostnames the server actions may call (SSRF). Required when using the webhook channel. |
| `RESEND_API_KEY`           | email channels  | Resend API key. Required to enable either the quote or contact email channel. |
| `QUOTE_NOTIFICATION_FROM`  | quote channel B | Sender address used by the quote notification email. Must be on a Resend-verified domain, e.g. `Caraway Quotes <quotes@caraway.au>`. |
| `QUOTE_NOTIFICATION_TO`    | quote channel B | Recipient for quote notification emails, typically `info@caraway.au`.       |
| `CONTACT_NOTIFICATION_FROM`| contact channel B | Sender address used by the contact notification email. Must be on a Resend-verified domain, e.g. `Caraway Contact <contact@caraway.au>`. |
| `CONTACT_NOTIFICATION_TO`  | contact channel B | Recipient for contact notification emails, typically `info@caraway.au`.     |
| `NEXT_PUBLIC_NOINDEX`      | optional        | Set to `1` to force `noindex` metadata (staging/preview).                   |

`/api/health` reports each form's channel configuration: HTTP 503 if any
form has zero channels, `"degraded"` with HTTP 200 if every form has at
least one channel but the configuration isn't fully redundant, `"ok"`
with HTTP 200 if all four channels are wired up.

Non-production deploys (`VERCEL_ENV !== "production"`) automatically emit
`noindex, nofollow` robots metadata and a `Disallow: /` robots.txt.

## Scripts

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server                    |
| `npm run build`     | Production build (used by Vercel)               |
| `npm run start`     | Serve the production build                      |
| `npm run typecheck` | Run the project TypeScript checker              |
| `npm run lint`      | ESLint with `--max-warnings 0`                  |
| `npm test`          | Run the Vitest suite once                       |
| `npm run test:watch`| Vitest in watch mode                            |
| `npm run audit:swarm`| Run the internal swarm audit tooling            |

## Testing

The Vitest suite covers server actions, forms, API routes, SEO helpers,
middleware, persistence, quote validation, and pricing. Run it with:

```bash
npm test
```

## Architecture overview

- **`src/app/`** — App Router pages, layouts and route handlers.
  - `layout.tsx` / `page.tsx` — root shell, homepage
  - `[slug]/` — dynamic marketing pages
  - `locations/`, `blog/`, `faq/`, `about/`, `contact/`, `privacy/`, `terms/`, `accessibility/`
  - `api/health/route.ts` — liveness/version endpoint for uptime checks
  - `robots.ts`, `sitemap.ts` — SEO metadata
- **`src/lib/`** — shared modules (schemas, analytics, JSON-LD, price estimator).
- **Server actions** — form submissions (quote, contact) run as Next.js
  server actions that POST to the webhook endpoints with SSRF-safe hostname
  allowlisting.
- **`middleware.ts`** — request-level security + rate-limiting headers.

## Deployment

- Pushes to `main` are **auto-deployed to production** by Vercel.
- Every pull request gets its own **preview deployment**.
- Required environment variables must be set in the Vercel project settings
  for both Production and Preview environments.

### Rollback

1. Open the Vercel dashboard for the `caraway` project.
2. Navigate to **Deployments**.
3. Select the last known-good deployment.
4. Click the `...` menu and choose **Promote to Production**.

No redeploy is required — promotion is atomic.

### Health check

`GET /api/health` returns:

```json
{
  "status": "ok",
  "commit": "abc1234",
  "region": "syd1",
  "timestamp": "2026-04-11T00:00:00.000Z"
}
```

Wire this to your uptime monitor of choice.

## Contributing

1. Create a feature branch off `main`.
2. Make your changes and keep commits focused.
3. Ensure the full CI gate passes locally:
   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```
4. Open a pull request. CI (see `.github/workflows/ci.yml`) must be green
   before merge. Dependabot handles routine dependency PRs weekly.

All PRs are deploy-previewed by Vercel — please smoke-test the preview URL
before requesting review.
