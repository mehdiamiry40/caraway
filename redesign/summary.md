# Redesign summary — caraway.au in the Stripe visual language

Goal: rebuild caraway.au with the craft, motion, typography, and clarity of stripe.com/au while keeping Caraway's content, brand (`#3D4EB5` indigo), conversion flow, SEO, and every piece of backend plumbing untouched. Constrained to Tailwind v4 inline `@theme` (no config file). Delivered in four phases over nine commits on `claude/redesign-caraway-stripe-FOey5`.

## Phase 1 — Audit + mapping

Three read-only research docs:

- `redesign/audit-current.md` — inventory of every route, section, token, and library.
- `redesign/stripe-system.md` — observed Stripe patterns (aurora mesh, quote-card chrome, 3-column feature grid, Inter, Geist Mono, `-0.035em` display tracking, 3-stop shadows).
- `redesign/mapping.md` — section-by-section translation from current → Stripe pattern, with eight decisions resolved (Q1–Q8).

No code touched during Phase 1.

## Phase 2 — Token foundation

Commit: `673c0f3 Phase 2: swap to Inter + Geist Mono, add Stripe token system`.

- **Fonts** via `next/font`: Inter Variable as `--font-body` + `--font-display`, Geist Mono as `--font-mono`.
- **Color**: preserved `#3D4EB5` as `--primary`. Added gradient-only accents (`--grad-violet`, `--grad-pink`, `--grad-lilac`, `--grad-indigo`) used exclusively in aurora mesh, gradient text, and edge glows.
- **Shadows**: three-stop navy-tinted scale (`--shadow-color` HSL triplet) — `shadow-sm/md/lg` + `shadow-glow`.
- **Radii**: `6 / 8 / 12 / 16 / 24 / 32 / full`.
- **Tracking scale**: `--tracking-display -0.035em`, `--tracking-tight -0.022em`, `--tracking-snug -0.015em`, plus `+0.08em` for eyebrows.
- **Motion tokens**: `--ease-out-quint cubic-bezier(0.22, 1, 0.36, 1)` + `--duration-fast/base/slow`.
- **Surfaces**: `.aurora-surface` (light 28s drift), `.aurora-surface-dark` (Stripe deep-navy with violet glow), `.edge-glow-top` (gradient hairline), `.quote-card` (macOS-dot dark chrome), `.marquee-mask / .marquee-track` (60s horizontal carousel with edge fade).
- `.text-gradient`, `.link-underline`, `.eyebrow`, `.section-y` helpers.

All tokens live in `src/app/globals.css`; no `tailwind.config.ts` introduced.

## Phase 3 — Page rebuild

### 3a/3b — Motion + icon primitives, scroll-aware header (`eeb8017`)
- `src/components/ui/motion.tsx`: `Reveal`, `RevealGroup`, `RevealItem` powered by Framer Motion 12 with `useReducedMotion` guards.
- `src/components/ui/Icon.tsx`: thin lucide wrapper that enforces `strokeWidth={1.5}` and size tokens `20/24/28`.
- `src/components/layout/Header.tsx`: sticky, blur + hairline border **only past 24 px scroll** via `data-scrolled`, underline-grow on nav hover, pill primary CTA. Mobile drawer preserved.
- `src/components/layout/ServicesDropdownClient.tsx`: 3-column mega-menu under the nav with icon + title + one-line description.

### 3c — Hero (`f1bd81a`)
`Hero.tsx` now sits on `.aurora-surface`. Headline uses `clamp(2.75rem, 6vw, 5.25rem)` at `font-display font-semibold leading-[1.05]` with `--tracking-display`; the word "cash" fills with the violet→pink→lilac gradient. Tow-truck retained in the right column inside a `rounded-2xl` mockup frame with a 3-stop shadow and `-2°` tilt that straightens on scroll via `useScroll`. Floating "$2,450 — offer sent" pill overlaps the lower-left for social proof (quote-card chrome at miniature scale). Primary CTA pill + ghost CTA with arrow.

### 3d — Trust strip + How it works (`6a3eb7d`)
`TrustBadges.tsx` → thin 48-px trust strip: three hairline pill badges (insured / licensed recycler / ABN) centred, hairline dividers above and below, no marquee.

