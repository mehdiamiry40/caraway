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

Clean white canvas, dark plum text, Looping-style purple brand surfaces, soft
lavender washes, orange emphasis, lime-green primary CTAs, and a yellow plate
accent. Light mode only.

| Token                      | Hex      | HSL              | Role                                           |
| -------------------------- | -------- | ---------------- | ---------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`     | Page canvas                                    |
| `--foreground`             | `#211734` | `261 39% 15%`   | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#211734` | `261 39% 15%`   | Text on cards                                  |
| `--primary`                | `#5B3FBE` | `253 50% 50%`   | Brand purple / dominant brand surfaces         |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                            |
| `--secondary`              | `#F4EEFB` | `268 62% 96%`   | Low-emphasis lavender surface                  |
| `--secondary-foreground`   | `#331D63` | `259 55% 25%`   | Text on `--secondary`                          |
| `--muted`                  | `#F6F3FA` | `266 41% 97%`   | Subtle backgrounds (code, fills)               |
| `--muted-foreground`       | `#5E5770` | `257 13% 39%`   | Secondary / helper text                        |
| `--accent`                 | `#F97449` | `15 94% 63%`    | Orange emphasis / highlight CTAs               |
| `--accent-foreground`      | `#211734` | `261 39% 15%`   | Text on `--accent`                             |
| `--cta`                    | `#7CB92F` | `87 59% 45%`    | Lime primary CTA buttons and action accents    |
| `--cta-foreground`         | `#211734` | `261 39% 15%`   | Text on `--cta`                                |
| `--plate`                  | `#F5D012` | `50 92% 52%`    | License-plate yellow accent                    |
| `--plate-foreground`       | `#211734` | `261 39% 15%`   | Text on `--plate`                              |
| `--destructive`            | `#DC2626` | `0 72% 51%`     | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                        |
| `--success`                | `#16A34A` | `142 76% 36%`   | Success signal (distinct from CTA green)       |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                            |
| `--warning`                | `#F59E0B` | `38 92% 50%`    | Warning signal                                 |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                            |
| `--info`                   | `#0284C7` | `200 98% 39%`   | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                               |
| `--border`                 | `#E5DEEF` | `265 35% 90%`   | Default border / divider                       |
| `--input`                  | `#D9D1E0` | `264 25% 85%`   | Form field border                              |
| `--ring`                   | `#5B3FBE` | `253 50% 50%`   | Focus ring                                     |

### Dark Band Tokens

These tokens support purple hero/footer bands and dark quote-result surfaces.

| Token                 | Hex      | HSL              | Role                             |
| --------------------- | -------- | ---------------- | -------------------------------- |
| `--ink`               | `#2A1A4D` | `259 50% 20%`   | Deep plum dark surface           |
| `--ink-deep`          | `#1F1339` | `259 50% 15%`   | Deeper plum shadow / dark depth  |
| `--ink-raised`        | `#402A6F` | `259 45% 30%`   | Raised dark surface              |
| `--on-dark`           | `#E0D7EA` | `270 30% 88%`   | Secondary text on dark surfaces  |
| `--on-dark-hi`        | `#FFFFFF` | `0 0% 100%`     | Primary text on dark surfaces    |
| `--shadow-color`      | `#211734` | `261 39% 15%`   | Purple-tinted shadows            |

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
