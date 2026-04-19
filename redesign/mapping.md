# Mapping — current caraway → Stripe-language redesign

Section-by-section translation. Each row states: what exists today, the Stripe pattern we apply, and the concrete engineering note. "**[Q]**" marks a question for you to answer before we start Phase 3.

## A. Global shell

| Area | Current | Stripe-equivalent treatment | Engineering note |
|---|---|---|---|
| Tokens | Tailwind v4 inline `@theme` in `globals.css` | Same file — add aurora stops, shadow layers, radii scale, tracking scale, ease-out-quint | **Keep `globals.css` as single source of truth — do not add `tailwind.config.ts`** |
| Fonts | Ubuntu (body) + Exo (display) via next/font | **Inter Variable** (body+UI) + **Geist Mono** (quote-result numerals) | **[Q1]** Approve font swap? Ubuntu/Exo read friendly-tech; Stripe vibe needs neutral-grotesque. |
| Brand primary | `#3D4EB5` indigo | **Keep** `#3D4EB5` as `--primary`. Add a secondary "gradient accent" track: `--accent-violet #7C6BFF`, `--accent-pink #FF80BF`, `--accent-lilac #C7A2FF`, used **only** in aurora, gradient-text, glows | Non-destructive — primary button colour unchanged. **[Q2]** OK to introduce violet/pink as gradient-only accents? |
| Shadows | none beyond Tailwind defaults | Three-stop `shadow-lg`, `shadow-md`, `shadow-sm`, plus `shadow-glow` for dark surfaces | Add as CSS vars + Tailwind v4 `--shadow-*` tokens |
| Radii | no explicit scale | `6 / 8 / 12 / 16 / 24 / 32 / full` | Add as `--radius-*` tokens |
| Motion | none | Framer Motion 12 + `useReducedMotion` | **Add dep** |
| Icons | lucide-react (varying stroke) | lucide-react `strokeWidth={1.5}`, consistent sizes 20/24/28 | Standardize in a thin wrapper, e.g. `src/components/ui/Icon.tsx` |

## B. Navigation

| Current | Stripe-equivalent | Notes |
|---|---|---|
| `Header.tsx` — sticky, always blurred, logo + links + CTA + mobile drawer | Sticky, **blur + hairline bottom border appears only past 24 px scroll**; underline-grow on hover for nav links; primary CTA is a pill with shadow; mobile drawer stays (good) | Add a scroll-y listener (or `useScroll` / `useMotionValueEvent` from Framer) to toggle `data-scrolled`. Apply styles via data-attribute, not JS style mutation. |
| `ServicesDropdownClient.tsx` — single-column dropdown | **Mega-menu**: full-width dropdown under the nav, 3 columns, each with icon + title + one-line description | Reuses `src/data/services.ts`. |

## C. Homepage `/`

Current flow: `Header → Hero → TrustBadges → HowItWorks → DeferredPriceEstimator → WhyUs → Testimonials → ServiceAreas → FAQ → Footer`.

