# Color system

This project uses a two-layer color system:

1. **Palette scales** — fixed hex values organised 50 → 950, defined once in
   `src/app/globals.css` inside the `@theme inline` block. Exposed to Tailwind
   as utilities (`bg-teal-500`, `text-orange-300`, `border-stone-200`, etc.).
   Think of these as raw paint.
2. **Semantic tokens** — meaning-first CSS variables like `--primary`,
   `--background`, `--muted-foreground`. Also exposed as Tailwind utilities
   (`bg-primary`, `text-foreground`, `border-border`). Components **must**
   use semantic tokens — never raw palette values or hex literals.

The indirection lets us swap the palette without touching components, and
automatically get correct light/dark behaviour.

---

## Current palette: **Brisbane Trust**

Modern automotive trust — teal primary, orange CTA accent, warm stone
neutrals. Aligns with the favicon. Distinctive in the cash-for-cars
category (competitors lean hot-red / yellow).

### Scales

| Family       | 50       | 100      | 200      | 300      | 400      | 500      | 600      | 700      | 800      | 900      | 950      |
| ------------ | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| **Teal**     | `#F0FDFA`| `#CCFBF1`| `#99F6E4`| `#5EEAD4`| `#2DD4BF`| `#14B8A6`| `#0D9488`| `#0F766E`| `#115E59`| `#134E4A`| `#042F2E`|
| **Orange**   | `#FFF7ED`| `#FFEDD5`| `#FED7AA`| `#FDBA74`| `#FB923C`| `#F97316`| `#EA580C`| `#C2410C`| `#9A3412`| `#7C2D12`| `#431407`|
| **Stone**    | `#FAFAF9`| `#F5F5F4`| `#E7E5E4`| `#D6D3D1`| `#A8A29E`| `#78716C`| `#57534E`| `#44403C`| `#292524`| `#1C1917`| `#0C0A09`|

---

## Semantic tokens

Light-mode values under `:root`, dark-mode under `.dark`. Consumed via
Tailwind utilities generated from the `@theme inline` mapping.

| Token                    | Utility                        | Light          | Dark           | Role                                      |
| ------------------------ | ------------------------------ | -------------- | -------------- | ----------------------------------------- |
| `--background`           | `bg-background`                | stone-50       | stone-950      | Page canvas                               |
| `--foreground`           | `text-foreground`              | stone-900      | stone-50       | Default body text                         |
| `--card`                 | `bg-card`                      | white          | stone-900      | Elevated surface (cards, popovers)        |
| `--card-foreground`      | `text-card-foreground`         | stone-900      | stone-50       | Text on cards                             |
| `--primary`              | `bg-primary`, `text-primary`   | teal-700       | teal-400       | Brand / dominant action                   |
| `--primary-foreground`   | `text-primary-foreground`      | white          | teal-950       | Text on `--primary` surfaces              |
| `--secondary`            | `bg-secondary`                 | stone-100      | stone-800      | Low-emphasis surface                      |
| `--secondary-foreground` | `text-secondary-foreground`    | stone-900      | stone-50       | Text on `--secondary`                     |
| `--muted`                | `bg-muted`                     | stone-100      | stone-800      | Subtle backgrounds (code, fills)          |
| `--muted-foreground`     | `text-muted-foreground`        | stone-600      | stone-400      | Secondary / helper text                   |
| `--accent`               | `bg-accent`, `text-accent`     | orange-600     | orange-500     | Secondary CTA, highlight                  |
| `--accent-foreground`    | `text-accent-foreground`       | white          | stone-950      | Text on `--accent`                        |
| `--destructive`          | `bg-destructive`               | red-600        | red-500        | Errors, destructive actions               |
| `--destructive-foreground`| `text-destructive-foreground` | white          | white          | Text on `--destructive`                   |
| `--success`              | `bg-success`                   | emerald-700    | emerald-400    | Success signal                            |
| `--success-foreground`   | `text-success-foreground`      | white          | stone-950      | Text on `--success`                       |
| `--warning`              | `bg-warning`                   | amber-700      | amber-400      | Warning signal                            |
| `--warning-foreground`   | `text-warning-foreground`      | white          | stone-950      | Text on `--warning`                       |
| `--border`               | `border-border`                | stone-200      | stone-800      | Default border                            |
| `--input`                | `border-input`                 | stone-200      | stone-800      | Form field border                         |
| `--ring`                 | `ring-ring`                    | teal-600       | teal-400       | Focus ring                                |

### WCAG contrast (AA)

| Combination                                   | Light   | Dark    |
| --------------------------------------------- | ------- | ------- |
| `foreground` on `background`                  | 17.2:1  | 18.0:1  |
| `primary-foreground` on `primary`             |  5.9:1  |  8.5:1  |
| `accent-foreground` on `accent`               |  4.3:1¹ |  6.8:1  |
| `muted-foreground` on `background`            |  7.0:1  |  8.9:1  |
| `muted-foreground` on `muted`                 |  6.8:1  |  7.3:1  |
| `primary` on `background` (links)             |  5.9:1  |  9.9:1  |
| `destructive` on `background` (error text)    |  4.8:1  |  4.8:1  |
| `ring` around focused inputs                  |  ≥3:1   |  ≥3:1   |

¹ `accent` (orange-600 on white) meets 3:1 for large/UI components.
For body copy on `accent` surfaces prefer `primary-foreground` or darker.

All body text ≥ 4.5:1. Large text and UI components ≥ 3:1. No information
relies on colour alone — icons and text always accompany status colours.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`
- Use scale utilities only for fine-tuning *within* a semantic role, e.g.
  `bg-stone-100` for a decorative tint on a card, or `text-teal-400` for a
  dark-mode-only accent inside a custom component.
- Pair every coloured surface with its matching `-foreground` token.
- Add opacity with slash syntax on semantic tokens: `bg-primary/10`,
  `text-muted-foreground/60`.

### Don't
- **No hardcoded hex, rgb, or hsl literals in components.** Exceptions:
  the two email templates (`src/lib/quote-email.ts`,
  `src/lib/contact-email.ts`) and `src/app/global-error.tsx` must use
  inline hex because CSS variables aren't available in those contexts.
  Keep them in sync with the palette.
- **No `bg-white`, `text-white`, `bg-black`, `text-black`, `border-white/x`.**
  These break in dark mode. Use `bg-card` / `text-primary-foreground` /
  `bg-primary-foreground/10` instead, depending on context.
- **No named Tailwind colour utilities** (`bg-blue-500`, `text-gray-900`,
  etc.). If you need a colour that isn't in the palette, add it to
  `globals.css` first.

---

## Dark mode

Dark mode is **class-based**: add `class="dark"` to `<html>` (or any ancestor)
to switch. No auto-switch on `prefers-color-scheme` — this ships the
palette infrastructure but doesn't force a theme.

To wire up a toggle later:

```tsx
// On mount, read from localStorage or system preference, then:
document.documentElement.classList.toggle("dark", isDark);
```

---

## Files that touch colour

Anything not using semantic tokens is listed here so they can be audited
as a group when the palette changes.

| File                                   | Why hardcoded                                |
| -------------------------------------- | -------------------------------------------- |
| `src/app/globals.css`                  | Source of truth (scales + tokens)            |
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
  (app icons — currently aligned with new teal/white favicon style)
- `public/images/logo.webp`, `public/images/logo.avif`
- `public/images/tow-truck-hero.webp`, `public/images/tow-truck-hero.avif`
  (photography — generally neutral, but any OG / Twitter card crops
  should be verified against the new brand)

Regenerate from the updated `favicon.svg` source or vector originals.
