# Caraway.au — current-state audit

_Source of truth before the Stripe-language redesign. All paths relative to repo root._

## 1. Stack

| | |
|---|---|
| Framework | Next.js 15.5.15 (App Router) |
| React | 19.2.5 |
| Styling | **Tailwind v4.1.14** — config lives **inline** in `src/app/globals.css` under `@theme inline { … }`. There is **no `tailwind.config.ts`**. |
| Forms | react-hook-form 7.72 + @hookform/resolvers + zod 4.3 |
| UI primitives | shadcn/ui (new-york preset, `components.json`) + Radix Slot; CVA + clsx + tailwind-merge |
| Icons | lucide-react 0.545 |
| Fonts | next/font → **Ubuntu** (400/500/700, `--font-sans-body`) + **Exo** (500/600/700, `--font-display-heading`) |
| Email | Resend 6.11 (server actions in `src/actions/{quote,contact,submit-form}.ts`) |
| Analytics | @vercel/analytics + @vercel/speed-insights + custom event wrapper `src/lib/analytics.ts` |
| SEO | next-seo 7.2 + hand-rolled JSON-LD in `src/lib/json-ld-schemas.ts` |
| Middleware | `middleware.ts` — 10 POSTs / 60 s rate-limit + Origin/Referer CSRF |
| Places | Google Places proxied via `src/app/api/places/autocomplete/route.ts` |
| Tests | vitest 4.1 |

## 2. Routes / IA

| Route | View / Template | Purpose |
|---|---|---|
| `/` | `views/Home.tsx` → `Hero` + `HomeBelowFold` | Landing page |
| `/[slug]` | `components/templates/ServicePageTemplate.tsx` | 6 service pages (cash-for-cars-brisbane, car-removal-brisbane, sell-my-car-brisbane, scrap-car-removal, unwanted-cars, damaged-cars) — data in `src/data/services.ts` |
| `/locations` | `views/Locations.tsx` | All service areas + filter |
| `/locations/[slug]` | `components/templates/SuburbPageTemplate.tsx` | ~50 Brisbane suburb pages, data in `src/data/suburbs.ts` |
| `/blog` | `views/Blog.tsx` | Blog listing |
| `/blog/[slug]` | `views/BlogPost.tsx` | 22 MDX-ish posts under `src/content/blog/posts/` |
| `/blog/category/[category]` | category listing | Filtered listing |
| `/author/sam-williams` | author page | Single author profile |
| `/about` · `/contact` · `/faq` · `/privacy` · `/terms` · `/accessibility` · `/site-map` | corresponding views | Standard informational |
| `/api/health` · `/api/places/autocomplete` | route handlers | Ops / Places proxy |

Top-level layout files: `src/app/layout.tsx`, `src/app/providers.tsx`, `src/app/loading.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`. **All of these must be preserved in structure.**

## 3. Component inventory

### `src/components/layout/`
- `Header.tsx` — sticky top, logo + nav + mobile-menu + CTA; backdrop-blur already applied unconditionally.
- `Footer.tsx` — dark-ink multi-column, uses `var(--footer-wash)` (= foreground).
- `PageShell.tsx` — standard margin wrapper.
- `GetMyQuoteButton.tsx` — shared primary CTA button.
- `MobileMenuClient.tsx`, `ServicesDropdownClient.tsx` — client nav pieces.
- `TrackedPhoneLink / TrackedOutboundLink / TrackedGoogleBusinessLink / TrackedFooterResourceLink` — analytics-wrapped anchors.

### `src/components/sections/`
- `Hero.tsx` — split: headline + CTAs left, tow-truck image right. `bg: var(--hero-wash)` + subtle `bg-primary/12 blur-3xl` behind image. **No gradient mesh, no floating quote card.**
- `HeroCTAs.tsx`, `GetMyQuoteButton.tsx` — CTA clusters.
- `HowItWorks.tsx` — 3-step timeline on `bg-secondary`.
- `WhyUs.tsx` — left sticky heading, right definition list.
- `Stats.tsx` — 4 KPI cards with count-up on intersection.
- `Testimonials.tsx` + `TestimonialsToggle.tsx` — 3 featured review cards with star ratings.
- `FAQ.tsx` — shadcn accordion, home-snippet + full-page variants.
- `QuoteForm.tsx` — full contact-capture form (make, model, year, condition, address, phone, name).
- `PriceEstimator.tsx` + `DeferredPriceEstimator.tsx` — 3-step estimator; deferred via dynamic import.
- `FinalCTA.tsx` — `bg-primary` full-width CTA band.
- `ServiceAreas.tsx` — suburb grid.
- `CarTypes.tsx` — 8 accepted-type cards on `bg-primary`; **currently removed from `/` (per `HomeBelowFold`)**.
- `TrustBadges.tsx` — insured / licensed / ABN — already on dark.
- `ScrollToQuoteCTA.tsx`, `Breadcrumbs.tsx`, `ContactForm.tsx`, `LocationsFilter.tsx`.

### `src/components/ui/` (shadcn-style)
`accordion`, `address-autocomplete`, `button` (CVA: primary/secondary/outline × sm/base/lg), `checkbox`, `input`, `select`, `skeleton`, `textarea`.