| # | Current section | Stripe pattern applied | What changes |
|---|---|---|---|
| 1 | **Hero** (`Hero.tsx`) — headline left, tow-truck image right, light wash | **Stripe hero**: aurora gradient mesh bg (CSS radial composite, 24s loop), 12 px uppercase eyebrow, ~88 px display headline with **one gradient-fill word** ("Brisbane" or "cash"), 20 px body, primary CTA ("Get my quote") + ghost CTA with arrow ("How it works →"). Right column = **floating valuation card**, 24 px radius, 3-stop shadow, ~-2° tilt that straightens on scroll (Framer `useScroll`). The card previews the live price-estimator. | Big visual change. Tow-truck image retires from hero; moves into `HowItWorks` step 3 as supporting imagery. **[Q3]** Confirm OK to retire the tow-truck hero image from the top slot. |
| 2 | **TrustBadges** | **Customer-logo strip** idiom — but since caraway has no enterprise logos, translate as a thin **trust strip**: three pill badges (insured / licensed recycler / ABN) at 55% opacity on `--cream`, centred, 48 px row, subtle horizontal divider above and below. No marquee. | Low-risk refactor of existing `TrustBadges.tsx`. |
| 3 | **HowItWorks** | **3-column feature grid**. 28 px duotone lucide icon (`ClipboardList`, `PhoneCall`, `Truck`), 20/600 title, 16 secondary body, arrow link. Hover lifts 2 px. Scroll-reveal fade+slide with 80 ms stagger. | Replace timeline visuals with simple grid. |
| 4 | **DeferredPriceEstimator** | Stripe's "interactive demo" pattern — keep it exactly where it is on scroll, but render **inside a dark `#0A2540` surface** with the "quote-result" treatment: mac-style dot header, tab labels ("Your car" / "Your quote"), **monospace numerals for the dollar figure**. Surrounding copy gets an aurora-glow behind the card. | Preserves all estimator logic and events. Just a chrome swap. |
| 5 | **WhyUs** | **Feature list two-up**: left sticky headline + eyebrow, right vertically-stacked reason rows with an accent stripe on the left edge (brand-indigo) and a thin divider between rows. | Similar to current, with tighter type + divider treatment. |
| 6 | **Stats** | **Dark stats band** on `#0A2540`, 96 py, 4 cols: numeral 72/500 tracking -0.04em in `--text-on-dark-hi`, label 13 uppercase tracking +0.08em in `--text-on-dark`. Keep count-up on intersection. Section gets a top-edge aurora glow. | Currently sits low in `HomeBelowFold` but isn't rendered on `/` per the audit (HomeBelowFold omits `Stats`) — **[Q4]** confirm we re-introduce Stats to the homepage between PriceEstimator and WhyUs. |
| 7 | **Testimonials** | **Auto-scrolling quote-card carousel**, 16 radius, 32 padding, subtle indigo quote-mark at 15% opacity behind text, avatar + name + role, 24 gap, 60s loop with pause-on-hover, edge-mask fade on left/right. Horizontal scrollable on touch. | `Testimonials.tsx` keeps data source; new chrome. |
| 8 | **ServiceAreas** | **Compact card grid**: suburbs grouped by region (North / South / East / West / Bayside). Each card is bordered, hover lifts, icon + region name + count of suburbs, expand-to-list interaction. | Currently a flat list — regrouping is a nicer IA. Data already has lat/long for regional grouping. **[Q5]** OK to group suburbs by region? |
| 9 | **FAQ** | **Stripe accordion**: hairline dividers, `+` rotates to `×` on open, height-auto animation via Framer `AnimatePresence`, 24 py per item, 320 ms ease-out. | Swap the `ui/accordion.tsx` internals or reimplement with Framer. |
| 10 | **Footer** | **Dark multi-column footer** (`#0A2540`), 5 cols (Brand + About / Services / Locations / Company / Legal), top-edge 1 px gradient glow, 14 px links on `#ADBDCC` → white on hover, 20 px social icons, 13 px fine print + ABN + © | Existing `Footer.tsx` already dark; restructure columns and add glow. |

## D. CTA band (absent on home today)

Add a **full-width aurora CTA band** above the footer: centre h2 ("Sell your car today"), body, primary CTA, ghost phone link. 120 py, aurora gradient bg with a subtle glass panel around the CTA.

## E. Service page `/[slug]` — `ServicePageTemplate.tsx`

| Current | Treatment |
|---|---|
| Hero → body content → related services → FAQ → CTA | Same structure. Hero gets a **compact** version of the home hero (no floating card, single headline with gradient word, aurora gradient limited to top-of-page 320 px). Body adopts `.prose` with Stripe-like editorial type: 65ch measure, 20 px body-lg, h2 with -0.022em tracking. Related services → feature grid treatment. CTA → aurora band. |

## F. Suburb page `/locations/[slug]` — `SuburbPageTemplate.tsx`

