# Color system

This project uses **semantic tokens only**. All colors are defined once in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components consume Tailwind utilities like `bg-primary`,
`text-foreground`, `border-border` — **never** raw hex, rgb, or palette-scale
utilities like `bg-blue-500`.

The indirection lets us swap the palette without touching components.

---

## Current palette — Looping direction

White canvas with deep purple feature bands, orange emphasis accent, lime
action CTAs, and plate yellow for playful surfaces. Ink text is deep plum,
not black, so the whole palette stays tonally connected. Light mode only.

| Token                      | Hex       | HSL             | Role                                        |
| -------------------------- | --------- | --------------- | ------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`     | Page canvas (clean white)                   |
| `--foreground`             | `#211734` | `258 35% 15%`   | Body ink (deep plum — not true black)       |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)  |
| `--card-foreground`        | `#211734` | `258 35% 15%`   | Text on cards                               |
| `--primary`                | `#5B3FBE` | `259 55% 45%`   | Looping purple — headings, brand, hero band |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                         |
| `--secondary`              | `#F4EEFB` | `272 60% 96%`   | Soft lavender wash (muted surfaces)         |
| `--secondary-foreground`   | `#2D1F5C` | `259 55% 25%`   | Text on `--secondary`                       |
| `--muted`                  | `#F6F3FA` | `270 30% 97%`   | Subtle backgrounds (code, fills)            |
| `--muted-foreground`       | `#5E5770` | `258 15% 40%`   | Secondary / helper text                     |
| `--accent`                 | `#F97449` | `14 95% 60%`    | Orange emphasis — highlights, chips         |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                          |
| `--cta`                    | `#7CB92F` | `92 57% 48%`    | Lime action green — primary CTA fills       |
| `--cta-foreground`         | `#211734` | `259 50% 15%`   | Text on `--cta` (deep plum, 7.8:1 contrast) |
| `--plate`                  | `#F5D012` | `48 95% 54%`    | Plate yellow — step cards, playful fills    |
| `--plate-foreground`       | `#1B0F38` | `258 35% 12%`   | Text on `--plate`                           |
| `--destructive`            | `#DC2626` | `0 74% 52%`     | Errors, destructive actions                 |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                     |
| `--success`                | `#16A34A` | `142 71% 38%`   | Success signal (emerald — distinct from CTA)|
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                         |
| `--warning`                | `#F59E0B` | `38 92% 50%`    | Warning signal (amber)                      |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                         |
| `--info`                   | `#0284C7` | `199 89% 48%`   | Neutral notices (sky)                       |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                            |
| `--border`                 | `#E5DEEF` | `270 20% 90%`   | Default hairline                            |
| `--input`                  | `#DACEE8` | `270 20% 85%`   | Form field border                           |
| `--ring`                   | `#5B3FBE` | `259 55% 45%`   | Focus ring                                  |

### Ink tokens — for dark bands

| Token         | Hex       | HSL           | Role                                  |
| ------------- | --------- | ------------- | ------------------------------------- |
| `--ink`       | `#2A1A4D` | `259 50% 20%` | Deep plum band (footer, top utility)  |
| `--ink-deep`  | `#1F1239` | `259 50% 15%` | Darker plum variant                   |
| `--ink-raised`| `#44337A` | `259 45% 30%` | Raised surface on dark                |
| `--on-dark`   | `#DDD1EB` | `270 30% 88%` | Muted text on ink                     |
| `--on-dark-hi`| `#FFFFFF` | `0 0% 100%`   | High-contrast text on ink             |

### `--cta` vs `--success`

Two greens, two different jobs. Do not swap them.

- **`--cta`** (lime `#7CB92F`) — the button fill. "Get my quote" and every
  primary action the user is meant to tap. Pair with `text-cta-foreground`
  (deep plum), **not** white — white text on lime is 2.27:1 and fails WCAG AA.
- **`--success`** (emerald `#16A34A`) — status colour for toasts, success
  banners, validated form state, and narrative "yes" signals. White on
  emerald is accessible (4.5:1+).

### WCAG contrast

Targets are AA+ for core text and UI; verify in `src/app/globals.css` if you
change tokens. Large text and UI components follow WCAG large-text thresholds.

All body text ≥ 4.5:1. Large text and UI components ≥ 3:1. No information
relies on colour alone — icons and text always accompany status colours.

Known pairings worth preserving:

- `text-cta-foreground` on `bg-cta` — **7.8:1** (deep plum on lime). Changing
  `--cta-foreground` back to white drops this to 2.27:1 and fails AA.
- `text-on-dark-hi` on `bg-primary` — **7.8:1** (white on Looping purple).
- `text-primary` on `bg-background` — **7.6:1** (purple headings on white).
- `text-accent` on `bg-primary` — **~2.6:1** (orange on purple). Used for
  the hero `hl-orange` highlight at 88px display size only; do not reuse
  on small text.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`
- Pair every coloured surface with its matching `-foreground` token.
- Add opacity with slash syntax on semantic tokens: `bg-primary/10`,
  `text-muted-foreground/60`.

### Don't
- **No hardcoded hex, rgb, or hsl literals in components.** Exceptions:
  the two email templates (`src/lib/quote-email.ts`,
  `src/lib/contact-email.ts`) and `src/app/global-error.tsx` must use
  inline hex because CSS variables aren't available in those contexts.
  Keep them in sync with the palette (see [Files that touch colour](#files-that-touch-colour) below).
- **No `bg-white`, `text-white`, `bg-black`, `text-black`.** Use
  `bg-card` / `text-primary-foreground` / `bg-primary-foreground/10` instead.
- **No named Tailwind colour utilities** (`bg-blue-500`, `text-gray-900`,
  etc.). If you need a colour that isn't in the palette, add it to
  `globals.css` first.
- **No gradients, glows, or glassmorphism** on surface fills. The palette
  uses solid hues with playful tilt/sticker compositions instead.
- **Do not use white text on `--cta`** — the lime is too light. Use
  `text-cta-foreground` (deep plum). Same rule for decorative chips
  filled with `bg-cta`.

---

## Light mode only

This site runs in light mode. There is no `.dark` block, no
`prefers-color-scheme` switch, and no `next-themes` provider. If you add
dark mode later, define the full set of tokens under a `.dark` selector
in `globals.css`; do not attempt to invert the palette programmatically.

---

## Files that touch colour

Anything not using semantic tokens is listed here so they can be audited
as a group when the palette changes.

| File                                   | Why hardcoded                                |
| -------------------------------------- | -------------------------------------------- |
| `src/app/globals.css`                  | Source of truth (semantic tokens)            |
| `src/app/layout.tsx`                   | `themeColor` metadata (browser chrome)       |
| `src/app/global-error.tsx`             | Inline styles — Tailwind may not have loaded |
| `src/lib/quote-email.ts`               | HTML email body — no CSS variable support    |
| `src/lib/contact-email.ts`             | HTML email body — no CSS variable support    |
| `public/site.webmanifest`              | PWA theme / splash colours                   |
| `public/favicon.svg`                   | Inline SVG with literal fills                |

When the palette changes, all seven files above must be updated in lockstep.

---

## Raster assets (manual replacement)

These have baked-in colours from earlier palettes and would need regenerating
if the brand changes:

- `public/icon-192.png`, `public/icon-512.png`, `public/icon-512.webp`
  (app icons — regenerate from updated `favicon.svg`)
- `public/images/logo.webp`, `public/images/logo.avif`
- `public/images/tow-truck-hero.webp`, `public/images/tow-truck-hero.avif`
  (photography — generally neutral; any OG / Twitter card crops should be
  verified against the new brand)
