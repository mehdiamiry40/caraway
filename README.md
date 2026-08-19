# Caraway

Cash-for-cars marketing and lead-generation site for Caraway, Brisbane.
Built with Next.js 16 (App Router) and deployed on Vercel.

## Tech stack

- **Framework:** Next.js 16 (App Router, Server Actions, RSC)
- **Runtime:** React 19, Node.js 24
- **Language:** TypeScript 6 (strict)
- **Styling:** Tailwind CSS 4
- **Forms / validation:** react-hook-form + zod
- **CMS:** Payload 3 (admin at `/admin`, Vercel Postgres + Vercel Blob)
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

| Variable                    | Required          | Description                                                                                                                                                                                             |
| --------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PAYLOAD_SECRET`            | yes               | Signs Payload admin auth tokens and encrypts stored secrets. Any long random string. Rotating it logs every admin out.                                                                                  |
| `POSTGRES_URL`              | yes               | Postgres connection string backing the CMS. Injected automatically by a linked Vercel Postgres/Neon store.                                                                                              |
| `BLOB_READ_WRITE_TOKEN`     | uploads           | Vercel Blob token for media uploads, injected by a linked Blob store. Unset, the storage plugin disables itself and files go to `public/media` (fine locally, unwritable on Vercel).                    |
| `SITE_URL`                  | yes (prod)        | Canonical site origin — must match the canonical host, i.e. `https://caraway.au`. Used by the request proxy Origin/Referer (CSRF) check; metadata/SEO URLs come from the constant in `src/lib/site.ts`. |
| `QUOTE_ENDPOINT`            | quote channel A   | HTTPS webhook URL the quote server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone.                                                                  |
| `CONTACT_ENDPOINT`          | contact channel A | HTTPS webhook URL the contact server action POSTs to. Pair with email for redundancy, or skip entirely and rely on email delivery alone.                                                                |
| `ALLOWED_ENDPOINT_HOSTS`    | when webhooks set | Comma-separated allowlist of hostnames the server actions may call (SSRF). Required when using the webhook channel.                                                                                     |
| `RESEND_API_KEY`            | email channels    | Resend API key. Required to enable either the quote or contact email channel.                                                                                                                           |
| `QUOTE_NOTIFICATION_FROM`   | quote channel B   | Sender address used by the quote notification email. Must be on a Resend-verified domain, e.g. `Caraway Quotes <quotes@caraway.au>`.                                                                    |
| `QUOTE_NOTIFICATION_TO`     | quote channel B   | Recipient for quote notification emails, typically `info@caraway.au`.                                                                                                                                   |
| `CONTACT_NOTIFICATION_FROM` | contact channel B | Sender address used by the contact notification email. Must be on a Resend-verified domain, e.g. `Caraway Contact <contact@caraway.au>`.                                                                |
| `CONTACT_NOTIFICATION_TO`   | contact channel B | Recipient for contact notification emails, typically `info@caraway.au`.                                                                                                                                 |

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

| Script                       | What it does                                              |
| ---------------------------- | --------------------------------------------------------- |
| `npm run dev`                | Start the Next.js dev server                              |
| `npm run build`              | Production build (used by Vercel)                         |
| `npm run start`              | Serve the production build                                |
| `npm run typecheck`          | Run the project TypeScript checker                        |
| `npm run generate:types`     | Regenerate `src/payload-types.ts` from the Payload config |
| `npm run generate:importmap` | Regenerate the Payload admin import map                   |
| `npm run lint`               | ESLint with `--max-warnings 0`                            |
| `npm run check:indexability` | Verify built SEO data and runtime host-indexing policy    |
| `npm test`                   | Run the Vitest suite once                                 |
| `npm run test:watch`         | Vitest in watch mode                                      |
| `npm run audit:swarm`        | Run the internal swarm audit tooling                      |

## Testing

The Vitest suite covers server actions, forms, API routes, SEO helpers,
the request proxy, and quote validation. Run it with:

```bash
npm test
```

## Content management (Payload CMS)

Payload runs inside this Next.js app rather than as a separate service. The
admin panel lives at `/admin`; its REST and GraphQL endpoints are mounted
under `/api` alongside the site's own route handlers (Next resolves the
site's specific routes such as `/api/health` ahead of Payload's catch-all).

### Local setup

1. Point `POSTGRES_URL` at any Postgres instance and set `PAYLOAD_SECRET`.
2. `npm run dev`, then open <http://localhost:3000/admin> and create the
   first user. Payload creates its tables on first connection.
3. Leave `BLOB_READ_WRITE_TOKEN` unset locally — uploads then go to
   `public/media`, which is gitignored.

After changing `src/payload.config.ts` or anything in `src/collections/`,
regenerate the derived files and commit them:

```bash
npm run generate:types       # src/payload-types.ts
npm run generate:importmap   # src/app/(payload)/admin/importMap.js
```

### Deployment

Provision Postgres and Blob stores from the Vercel Marketplace and link them
to the project — Vercel injects `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN`
automatically. `PAYLOAD_SECRET` must be set by hand for Production and
Preview. Preview deployments share whatever database they are pointed at, so
give them a separate one if you do not want previews writing to production
content.

Payload's schema is pushed automatically in development. Before the CMS
holds content anyone depends on, switch to migrations (`npm run payload
migrate:create`) so schema changes ship as reviewed files rather than
being inferred at boot.

### Known gaps

- **No email adapter.** Payload logs password-reset emails to the console.
  The site already uses Resend, so `@payloadcms/email-resend` is the natural
  fit once a verified sender address is chosen.
- **Nothing on the site reads from Payload yet.** Pages and blog posts are
  still TypeScript modules under `src/content/` and `src/data/`; this change
  installs the CMS without migrating that content into it.

## Architecture overview

- **`src/app/`** — App Router. Payload requires that no root `layout.tsx`
  exists here, so the site and the CMS live in sibling route groups.
  - `(frontend)/` — every public page, layout and app route handler
  - `(payload)/` — the admin panel at `/admin` plus Payload's REST and
    GraphQL endpoints. Payload generates these files; regenerate them
    rather than hand-editing.
  - `robots.ts`, `sitemap.ts` — SEO metadata. These stay at the app root:
    Next only honours `robots.ts` there, not inside a route group.
  - `(frontend)/layout.tsx` / `page.tsx` — root shell, homepage
  - `[slug]/` — dynamic marketing pages
  - `locations/`, `blog/`, `faq/`, `about/`, `contact/`, `privacy/`, `terms/`, `accessibility/`
  - `(frontend)/api/health/route.ts` — liveness endpoint for uptime checks
- **`src/lib/`** — shared modules (schemas, analytics, JSON-LD, email builders).
- **`src/payload.config.ts`** — Payload config: collections, database and
  storage adapters. `src/collections/` holds the collection definitions.
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
