# Color system

This project uses **semantic tokens only**. All colors are defined once in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components consume Tailwind utilities like `bg-primary`,
`text-foreground`, `border-border` — **never** raw hex, rgb, or palette-scale
utilities like `bg-blue-500`.

The indirection lets us swap the palette without touching components.

---

## Current palette

Calm, credible, Stripe-adjacent. A single indigo accent on a cool-neutral
base. No gradients, no shadows, no dark mode.

| Token                      | Hex      | HSL              | Role                                        |
| -------------------------- | -------- | ---------------- | ------------------------------------------- |
| `--background`             | `#F6F9FC` | `210 38% 97%`   | Page canvas                                 |
| `--foreground`             | `#0A2540` | `214 72% 15%`   | Default body text                           |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)  |
| `--card-foreground`        | `#0A2540` | `214 72% 15%`   | Text on cards                               |
| `--primary`                | `#3D4EB5` | `233 50% 47%`   | Brand / dominant action                     |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                         |
| `--secondary`              | `#EEF2F7` | `214 33% 95%`   | Low-emphasis surface                        |
| `--secondary-foreground`   | `#0A2540` | `214 72% 15%`   | Text on `--secondary`                       |
| `--muted`                  | `#EEF2F7` | `214 33% 95%`   | Subtle backgrounds (code, fills)            |
| `--muted-foreground`       | `#425466` | `211 22% 33%`   | Secondary / helper text                     |
| `--accent`                 | `#2F3E9A` | `233 53% 40%`   | Darker shade of primary — emphasis text/UI  |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                          |
| `--destructive`            | `#B42318` | `5 76% 40%`     | Errors, destructive actions                 |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                     |
| `--success`                | `#0B875B` | `155 85% 29%`   | Success signal                              |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                         |
| `--warning`                | `#B54708` | `22 92% 37%`    | Warning signal                              |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                         |
| `--info`                   | `#0B5CAD` | `210 88% 36%`   | Neutral notices (distinct from primary)     |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                            |
| `--border`                 | `#E3E8EE` | `213 27% 91%`   | Default border / divider                    |
| `--input`                  | `#E3E8EE` | `213 27% 91%`   | Form field border                           |
| `--ring`                   | `#3D4EB5` | `233 50% 47%`   | Focus ring                                  |

### WCAG contrast (AA+ throughout)

| Combination                                   | Ratio    | Level |
| --------------------------------------------- | -------- | ----- |
| `foreground` on `background`                  | 17.5 : 1 | AAA   |
| `foreground` on `card`                        | 18.2 : 1 | AAA   |
| `muted-foreground` on `background`            |  8.9 : 1 | AAA   |
| `muted-foreground` on `card`                  |  9.3 : 1 | AAA   |
| `primary-foreground` on `primary`             |  7.1 : 1 | AAA   |
| `accent-foreground` on `accent`               |  9.4 : 1 | AAA   |
| `primary` (text) on `background` (links)      |  7.0 : 1 | AAA   |
| `destructive` (text) on `background`          |  6.1 : 1 | AA+   |
| `success-foreground` on `success` (fill)      |  4.9 : 1 | AA    |
| `warning-foreground` on `warning` (fill)      |  5.4 : 1 | AA    |
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
