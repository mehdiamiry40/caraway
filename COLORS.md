# Color system

This project uses **semantic tokens only**. All colors are defined once in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components consume Tailwind utilities like `bg-primary`,
`text-foreground`, `border-border` — **never** raw hex, rgb, or palette-scale
utilities like `bg-blue-500`.

The indirection lets us swap the palette without touching components.

---

## Current palette

Soft blue-tinted paper canvas, deep navy primary, light-blue secondary wash,
and a warm coral (terracotta) accent for CTAs and emphasis. Hairline rules
stay navy to preserve the Swiss-style typographic grid. Light mode only.

| Token                      | Hex      | HSL              | Role                                        |
| -------------------------- | -------- | ---------------- | ------------------------------------------- |
| `--background`             | `#F7FAFC` | `210 40% 98%`   | Page canvas (blue-tinted paper)             |
| `--foreground`             | `#0F172A` | `222 47% 11%`   | Default body text (deep navy)               |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)  |
| `--card-foreground`        | `#0F172A` | `222 47% 11%`   | Text on cards                               |
| `--primary`                | `#1E3A8A` | `224 76% 33%`   | Brand / dominant action (navy)              |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                         |
| `--secondary`              | `#BFDBFE` | `213 97% 87%`   | Low-emphasis surface (light-blue wash)      |
| `--secondary-foreground`   | `#0F172A` | `222 47% 11%`   | Text on `--secondary`                       |
| `--muted`                  | `#F1F5F9` | `210 40% 96%`   | Subtle backgrounds (code, fills)            |
| `--muted-foreground`       | `#475569` | `215 19% 35%`   | Secondary / helper text                     |
| `--accent`                 | `#C2410C` | `17 79% 40%`    | Coral terracotta — CTAs, emphasis           |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                          |
| `--destructive`            | `#B91C1C` | `0 74% 42%`     | Errors, destructive actions                 |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                     |
| `--success`                | `#047857` | `160 84% 30%`   | Success signal (emerald)                    |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                         |
| `--warning`                | `#D97706` | `32 95% 44%`    | Warning signal (amber)                      |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                         |
| `--info`                   | `#0284C7` | `199 89% 48%`   | Neutral notices (sky)                       |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                            |
| `--border`                 | `#0F172A` | `222 47% 11%`   | Default border / divider (navy hairline)    |
| `--input`                  | `#0F172A` | `222 47% 11%`   | Form field border                           |
| `--ring`                   | `#1E3A8A` | `224 76% 33%`   | Focus ring                                  |

### Gradient-only accents (legacy tokens)

Token names are historical — kept stable because several components
reference them directly. Values map onto the new navy / coral palette.

| Token            | Hex      | HSL              | Role                                          |
| ---------------- | -------- | ---------------- | --------------------------------------------- |
| `--grad-violet`  | `#1E3A8A` | `224 76% 33%`   | Navy                                          |
| `--grad-pink`    | `#C2410C` | `17 79% 40%`    | Coral terracotta                              |
| `--grad-lilac`   | `#BFDBFE` | `213 97% 87%`   | Light blue                                    |
| `--grad-cyan`    | `#0284C7` | `199 89% 48%`   | Sky                                           |

### WCAG contrast

Targets are AA+ for core text and UI; verify in `src/app/globals.css` if you
change tokens. Large text and UI components follow WCAG large-text thresholds.

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
