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
- **Build orchestration:** Turborepo 2 (local and Vercel remote caching)
- **Hosting:** Vercel (auto-deploy from `main`, PR previews)
- **Monitoring:** first-party health checks and Vercel deployment logs

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
| `SITE_URL`                 | yes (prod)      | Canonical site origin — must match the canonical host, i.e. `https://caraway.au`. Used by the request proxy Origin/Referer (CSRF) check; metadata/SEO URLs come from the constant in `src/lib/site.ts`. |
| `QUOTE_ENDPOINT`           | quote channel A | HTTPS webhook URL the quote server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone. |
| `CONTACT_ENDPOINT`         | contact channel A | HTTPS webhook URL the contact server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone. |
| `ALLOWED_ENDPOINT_HOSTS`   | when webhooks set | Comma-separated allowlist of hostnames the server actions may call (SSRF). Required when using the webhook channel. |
| `RESEND_API_KEY`           | email channels  | Resend API key. Required to enable either the quote or contact email channel. |
| `QUOTE_NOTIFICATION_FROM`  | quote channel B | Sender address used by the quote notification email. Must be on a Resend-verified domain, e.g. `Caraway Quotes <quotes@caraway.au>`. |
| `QUOTE_NOTIFICATION_TO`    | quote channel B | Recipient for quote notification emails, typically `info@caraway.au`.       |
| `CONTACT_NOTIFICATION_FROM`| contact channel B | Sender address used by the contact notification email. Must be on a Resend-verified domain, e.g. `Caraway Contact <contact@caraway.au>`. |
| `CONTACT_NOTIFICATION_TO`  | contact channel B | Recipient for contact notification emails, typically `info@caraway.au`.     |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | yes (deployed) | Preferred complete pair set automatically by the Vercel Upstash Marketplace integration for deployment-wide form, chat, and Places limits. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | alternative | Complete pair for direct Upstash setups. Protected work fails closed when neither complete pair is available. |

`/api/health` reports required configuration and delivery redundancy. It
returns HTTP 503 with `"error"` if either form has zero delivery channels or a
deployed runtime lacks valid distributed rate-limit settings. It does not make
network calls, so
`distributedRateLimitConfigured` means the HTTPS URL/token are present, not
that Redis is currently reachable. Runtime failures fail closed and are verified
by the separately protected synthetic delivery check.

Indexability is decided from the request host rather than the build environment.
Static artifacts contain indexable canonical metadata, while the request proxy adds
`X-Robots-Tag: noindex, nofollow` to every host except `caraway.au`. Preview
URLs therefore remain excluded, and the same immutable deployment becomes
indexable if it is later promoted to the canonical production hostname.
`robots.txt` stays crawlable so bots can see the host-level directive.
Only deployments built after this host-based policy was introduced are safe to
promote; older preview artifacts may still contain a baked-in `noindex` tag.

## Scripts

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server                    |
| `npm run build`     | Run a direct Next.js production build           |
| `npm run turbo:check` | Run lint, typecheck and coverage tests through Turbo |
| `npm run turbo:build` | Run the cached production build used by Vercel |
| `npm run turbo:verify` | Build once, then run all artifact-based SEO checks |
| `npm run start`     | Serve the production build                      |
| `npm run typecheck` | Run the project TypeScript checker              |
| `npm run lint`      | ESLint with `--max-warnings 0`                  |
| `npm run check:indexability` | Verify built SEO data and runtime host-indexing policy |
| `npm run check:crawl` | Crawl the built production server for sitemap, canonical, link, asset and legacy-redirect regressions |
| `npm run check:headings` | Fail on missing, duplicate, out-of-order, or skipped heading levels in built pages |
| `npm run check:links` | Fail on indexable pages with no inbound internal link (run after build) |
| `npm run seo:indexnow` | Submit recently-changed sitemap URLs to IndexNow (run after build) |
| `npm test`          | Run the Vitest suite once                       |
| `npm run test:watch`| Vitest in watch mode                            |
| `npm run audit:swarm`| Run the internal swarm audit tooling            |

## Turborepo

This repository is intentionally a single-package Turborepo. The Next.js app
stays at the repository root, so adopting Turbo does not change import paths,
the Vercel root directory, or deployment URLs. `turbo.json` defines the task
graph and caches `.next` build output (excluding Next.js's own incremental
cache) plus test coverage output.

Use `npm run turbo:check` for the independent code-quality gates and
`npm run turbo:verify` for the production build and all checks that inspect its
artifacts. A second unchanged run should report cache hits. Local cache data is
stored in the ignored `.turbo/` directory.

Vercel runs `turbo run build` from `vercel.json`; Vercel automatically connects
that build to the project's Remote Cache. GitHub Actions also persists `.turbo`
with `actions/cache`, so CI receives caching without requiring a long-lived
Vercel token. If the repository later gains another app or shared package, it
can be moved under `apps/` or `packages/` without replacing this task model.

## Testing

The Vitest suite covers server actions, forms, API routes, SEO helpers,
the request proxy, and quote validation. Run it with:

```bash
npm test
```

## Search engine discovery

