# Color system

This project uses **semantic tokens only**. All colors are defined once in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components consume Tailwind utilities like `bg-primary`,
`text-foreground`, `border-border` — **never** raw hex, rgb, or palette-scale
utilities like `bg-blue-500`.

The indirection lets us swap the palette without touching components.

---

## Current palette

Warm paper canvas, deep teal primary, and ember accent for secondary CTAs and
highlights. Aurora gradients use teal, honey gold, and sage. Light mode only.

| Token                      | Hex      | HSL              | Role                                        |
| -------------------------- | -------- | ---------------- | ------------------------------------------- |
| `--background`             | `#FAF9F6` | `43 38% 97%`    | Page canvas (warm paper)                    |
| `--foreground`             | `#161C26` | `220 24% 12%`   | Default body text                           |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)  |
| `--card-foreground`        | `#161C26` | `220 24% 12%`   | Text on cards                               |
| `--primary`                | `#117A6C` | `168 56% 30%`   | Brand / dominant action (deep teal)         |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                         |
| `--secondary`              | `#E8F4F0` | `155 28% 93%`   | Low-emphasis surface (mint wash)            |
| `--secondary-foreground`   | `#161C26` | `220 24% 12%`   | Text on `--secondary`                       |
| `--muted`                  | `#F2F0EB` | `42 28% 94%`    | Subtle backgrounds (code, fills)            |
| `--muted-foreground`       | `#5C6470` | `220 11% 40%`   | Secondary / helper text                     |
| `--accent`                 | `#B84A24` | `18 72% 42%`    | Ember — secondary buttons, emphasis         |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                          |
| `--destructive`            | `#C42A2A` | `0 70% 44%`     | Errors, destructive actions                 |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`   | Text on `--destructive`                     |
| `--success`                | `#0F6B4D` | `152 55% 32%`   | Success signal (forest)                     |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                         |
| `--warning`                | `#D97706` | `32 92% 44%`    | Warning signal (amber)                      |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                         |
| `--info`                   | `#5B67DB` | `234 52% 52%`   | Neutral notices (periwinkle)                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                            |
| `--border`                 | `#E8E4DD` | `40 22% 88%`    | Default border / divider                    |
| `--input`                  | `#E8E4DD` | `40 22% 88%`    | Form field border                           |
| `--ring`                   | `#117A6C` | `168 56% 30%`   | Focus ring                                  |

### Gradient-only accents (aurora mesh, gradient text, glow)

Token names are historical — kept stable because several components
reference them directly. Values harmonize with the teal / ember brand.

| Token            | Hex      | HSL              | Role                                          |
| ---------------- | -------- | ---------------- | --------------------------------------------- |
| `--grad-violet`  | `#2BA894` | `168 65% 46%`   | Teal glow                                     |
| `--grad-pink`    | `#F5B435` | `32 95% 56%`    | Honey gold                                    |
| `--grad-lilac`   | `#E2EDD9` | `95 32% 88%`    | Pale sage                                     |
| `--grad-cyan`    | `#2EC4A8` | `168 72% 48%`   | Seafoam pop                                   |

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