`HowItWorks.tsx` → 3-column feature grid. 28 px duotone lucide icons (`ClipboardList`, `PhoneCall`, `Truck`), 20/600 title, 16 muted body, arrow link, hover lift 2 px. `RevealGroup` stagger at 80 ms.

### 3e — Price estimator in Stripe quote-card chrome (`9e381a5`)
`PriceEstimator.tsx` rendered inside a dark `--ink-deep` surface: macOS-dot header, tab labels ("Your car" / "Your quote"), monospace numerals for the dollar figure, aurora glow bleed behind the card. All estimator logic, Places API calls, and analytics events (`quote_submitted`, `quote_viewed`) untouched.

### 3f — Why us, testimonials, service areas (`b360060`)
- `WhyUs.tsx` → sticky-headline two-up. Left column sticks with eyebrow + display headline + inline CTA. Right column is a hairline `border-t` list of reason rows with a 2-px accent stripe at the row's left edge.
- `Testimonials.tsx` → auto-scrolling `.marquee-track` carousel. Duplicated-array track, 60s linear loop, `paused` state on `onMouseEnter/Leave/Focus`, edge-mask fade. ReviewCard: `Quote` at 7% opacity behind text, initials pill avatar, 5-star row, footer with name/location/car.
- `ServiceAreas.tsx` → 6-region grid (North / South / East / West / Bayside / Logan & Ipswich). Each card: icon pill, monospace count, region name, description, and chip links to suburbs. `RevealGroup` stagger.

### 3g — FAQ, aurora CTA band, footer (`13cb35f`)
- `ui/accordion.tsx` → `+` rotates 45° to × on open, `border-t border-border/60` hairline list, height animation via `AnimatePresence`, 320 ms `--ease-out-quint`.
- `sections/FAQ.tsx` → Stripe 2-column: sticky eyebrow + headline + inline links (col-span-5), accordion (col-span-7).
- `sections/FinalCTA.tsx` → full-width `.aurora-surface-dark` band above the footer. Gradient-filled word ("worth?"). Primary CTA uses the violet→pink→lilac gradient with a violet shadow glow; secondary is a `tel:` link.
- `layout/Footer.tsx` → `.bg-ink.edge-glow-top`. 5 columns (brand / about / services / locations / legal). `text-on-dark` palette with `text-on-dark-hi` on hover. Column heads at `--tracking-snug`. Brand dot uses `.text-gradient`. ABN + © line in fine print.

### 3h — Secondary-page hero treatment (`56c970b`)
`components/layout/PageShell.tsx` gained a `heroVariant?: "aurora" | "plain"` prop (default `aurora`) and an `eyebrow` prop. Applied to:

- `views/About.tsx` — eyebrow "About", RevealGroup feature grid, founder card.
- `views/Contact.tsx` — split layout: email card with hover-lift + info cards on the left; `ContactForm` + divided "Quick reference" `<dl>` on the right.
- `views/FAQPage.tsx` — monospace `01`/`02`/`03` category numbering above each accordion group, pill CTA cluster.
- `views/Blog.tsx` — featured post spans `md:col-span-2`, rounded-2xl cards with full-card click via `after:absolute after:inset-0` on title, category pill + reading time + date row.
- `views/Locations.tsx` — eyebrow + aurora headline + pill CTAs in the "suburb not listed" fallback card.
- `templates/ServicePageTemplate.tsx` — compact aurora hero with breadcrumb + eyebrow "Service", 3-stop shadow sidebar cards, accordion FAQ.
- `templates/SuburbPageTemplate.tsx` — aurora hero with eyebrow "Service area", monospace step numbers (`font-mono tabular-nums tracking-[0.1em] text-primary`) replacing circular numbered bubbles.
- Privacy / Terms — inherit the aurora hero via `PageShell` with prose body unchanged.

## Phase 4 — Build, lint, screenshots

### 4a — Build + lint
- `npm run build` → 75 pages generated, zero warnings, First Load JS shared = 339 kB, home total = 437 kB.
- `npx tsc --noEmit` → clean.
- `npx next lint` → clean.

### 4b — Screenshots
`redesign/screenshot.mjs` walks 11 routes × 3 viewports with Playwright chromium, `reducedMotion: "reduce"`, `waitUntil: "networkidle"`, `fullPage: true`. 33 PNGs written to `redesign/screenshots/`:

