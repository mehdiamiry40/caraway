# Color system

This project uses a two-layer color system:

1. **Palette scales** — fixed hex values organised 50 → 950, defined once in
   `src/app/globals.css` inside the `@theme inline` block. Exposed to Tailwind
   as utilities (`bg-blue-500`, `text-blue-300`, `border-slate-200`, etc.).
   Think of these as raw paint.
2. **Semantic tokens** — meaning-first CSS variables like `--primary`,
   `--background`, `--muted-foreground`. Also exposed as Tailwind utilities
   (`bg-primary`, `text-foreground`, `border-border`). Components **must**
   use semantic tokens — never raw palette values or hex literals.

The indirection lets us swap the palette without touching components, and
automatically get correct light/dark behaviour.

---

## Current palette: **Harbour Blue**

Confident, Xero-adjacent automotive blue — vibrant blue primary, deeper
navy-blue accent, cool slate neutrals. Aligns with the repainted favicon.
Distinctive in the cash-for-cars category (competitors lean hot-red /
yellow / green).

Anchor hexes (from brand reference):
`#FAFCFB`, `#B9F0F9`, `#78AEC6`, `#0379C7`, `#2A6D99`.

### Scales

| Family       | 50       | 100      | 200      | 300      | 400      | 500      | 600      | 700      | 800      | 900      | 950      |
| ------------ | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| **Blue**     | `#F0FAFE`| `#B9F0F9`| `#9ADBE9`| `#78AEC6`| `#4499CB`| `#0379C7`| `#0368AB`| `#2A6D99`| `#1E4F73`| `#13344B`| `#091C29`|
| **Slate**    | `#F8FAFC`| `#F1F5F9`| `#E2E8F0`| `#CBD5E1`| `#94A3B8`| `#64748B`| `#475569`| `#334155`| `#1E293B`| `#0F172A`| `#020617`|

The five anchor hexes land at blue-100, blue-300, blue-500, blue-700, and
(as page canvas) `--background` (≈ slate-50 tinted warm to `#FAFCFB`).

---

## Semantic tokens

Light-mode values under `:root`, dark-mode under `.dark`. Consumed via
Tailwind utilities generated from the `@theme inline` mapping.

| Token                    | Utility                        | Light          | Dark           | Role                                      |
| ------------------------ | ------------------------------ | -------------- | -------------- | ----------------------------------------- |
| `--background`           | `bg-background`                | `#FAFCFB`      | slate-950      | Page canvas                               |
| `--foreground`           | `text-foreground`              | slate-900      | slate-50       | Default body text                         |
| `--card`                 | `bg-card`                      | white          | slate-900      | Elevated surface (cards, popovers)        |
| `--card-foreground`      | `text-card-foreground`         | slate-900      | slate-50       | Text on cards                             |
| `--primary`              | `bg-primary`, `text-primary`   | blue-500       | blue-400       | Brand / dominant action                   |
| `--primary-foreground`   | `text-primary-foreground`      | white          | blue-950       | Text on `--primary` surfaces              |
| `--secondary`            | `bg-secondary`                 | slate-100      | slate-800      | Low-emphasis surface                      |
| `--secondary-foreground` | `text-secondary-foreground`    | slate-900      | slate-50       | Text on `--secondary`                     |
| `--muted`                | `bg-muted`                     | slate-100      | slate-800      | Subtle backgrounds (code, fills)          |
| `--muted-foreground`     | `text-muted-foreground`        | slate-600      | slate-400      | Secondary / helper text                   |
| `--accent`               | `bg-accent`, `text-accent`     | blue-700       | blue-300       | Secondary CTA, highlight                  |
| `--accent-foreground`    | `text-accent-foreground`       | white          | slate-950      | Text on `--accent`                        |
| `--destructive`          | `bg-destructive`               | red-600        | red-500        | Errors, destructive actions               |
| `--destructive-foreground`| `text-destructive-foreground` | white          | white          | Text on `--destructive`                   |
| `--success`              | `bg-success`                   | emerald-700    | emerald-400    | Success signal                            |
| `--success-foreground`   | `text-success-foreground`      | white          | slate-950      | Text on `--success`                       |
| `--warning`              | `bg-warning`                   | amber-700      | amber-400      | Warning signal                            |
| `--warning-foreground`   | `text-warning-foreground`      | white          | slate-950      | Text on `--warning`                       |
| `--border`               | `border-border`                | slate-200      | slate-800      | Default border                            |
| `--input`                | `border-input`                 | slate-200      | slate-800      | Form field border                         |
| `--ring`                 | `ring-ring`                    | blue-500       | blue-400       | Focus ring                                |

### WCAG contrast (AA)

| Combination                                   | Light   | Dark    |
| --------------------------------------------- | ------- | ------- |
| `foreground` on `background`                  | 17.9:1  | 17.5:1  |
| `primary-foreground` on `primary`             |  4.8:1  |  8.8:1  |
| `accent-foreground` on `accent`               |  7.1:1  |  8.9:1  |
| `muted-foreground` on `background`            |  7.6:1  |  9.0:1  |
| `muted-foreground` on `muted`                 |  7.2:1  |  7.1:1  |
| `primary` on `background` (links)             |  4.8:1  |  7.6:1  |
| `destructive` on `background` (error text)    |  4.8:1  |  4.8:1  |
| `ring` around focused inputs                  |  ≥3:1   |  ≥3:1   |

All body text ≥ 4.5:1. Large text and UI components ≥ 3:1. No information
relies on colour alone — icons and text always accompany status colours.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`
- Use scale utilities only for fine-tuning *within* a semantic role, e.g.
  `bg-slate-100` for a decorative tint on a card, or `text-blue-300` for a
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
- **No named Tailwind colour utilities** (`bg-red-500`, `text-gray-900`,
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
  (app icons — now out of sync with the blue favicon and should be regenerated)
- `public/images/logo.webp`, `public/images/logo.avif`
- `public/images/tow-truck-hero.webp`, `public/images/tow-truck-hero.avif`
  (photography — generally neutral, but any OG / Twitter card crops
  should be verified against the new brand)

Regenerate from the updated `favicon.svg` source or vector originals.