Compact hero (headline + eyebrow "Service area") on cream with small aurora glow; map placeholder card with the quote-result chrome (no macOS dots); three-column "Why locals choose caraway" row; CTA band; footer.

## G. Listing pages (`/locations`, `/blog`, `/blog/category/[category]`)

Simple editorial pages: hero with eyebrow + h1 + 1-sentence dek; filter bar pinned under the nav; card grid (16 radius, hover lift, author/date on blog cards).

## H. Blog post `/blog/[slug]`

Editorial long-form: 680 px measure, Inter body-lg, table-of-contents sidebar sticky on desktop, reading-progress bar (already exists) gets a brand gradient fill, related posts card row at the end.

## I. Informational pages (`/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/accessibility`, `/site-map`)

- `/about` — Stripe "company" pattern: hero + story + team + values grid.
- `/contact` — left: headline + address + phone + hours; right: quote-card with `ContactForm`.
- `/faq` — full FAQ in the accordion treatment; TOC on desktop.
- Legal pages — clean `.prose` with max-w 680, h2 anchors, hairline dividers.

## J. Things to preserve verbatim

- All route paths unchanged.
- JSON-LD blocks in `src/lib/json-ld-schemas.ts` and per-page metadata exports.
- Vercel analytics event names in `src/lib/analytics.ts`.
- Middleware (`middleware.ts`) rate-limit + CSRF.
- Resend email templates (inline hex intentional).
- Places API route.
- `public/images/*`, `robots.ts`, `sitemap.ts`, `site.webmanifest`.
- Existing data shapes (`services.ts`, `suburbs.ts`, `reviews.ts`, `home-faqs.ts`).
- Price-estimator algorithm.

## K. Decisions (resolved)

1. **Q1 → YES** Swap Ubuntu + Exo for **Inter Variable** (body + UI) + **Geist Mono** (quote-result numerals).
2. **Q2 → YES (author's call)** Introduce `--accent-violet #7C6BFF`, `--accent-pink #FF80BF`, `--accent-lilac #C7A2FF` **for gradients and glows only**. `#3D4EB5` stays as the solid brand `--primary` on buttons, links, focus rings. Solid-colour surfaces are never violet/pink.
3. **Q3 → NO** Keep the tow-truck hero image in the right column. It gets the Stripe product-mockup treatment: aurora gradient on the full hero section behind it, subtle `-2°` tilt that straightens on scroll, three-stop soft shadow, and an optional floating "$2,450 — offer sent" pill overlay for social proof. No standalone floating valuation card.
4. **Q4 → NO** No Stats band on the homepage. Keep the flow lean, as today.
5. **Q5 → YES** Group `ServiceAreas` suburbs by region (North / South / East / West / Bayside) using lat/long already in `suburbs.ts`. Cards lift on hover, expand to a suburb list.
6. **Q6 → YES (recommended)** Aurora mesh proceeds — CSS-only, GPU-accelerated, pauses on `prefers-reduced-motion`.
7. **Q7 → YES (recommended)** Lucide React at `strokeWidth={1.5}`, sizes 20/24/28 standardized via a thin `<Icon>` wrapper.
8. **Q8 → Keep off homepage (recommended)** `CarTypes` continues to live on service pages only.

### Consequent revision to §C row 1 (Hero)

Hero layout stays split — headline + CTAs left, **tow-truck image right**. The changes:
- Section background gets the aurora mesh (replacing the current flat `--hero-wash`).
- Headline becomes display-scale (~88 px on desktop) with **one gradient-fill word** (e.g. "cash") using the violet→pink gradient.
- Primary CTA ("Get my quote") + ghost CTA with arrow.
- The tow-truck image sits in a Stripe-style product-mockup frame: `rounded-2xl`, 3-stop `shadow-lg`, `-2°` tilt via `useScroll` that straightens as you scroll.
- Optional floating "quote received" pill (small dark-ink card) overlapping the image's lower-left for social proof — reuses the quote-result chrome at miniature scale.