**Sitemap and Search Console** remain the discovery path for Google. `src/app/sitemap.ts`
emits honest per-page `lastModified` dates; do not widen them to "today" on
deploy, since accurate dates are what make the recrawl signal worth anything.

**IndexNow** (`npm run seo:indexnow`) pushes changed URLs to Bing, Yandex,
Seznam and Naver. **Google does not consume IndexNow** — it supplements Google
discovery, it does not replace it. CI runs the submission automatically after a
successful build on pushes to `main`, and never from a pull request, so a
preview build cannot announce URLs as live. Failures are non-blocking.

The script reads the built sitemap at `.next/server/app/sitemap.xml.body` and
submits only pages whose `lastmod` falls inside a rolling window (3 days by
default, `--days=N` to widen). `--dry-run` prints the batch without sending it.

The key in `src/lib/indexnow.ts` must match the filename and contents of the
`public/<key>.txt` file that proves ownership of the host; a unit test pins them
together, because a mismatch fails every submission silently.

**Internal linking** (`npm run check:links`) fails the build on an indexable
page that nothing links to. An orphan is reachable only through the sitemap,
which is the slowest discovery path there is, and the usual cause is a new post
that no hub or related-posts block picked up.

It reads built HTML, so it counts the links a crawler actually receives —
including nav and footer — rather than what the source appears to render. Two
kinds of page are exempt, both detected from the build rather than an
allowlist: pages that declare their own `noindex` (unlisted on purpose), and
prerendered redirect stubs for retired URLs, identified by a 3xx `status` in
their `.meta` sidecar.

Pages reachable *only* from `/blog/page/N` are reported as a non-blocking
warning. Deep pagination is crawled infrequently, so a link from a hub or a
related-posts block discovers them sooner.

**Production SEO crawl** (`npm run check:crawl`) starts the built app with
`next start` and verifies the HTTP behavior a crawler receives. Every sitemap
page must be a direct indexable `200` with an exact self-canonical; every
same-site URL emitted through an anchor, image, stylesheet, script, preload or
`srcset` must return a direct `200`; and the Search Console legacy aliases must
remain permanent redirects to their final apex-host pages. It also blocks the
old `www` host and the retired deployment-specific asset hashes from leaking
back into rendered HTML.

**Structured data.** One entity, `${SITE_URL}/#organization`, typed as both
`Organization` and `AutoDealer`, carries the publisher identity and the
local-business signals. Claims are limited to what the business can back:

- City-level `address` and `geo` only — vehicles are collected, not dropped off,
  so there is no storefront and no `streetAddress` is published.
- `openingHoursSpecification` comes from `OPENING_HOURS` in `src/lib/site.ts`
  (currently Monday–Friday, 08:00–17:00). It must stay identical to the Google
  Business Profile — Google treats the listing as the authority, so a mismatch
  costs trust. Change both together. An empty array is omitted rather than
  emitted, since a parser reads "no hours" as permanently closed.
- `areaServed` is generated from `SERVICE_AREA_NAMES`, which mirrors the public
  service-area copy.

`src/lib/__tests__/seo-structured-data-policy.test.ts` locks this down and is
the place to record any change of policy.

## Architecture overview

- **`src/app/`** — App Router pages, layouts and route handlers.
  - `layout.tsx` / `page.tsx` — root shell, homepage
  - `[slug]/` — dynamic marketing pages
  - `locations/`, `blog/`, `faq/`, `about/`, `contact/`, `privacy/`, `terms/`, `accessibility/`
  - `api/health/route.ts` — liveness/version endpoint for uptime checks
  - `robots.ts`, `sitemap.ts` — SEO metadata
- **`src/lib/`** — shared modules (schemas, analytics, JSON-LD, email builders).
- **Server actions** — form submissions (quote, contact) run as Next.js
  server actions that POST to the webhook endpoints with SSRF-safe hostname
  allowlisting.
- **`src/proxy.ts`** — request-level security, rate limiting, and preview indexability headers.

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

After any deployment or promotion, verify that both primary service URLs return
without an `X-Robots-Tag: noindex` header on `caraway.au`; CI also checks that
their immutable HTML artifacts contain the correct canonical and WebPage data,
preview hosts receive `noindex`, and the canonical host does not.

### Health check

`GET /api/health` is a configuration check. It does not contact Redis, Resend,
or a webhook, so keep the authenticated synthetic lead-delivery monitor enabled
to verify the real path. Production returns:

```json
{
  "status": "ok",
  "fullyRedundant": true,
  "checkType": "configuration",
  "distributedRateLimitConfigured": true,
  "leadMonitorEnabled": true
}
```

Wire this to an uptime monitor as a configuration signal, and alert separately
on the authenticated synthetic route and runtime dependency errors.

## Contributing

1. Create a feature branch off `main`.
2. Make your changes and keep commits focused.
3. Ensure the full CI gate passes locally:
   ```bash
   npm run turbo:check && npm run test:e2e && npm run turbo:verify
   ```
4. Open a pull request. CI (see `.github/workflows/ci.yml`) must be green
   before merge. Dependabot handles routine dependency PRs weekly.

All PRs are deploy-previewed by Vercel — please smoke-test the preview URL
before requesting review.