### Root-level
`BackToTopButton`, `ErrorBoundary`, `JsonLd`, `LocationViewTracker`, `ReadingProgress`.

## 4. Design tokens in `src/app/globals.css`

All tokens are CSS custom properties in HSL triplets, consumed by Tailwind v4's `@theme inline` block.

| Token | Hex | Role |
|---|---|---|
| `--background` | `#F6F9FC` | Canvas |
| `--foreground` | `#0A2540` | Default text (also used as `--footer-wash`) |
| `--card` | `#FFFFFF` | Surface |
| `--primary` | **`#3D4EB5`** | Brand indigo |
| `--accent` | `#2F3E9A` | Darker indigo emphasis |
| `--secondary` / `--muted` | `#EEF2F7` | Low-emphasis surface |
| `--muted-foreground` | `#425466` | Helper text |
| `--border` / `--input` | `#E3E8EE` | Hairline |
| `--destructive` | `#B42318` / `--success` `#0B875B` / `--warning` `#B54708` / `--info` `#0B5CAD` | Status |
| `--ring` | `#3D4EB5` | Focus |

Compat aliases still in place: `--footer-wash` = foreground, `--hero-wash` = background, `--hero-mesh` = `transparent`.

Utility classes defined: `.section-y` (py-14→32), `.section-y-tight`, `.container-prose` (65ch), `.text-balance`, `.focus-ring`, `.scrollbar-none`, `.mt-header-safe`, `.min-h-hero` (`min(100vh, 560px)`), `.min-h-screen-safe`.

Notes from `COLORS.md`: AAA contrast on body pairs, **semantic-token-only rule** (no hex, no `bg-white`, no `bg-blue-500`), light-mode only.

## 5. Data

`src/data/` — plain TS modules (no CMS):
- `suburbs.ts` (~50 Brisbane suburbs w/ lat/long)
- `services.ts` (6 services w/ full descriptions + related)
- `car-models.ts` (make/model/year options)
- `reviews.ts` (~30 testimonials)
- `home-faqs.ts` (~12 FAQs)
- `blog-posts.ts` + `src/content/blog/posts/*.ts` (22 posts)
- `resource-links.ts`, `constants.ts`

## 6. Integrations to preserve untouched

1. **Resend emails** (`src/lib/quote-email.ts`, `contact-email.ts`) — HTML templates use inline hex (intentional for email clients).
2. **Google Places autocomplete** via `/api/places/autocomplete` + `ui/address-autocomplete.tsx`.
3. **Vercel Analytics + custom event names** in `src/lib/analytics.ts` (`estimator_started`, `quote_form_submitted`, `lead_submitted`, `faq_opened`, etc.).
4. **Middleware** rate-limit + CSRF on POSTs.
5. **JSON-LD** from `src/lib/json-ld-schemas.ts` + per-page metadata + `src/lib/breadcrumb-schema.ts`.
6. **Sitemap / robots** via `src/app/sitemap.ts` and `src/app/robots.ts`.
7. **Price estimator logic** in `src/lib/price-estimator.ts`.
8. **URLs** — do not rename routes.

## 7. Current visual language (at a glance)

Flat, credible, minimalist, light-mode-only. Indigo primary over cool-neutral backgrounds. One tone per section (white / cream-secondary / dark-foreground for footer & trust badges). Transitions are 200–300 ms opacity/colour only. Count-up on Stats is the single scroll-triggered animation. **No gradients, no aurora, no floating cards, no underline-grow links, no layered shadows, no scroll reveals, no dark hero.** Fonts read as "friendly/tech" (Ubuntu+Exo) rather than "editorial/SaaS" (Inter/Geist/Sohne).

## 8. Gaps vs. a Stripe-like system

1. No animated gradient mesh / aurora.
2. No floating hero side-card with soft shadow + tilt.
3. No layered soft shadows (currently zero non-default shadow utilities).
4. No scroll-reveal / stagger motion primitives → Framer Motion not installed.
5. No underline-grow on nav links.
6. No sticky-nav state change (already blurred, but no change on scroll threshold).
7. No dark stats / CTA band with indigo glow.
8. No "quote result" dark-surface treatment (monospace numerals, tabbed header).
9. No mega-menu / multi-column dropdown on desktop nav.
10. Typography: Ubuntu body has looser tracking / taller x-height than Inter; Exo display is geometric-rounded, not the neutral-grotesque Stripe uses.
11. Container widths are default Tailwind — Stripe's 1080 prose / 1280 full widths are tighter.
12. Focus rings exist but are thin; Stripe-style is `0 0 0 4px rgba(brand, .18)`.

## 9. Constraints for the redesign

- Keep Tailwind v4 inline config in `globals.css` — do **not** create a `tailwind.config.ts`.
- Keep semantic-token discipline. Add new tokens (gradient stops, shadow layers, radii) as CSS vars inside `@theme inline`.
- Keep `#3D4EB5` as the brand indigo. _(Pending user call: introduce a brighter violet/pink accent `#635BFF` / `#FF80BF` for gradients only, not replacing primary — flagged in `mapping.md`.)_
- Keep Ubuntu + Exo **unless** user approves switching to Inter (flagged in `mapping.md`).
- Preserve every URL, every JSON-LD block, every analytics event name.
