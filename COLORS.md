# Color system

This project uses **semantic tokens only**. The website palette is defined in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components should consume Tailwind utilities like
`bg-primary`, `text-foreground`, `border-border`, `bg-cta`, and `text-cta` —
not raw hex, rgb, hsl, or palette-scale utilities like `bg-blue-500`.

The indirection keeps the brand palette consistent across pages, fallback UI,
emails, browser chrome, and app icons.

---

## Current palette

Premium and institutional: a warm paper canvas, near-black ink as the dominant
brand surface, brass as the single action colour, and deep racing green for
supporting emphasis. Light mode only.

The identity is deliberately near-monochrome — brass and green are used
sparingly, as trim rather than as fill.

| Token                      | Hex       | HSL             | Role                                           |
| -------------------------- | --------- | --------------- | ---------------------------------------------- |
| `--background`             | `#FAF8F4` | `40 37% 97%`    | Warm paper canvas                              |
| `--foreground`             | `#1E1D1A` | `45 7% 11%`     | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#1E1D1A` | `45 7% 11%`     | Text on cards                                  |
| `--primary`                | `#1A1917` | `40 6% 10%`     | Near-black ink / dominant brand surfaces       |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                            |
| `--secondary`              | `#F1ECE3` | `39 33% 92%`    | Warm sand supporting wash                      |
| `--secondary-foreground`   | `#3A342A` | `38 16% 20%`    | Text on `--secondary`                          |
| `--muted`                  | `#F6F3EE` | `37 31% 95%`    | Subtle backgrounds (code, fills)               |
| `--muted-foreground`       | `#6B6459` | `37 9% 38%`     | Secondary / helper text                        |
| `--accent`                 | `#2E4F3E` | `149 26% 25%`   | Deep racing green / supporting emphasis        |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                             |
| `--cta`                    | `#8A6A28` | `40 55% 35%`    | Brass primary CTA buttons and action accents   |
| `--cta-foreground`         | `#FFFFFF` | `0 0% 100%`     | Text on `--cta`                                |
| `--plate`                  | `#8A6A28` | `40 55% 35%`    | Vehicle plate / estimate accent                |
| `--plate-foreground`       | `#FFFFFF` | `0 0% 100%`     | Text on `--plate`                              |
| `--destructive`            | `#A32218` | `4 74% 37%`     | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                        |
| `--success`                | `#1D6A4A` | `155 57% 26%`   | Success signal (distinct from `--accent`)      |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                            |
| `--warning`                | `#9A4A05` | `28 94% 31%`    | Warning signal (kept orange-ward off brass)    |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                            |
| `--info`                   | `#1F5F8B` | `204 64% 33%`   | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                               |
| `--border`                 | `#E2DCD1` | `39 23% 85%`    | Default border / divider                       |
| `--input`                  | `#8F8578` | `34 9% 52%`     | Form field border                              |
| `--ring`                   | `#8A6A28` | `40 55% 35%`    | Focus ring                                     |

### Text variants of the brand hues

`--cta` and `--accent` pass AA as *surfaces* (paired with white). As small text
on paper they do not, so each has a text-safe variant: the `-ink` pair for
light surfaces, the bright pair for dark bands.

| Token               | Hex       | HSL            | Role                              |
| ------------------- | --------- | -------------- | --------------------------------- |
| `--cta-ink`         | `#6E5220` | `38 55% 28%`   | Brass as text on paper (6.85:1)   |
| `--accent-ink`      | `#2A4A3A` | `150 28% 23%`  | Green as text on paper (9.26:1)   |
| `--cta-bright`      | `#DCBB7A` | `40 58% 67%`   | Brass as text on ink (9.56:1)     |
| `--accent-on-dark`  | `#AFC9B8` | `141 19% 74%`  | Green as text on ink (9.93:1)     |

### Dark Band Tokens

These tokens support the ink hero/footer bands and dark quote-result surfaces.

| Token                 | Hex       | HSL            | Role                             |
| --------------------- | --------- | -------------- | -------------------------------- |
| `--ink`               | `#1A1917` | `40 6% 10%`    | Primary ink dark surface         |
| `--ink-deep`          | `#100F0E` | `30 7% 6%`     | Deeper shadow / dark depth       |
| `--ink-raised`        | `#33302B` | `37 9% 18%`    | Raised dark surface              |
| `--on-dark`           | `#D8D2C7` | `39 18% 81%`   | Secondary text on dark surfaces  |
| `--on-dark-hi`        | `#FFFFFF` | `0 0% 100%`    | Primary text on dark surfaces    |
| `--shadow-color`      | —         | `37 20% 14%`   | Warm-tinted shadows              |

### Typography

| Token             | Family                          | Role                                  |
| ----------------- | ------------------------------- | ------------------------------------- |
| `--font-display`  | Source Serif 4 → Georgia, serif | Headings, editorial display type      |
| `--font-sans`     | Inter → system-ui               | Body copy, UI labels, button labels    |

Both are variable fonts loaded through `next/font/google` in
`src/app/layout.tsx`, which self-hosts them at build time — no external request
at runtime and no layout shift. Buttons use the sans, not the serif: the serif
muddies at small sizes and under semibold.

### WCAG contrast

Core text and UI should remain AA+. Large text and UI components follow WCAG
large-text thresholds. Do not rely on colour alone; status colours should have
supporting icons or text.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`.
- Pair every coloured surface with its matching `-foreground` token.
- Use `bg-cta text-cta-foreground` for the primary action button style.
- Add opacity with slash syntax on semantic tokens: `bg-primary/10`,
  `text-muted-foreground/60`.

### Don't
- **No hardcoded hex, rgb, or hsl literals in components.** Exceptions:
  the two email templates (`src/lib/quote-email.ts`,
  `src/lib/contact-email.ts`) and `src/app/global-error.tsx` must use inline
  hex because CSS variables are not available in those contexts.
- **No `bg-white`, `text-white`, `bg-black`, or `text-black`.** Use
  `bg-card`, `text-primary-foreground`, or the relevant semantic foreground.
- **No named Tailwind colour utilities** (`bg-blue-500`, `text-gray-900`,
  etc.). If a colour is needed, add it to `globals.css` first.

---

## Light mode only

This site runs in light mode. There is no `.dark` block, no
`prefers-color-scheme` switch, and no `next-themes` provider. If dark mode is
added later, define the full token set under a `.dark` selector in
`globals.css`; do not invert the palette programmatically.

---

## Files that touch colour

Anything not using semantic tokens is listed here so it can be audited when the
palette changes.

| File                                   | Why hardcoded                                |
| -------------------------------------- | -------------------------------------------- |
| `src/app/globals.css`                  | Source of truth (semantic tokens)            |
| `src/app/layout.tsx`                   | `themeColor` metadata (browser chrome)       |
| `src/app/global-error.tsx`             | Inline styles — Tailwind may not have loaded |
| `src/lib/quote-email.ts`               | HTML email body — no CSS variable support    |
| `src/lib/contact-email.ts`             | HTML email body — no CSS variable support    |
| `public/site.webmanifest`              | PWA theme / splash colours                   |
| `public/favicon.svg`                   | Inline SVG with literal fills                |

When the palette changes, update all seven files above in lockstep.

---

## Raster assets

These have baked-in colours and should be regenerated from the current
`public/favicon.svg` whenever the palette changes:

- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-512.webp`
- `public/images/logo.webp`
- `public/images/logo.avif`
