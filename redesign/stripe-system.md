# Stripe.com/au — design-language extract

_Reference for the caraway redesign. Values marked "(obs)" are lifted from publicly-observable Stripe source; values marked "(target)" are our engineering target in the caraway redesign. Because the automated fetch against stripe.com returned 403 in this environment, exact pixel values are best-known-documented — confirm against a live inspector before freezing tokens._

## 1. Typography

Stripe ships **"sohne-var" / Sohne Variable** (formerly "Stripe Sans"). Closest OSS substitute → **Inter Variable** as primary; **Geist Sans** as a sharper alternative; for the data-card the equivalent mono is **Geist Mono** or **JetBrains Mono**.

Headlines are weight **500–600**, never 700. Contrast comes from **scale × negative tracking**, not stroke weight. Body copy is weight 400, 16/1.6.

Scale (desktop at ~1440 viewport, clamp-fluid):

| Token | font-size | line-height | tracking | weight |
|---|---|---|---|---|
| display (hero) | clamp(3rem, 6vw, 5.5rem) ≈ 88px | 1.02 | **-0.035em** | 500 |
| h1 | 3.5rem / 56px | 1.08 | -0.028em | 600 |
| h2 | 2.5rem / 40px | 1.15 | -0.022em | 600 |
| h3 | 1.75rem / 28px | 1.25 | -0.015em | 600 |
| h4 | 1.25rem / 20px | 1.35 | -0.01em | 600 |
| body-lg | 1.25rem / 20px | 1.55 | -0.005em | 400 |
| body | 1rem / 16px | 1.6 | 0 | 400 |
| small | 0.875rem / 14px | 1.55 | 0 | 400 |
| caption / eyebrow | 0.75rem / 12px uppercase | 1.4 | **+0.04em** | 500 |
| button / nav | 0.9375rem / 15px | 1 | -0.005em | 500 |

**Gradient text** — one or two words in the hero headline get:
```
background: linear-gradient(135deg, #A5B4FC 0%, #818CF8 40%, #F472B6 100%);
-webkit-background-clip: text; color: transparent;
```
The rest of the headline stays ink-near-black.

## 2. Colour palette

```
--bg-cream       #F6F9FC   body canvas
--bg-lilac       #EFF1FE   hero wash
--bg-white       #FFFFFF   cards
--ink            #0A2540   primary dark section / "near-black" text
--ink-deep       #0A1F3D   footer
--ink-raised    #122E5A    raised card on dark

--text-primary   #0A2540
--text-secondary #425466
--text-tertiary  #697386
--text-on-dark   #ADBDCC
--text-on-dark-hi #FFFFFF

--border-subtle  #E3E8EE
--border-hairline rgba(10,37,64,0.08)

--brand-indigo   #635BFF   Stripe's signature "periwinkle"
--indigo-600     #5851EC
--indigo-hover   #7A73FF

--accent-pink    #FF80BF
--accent-violet  #C7A2FF
--accent-cyan    #00D4FF
--accent-lime    #B2F5A9
```

Key observation: Stripe's "black" is navy `#0A2540`, never `#000`. Text grades desaturate into `#425466 → #697386 → #ADBDCC` rather than adding alpha to pure black.

## 3. Spacing & grid

- **Container**: prose-heavy sections `max-width: 1080px`; full-bleed marketing `max-width: 1280px`.
- **Gutter**: 24 mobile / 32 tablet / 48 desktop.
- **Section padding (vertical)**: 48 mobile / 64 tablet / 96 desktop. Hero: 140 top / 120 bottom.
- **Grid gap**: 32 (feature grid), 24 (card grid), 16 (dense lists).
- **Card padding**: 32 standard, 24 compact, 40 featured.

## 4. Border-radius scale

```
sm  6px   inputs, pills, tags
md  8px   buttons
lg  12px  nav items, small cards
xl  16px  standard cards
2xl 24px  hero floating card, pricing
3xl 32px  large panel
full 9999px avatar, chip
```

## 5. Shadow scale

Stripe layers **three stops** — never a single blur. Canonical floating-card shadow:

```css
box-shadow:
  0  1px  2px   rgba(10,37,64,0.04),
  0  8px  16px  rgba(10,37,64,0.06),
  0 32px  64px -12px rgba(10,37,64,0.10);
```

Scale:
- `shadow-sm` → `0 1px 2px rgba(10,37,64,0.06)`
- `shadow-md` → `0 4px 12px rgba(10,37,64,0.08), 0 1px 2px rgba(10,37,64,0.04)`
- `shadow-lg` → the three-stop float above
- `shadow-glow` (on dark) → `0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(99,91,255,0.25)`

## 6. Gradients

**Hero aurora** — composite of four radial stops on a linear base, slow 20–30 s loop:
```css
background:
  radial-gradient(60% 50% at 20% 10%, #C7A2FF 0%, transparent 60%),
  radial-gradient(50% 60% at 80% 20%, #FF80BF 0%, transparent 55%),
  radial-gradient(70% 60% at 50% 100%, #A5B4FC 0%, transparent 60%),
  linear-gradient(180deg, #EFF1FE 0%, #F6F9FC 100%);
animation: aurora 24s ease-in-out infinite alternate;
```
`@keyframes aurora` translates background-position ±8% on x and y. Must run off compositor (CSS, not canvas), pause on `prefers-reduced-motion`.

