# Color system

This project uses **semantic tokens only**. All colors are defined once in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components consume Tailwind utilities like `bg-primary`,
`text-foreground`, `border-border` — **never** raw hex, rgb, or palette-scale
utilities like `bg-blue-500`.

The indirection lets us swap the palette without touching components.

---

## Current palette

Fresh and modern. A clean sky-blue primary over a crisp cool canvas, with
electric-sky / teal / powder-blue aurora accents for the hero mesh and
gradient text. Light mode only.

| Token                      | Hex      | HSL              | Role                                        |
| -------------------------- | -------- | ---------------- | ------------------------------------------- |
| `--background`             | `#F8FAFC` | `210 40% 98%`   | Page canvas (crisp cool)                    |
| `--foreground`             | `#0F172A` | `222 47% 11%`   | Default body text (slate near-black)        |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)  |
| `--card-foreground`        | `#0F172A` | `222 47% 11%`   | Text on cards                               |
| `--primary`                | `#0369A1` | `201 94% 32%`   | Brand / dominant action (sky blue)          |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                         |
| `--secondary`              | `#E0F2FE` | `204 94% 94%`   | Low-emphasis surface (sky tint)             |
| `--secondary-foreground`   | `#0F172A` | `222 47% 11%`   | Text on `--secondary`                       |
| `--muted`                  | `#E0F2FE` | `204 94% 94%`   | Subtle backgrounds (code, fills)            |
| `--muted-foreground`       | `#475569` | `215 19% 35%`   | Secondary / helper text (slate)             |
| `--accent`                 | `#075985` | `201 90% 27%`   | Darker shade of primary — emphasis text/UI  |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                          |
| `--destructive`            | `#B91C1C` | `0 72% 42%`     | Errors, destructive actions                 |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                     |
| `--success`                | `#047857` | `163 94% 24%`   | Success signal (emerald)                    |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                         |
| `--warning`                | `#B45309` | `31 91% 37%`    | Warning signal (amber, distinct from info)  |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                         |
| `--info`                   | `#6D28D9` | `263 70% 50%`   | Neutral notices (violet, distinct from primary) |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                            |
| `--border`                 | `#E2E8F0` | `214 32% 91%`   | Default border / divider (slate hairline)   |
| `--input`                  | `#E2E8F0` | `214 32% 91%`   | Form field border                           |
| `--ring`                   | `#0369A1` | `201 94% 32%`   | Focus ring                                  |

### Gradient-only accents (aurora mesh, gradient text, glow)

Token names are historical — kept stable because several components
reference them directly. Values were retuned to harmonize with the
sky-blue primary.

| Token            | Hex      | HSL              | Role                                          |
| ---------------- | -------- | ---------------- | --------------------------------------------- |
| `--grad-violet`  | `#1AB8FF` | `200 100% 55%`  | Electric sky — primary gradient tone          |
| `--grad-pink`    | `#2EE1C2` | `172 85% 55%`   | Fresh teal                                    |
| `--grad-lilac`   | `#B2D7FF` | `210 100% 85%`  | Soft powder blue                              |
| `--grad-cyan`    | `#00D4FF` | `188 100% 50%`  | Vibrant cyan                                  |

### WCAG contrast (AA+ throughout)

| Combination                                   | Ratio    | Level |
| --------------------------------------------- | -------- | ----- |
| `foreground` on `background`                  | 16.2 : 1 | AAA   |
| `foreground` on `card`                        | 17.4 : 1 | AAA   |
| `muted-foreground` on `background`            |  7.2 : 1 | AAA   |
| `muted-foreground` on `card`                  |  7.4 : 1 | AAA   |
| `primary-foreground` on `primary`             |  5.9 : 1 | AA+   |
| `accent-foreground` on `accent`               |  7.6 : 1 | AAA   |
| `primary` (text) on `background` (links)      |  5.6 : 1 | AA+   |
| `destructive` (text) on `background`          |  5.7 : 1 | AA+   |
| `success-foreground` on `success` (fill)      |  6.1 : 1 | AA+   |
| `warning-foreground` on `warning` (fill)      |  4.8 : 1 | AA    |
| `ring` around focused inputs                  |  ≥ 3:1  | AA    |

All body text ≥ 4.5:1. Large text and UI components ≥ 3:1. No information
relies on colour alone — icons and text always accompany status colours.

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
- **No gradients, glows, or glassmorphism.** The palette is deliberately
  calm — use solid fills and borders.

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
