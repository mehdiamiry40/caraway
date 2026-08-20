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

`/api/health` reports service availability and delivery redundancy. It
returns HTTP 503 with `"error"` if either form has zero delivery channels.
Otherwise it returns HTTP 200 with `"ok"`; `fullyRedundant` indicates
whether both webhook and email delivery are configured for both forms.

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
| `npm run build`     | Production build (used by Vercel)               |
| `npm run start`     | Serve the production build                      |
| `npm run typecheck` | Run the project TypeScript checker              |
| `npm run lint`      | ESLint with `--max-warnings 0`                  |
| `npm run check:indexability` | Verify built SEO data and runtime host-indexing policy |
| `npm run seo:indexnow` | Submit recently-changed sitemap URLs to IndexNow (run after build) |
| `npm test`          | Run the Vitest suite once                       |
| `npm run test:watch`| Vitest in watch mode                            |
| `npm run audit:swarm`| Run the internal swarm audit tooling            |

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