**Section-divider glow** — placed at the top edge of a dark section:
`radial-gradient(ellipse at top, rgba(99,91,255,0.18), transparent 60%)`.

**Footer top-edge glow** — 1px gradient border:
`linear-gradient(90deg, transparent, #635BFF 50%, transparent)`.

## 7. Motion language

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity 0→1`, `translateY(20px→0)`, **700ms** cubic-bezier(0.22,1,0.36,1) |
| Stagger | children delay `index * 80ms` |
| Button hover | `translateY(-1px)` + shadow bump, 180ms |
| Button press | `scale(0.98)` 120ms, shadow flattens |
| Link underline | 1px high, `width 0→100%`, `transform-origin: left`, 240ms ease-out |
| Nav past 24px scroll | `backdrop-filter: saturate(180%) blur(12px)`, `bg rgba(255,255,255,0.72)`, 1px bottom hairline, transition 200ms |
| Card hover | `translateY(-2px)` + shadow-sm→shadow-md, 220ms |
| FAQ open | height auto-animate + `+`→`×` rotate 45°, 320ms |
| Input focus | border → brand, `box-shadow: 0 0 0 4px rgba(99,91,255,0.18)`, 160ms |

Respect `prefers-reduced-motion`: wrap with `useReducedMotion()` from Framer Motion, and include a blanket `@media (prefers-reduced-motion: reduce)` override in globals.css.

## 8. Component patterns

- **Nav** — 72 px tall, left logo / centre primary / right CTA pill. Mega-menu is a full-width dropdown, 16 px radius, 32 px padding, three columns (icon + title + body).
- **Hero** — 55/45 split. Left: 12 px uppercase eyebrow, 88 px display with one gradient word, 20 px body, primary indigo CTA + ghost CTA with arrow. Right: floating card, 24 px radius, 3-stop shadow, slight tilt (≈ -2°), containing a "live UI" mockup.
- **Feature grid** — 3 col × 32 gap; 28 px duotone icon, 20/600 title, 16 secondary body, optional arrow link; hover lifts 2 px.
- **Stats band** — dark `#0A2540`, 96 py, 4 col; numerals 72 px / weight 500 / tracking -0.04em; label 13 px uppercase tracking +0.08em on `#ADBDCC`.
- **Logo strip** — greyscale at 55% opacity, 48 row, 60 s horizontal scroll with edge-mask gradients.
- **Testimonial card** — 16 radius, 32 padding, 1 px subtle border; 48 px indigo quote mark at 15% opacity behind text; avatar 44 circle, name 15/500, role 14 tertiary.
- **Pricing card** — 24 radius, 40 padding; featured plan gets 2 px gradient border + subtle indigo inner glow + "Most popular" pill.
- **FAQ accordion** — hairline divider between items, 24 py, `+` rotates to `×` on open, Framer `AnimatePresence` + `height: auto`, 320 ms.
- **CTA band** — full-width aurora gradient, 120 py, centre h2 + primary button + ghost link.
- **Footer** — `#0A2540` bg, 1 px top gradient glow, 5 columns, 14 px `#ADBDCC` links → white on hover, 20 px social icons, 13 px fine print.

## 9. Iconography

Lucide React at `strokeWidth={1.5}`, sizes 20 (inline) / 24 (feature) / 28 (hero). Duotone trick: layer a filled shape at 15% opacity beneath the stroked icon in the same indigo. Suitable caraway icons: `Car`, `Wallet`, `Clock`, `MapPin`, `ShieldCheck`, `PhoneCall`, `Truck`, `BadgeCheck`.

## 10. "Code block" → quote-result card

Same treatment applies to the caraway valuation card:
- Surface `#0A2540`, 16 radius, 1 px inner border `rgba(255,255,255,0.08)`, `shadow-glow`.
- Header row: three macOS-style dots (`#FF5F56 / #FFBD2E / #27C93F`, 10 px) then tab labels 13/500 `#ADBDCC`; active tab gets a 2 px indigo underline.
- Body: 24 padding, **monospace 15 px for numerals** (`$3,450`), label rows 14 `#ADBDCC`, value rows white/500.
- Accent: `box-shadow: inset 0 1px 0 rgba(99,91,255,0.3)` for a subtle top edge-glow.

## 11. Micro-interactions (repeat — for engineering checklist)

- Input: 1 px border `#E3E8EE`, 8 radius, 12/14 padding, 15 px text. Focus → border `#635BFF` + `0 0 0 4px rgba(99,91,255,0.18)`.
- Button: primary indigo bg, white text, 8 radius, 10/18 padding, hover translateY(-1) + shadow bump, active scale(0.98).
- Link: colour transition + 1 px underline grow from left.
- Card: translateY(-2) + shadow upgrade + icon bg tint shift.
- Nav link: idle `#425466` → active `#0A2540` + underline grow.

## 12. Caveats

The fetch against stripe.com returned 403 in this environment; numbers above are from prior analysis / public observation. Before we freeze tokens we should spot-check the live site with devtools on a desktop browser to catch any recent drift (e.g. the exact hero gradient stops or current section padding).