| Route | Path | Slug |
|---|---|---|
| Home | `/` | `home.*.png` |
| Service | `/cash-for-cars-brisbane` | `service.*.png` |
| Suburb | `/locations/north-brisbane` | `suburb.*.png` |
| Locations index | `/locations` | `locations.*.png` |
| About | `/about` | `about.*.png` |
| Contact | `/contact` | `contact.*.png` |
| FAQ | `/faq` | `faq.*.png` |
| Blog index | `/blog` | `blog.*.png` |
| Blog post | `/blog/sell-accident-car-brisbane` | `blog-post.*.png` |
| Privacy | `/privacy` | `privacy.*.png` |
| Terms | `/terms` | `terms.*.png` |

Viewports: `mobile 390×844 @2x`, `tablet 834×1194 @2x`, `desktop 1440×900 @2x`.

## File inventory

### Added
- `redesign/audit-current.md`, `redesign/stripe-system.md`, `redesign/mapping.md`, `redesign/summary.md`
- `redesign/screenshot.mjs`, `redesign/screenshots/*.png`
- `src/components/ui/motion.tsx`, `src/components/ui/Icon.tsx`

### Rewritten
- `src/app/globals.css` (token layer)
- `src/app/layout.tsx` (font wiring)
- `src/components/layout/Header.tsx`, `Footer.tsx`, `PageShell.tsx`
- `src/components/layout/ServicesDropdownClient.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/sections/Hero.tsx`, `TrustBadges.tsx`, `HowItWorks.tsx`, `WhyUs.tsx`, `Testimonials.tsx`, `ServiceAreas.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `PriceEstimator.tsx` (chrome)
- `src/components/templates/ServicePageTemplate.tsx`, `SuburbPageTemplate.tsx`
- `src/views/About.tsx`, `Contact.tsx`, `FAQPage.tsx`, `Blog.tsx`, `Locations.tsx`

### Preserved verbatim (as required)
- All routes + metadata exports
- `src/lib/json-ld-schemas.ts`, `src/lib/analytics.ts` event names
- `middleware.ts` (rate-limit + CSRF)
- Resend email templates, Places API route
- `src/data/*` shapes (services, suburbs, reviews, home-faqs)
- Price-estimator algorithm
- `robots.ts`, `sitemap.ts`, `site.webmanifest`, `public/images/*`

## Known follow-ups

- **Lighthouse run** — build is clean and screenshots look correct; a full Lighthouse audit on the Vercel preview URL is the final validation step. Expected ≥90 Performance / ≥95 A11y + Best Practices + SEO given the token palette (WCAG AA on `#3D4EB5` text + `#F5F4F0` ground), `next/font` (no CLS), and Framer's reduced-motion guards.
- **Copy polish** — headline gradient-word choices (`cash`, `worth?`) are functional but can be A/B tested.
- **Blog editorial polish** — the long-form `prose` is using the default typography scale; a small tune of `h2` margins and `figure` figcaptions would bring it all the way to Stripe-doc parity.
- **Image optimisation** — the tow-truck hero uses the existing asset; a WebP + responsive `srcSet` pass (or swapping to `next/image` if not already) would trim LCP further.
- **CTA band on listing pages** — currently only the home + service templates carry the aurora CTA band; Blog and Locations fall back to inline CTAs inside the page body, which keeps those pages lean but is worth revisiting if conversion data shows a dip.

## Commits on `claude/redesign-caraway-stripe-FOey5`

```
da5e50e Phase 1  audit + stripe-system + mapping
673c0f3 Phase 2  Inter + Geist Mono, Stripe token system
eeb8017 Phase 3a/3b  motion primitives, icon wrapper, scroll-aware header
f1bd81a Phase 3c  Stripe hero with aurora, gradient headline, floating card
6a3eb7d Phase 3d  trust strip + 3-col HowItWorks
9e381a5 Phase 3e  PriceEstimator in Stripe quote-card chrome
b360060 Phase 3f  WhyUs sticky, testimonials carousel, regional service areas
13cb35f Phase 3g  Stripe FAQ, aurora CTA band, dark ink Footer
56c970b Phase 3h  aurora-light hero for every secondary page
<this>  Phase 4   screenshots + summary
```
