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

Asphalt ink, hi-vis yellow actions and cash-green confirmations on a clean
white page. Corners are square throughout (every radius token except
`rounded-full` is `0`). Light mode only.

| Token                      | Hex       | HSL             | Role                                           |
| -------------------------- | --------- | --------------- | ---------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`     | Page canvas                                    |
| `--foreground`             | `#141924` | `222 28% 11%`   | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#141924` | `222 28% 11%`   | Text on cards                                  |
| `--primary`                | `#141924` | `222 28% 11%`   | Ink — headings, dark buttons, dark bands       |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                            |
| `--secondary`              | `#F3F4F6` | `220 16% 96%`   | Light concrete band / low-emphasis surface     |
| `--secondary-foreground`   | `#141924` | `222 28% 11%`   | Text on `--secondary`                          |
| `--muted`                  | `#EBECF0` | `220 14% 93%`   | Subtle backgrounds (code, fills)               |
| `--muted-foreground`       | `#545964` | `220 9% 36%`    | Secondary / helper text                        |
| `--accent`                 | `#197148` | `152 64% 27%`   | Cash green — ticks and confirmations           |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                             |
| `--cta`                    | `#FFC300` | `46 100% 50%`   | Hi-vis yellow primary action and brand accent  |
| `--cta-hover`              | `#EBA000` | `41 100% 46%`   | Hover state of `--cta`                         |
| `--cta-foreground`         | `#0C1018` | `222 32% 7%`    | Text on `--cta`                                |
| `--plate`                  | `#FFC300` | `46 100% 50%`   | Plate / estimate accent (same hue as `--cta`)  |
| `--plate-foreground`       | `#0C1018` | `222 32% 7%`    | Text on `--plate`                              |
| `--destructive`            | `#C52020` | `0 72% 45%`     | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                        |
| `--success`                | `#197148` | `152 64% 27%`   | Success signal                                 |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                            |
| `--warning`                | `#F59F0A` | `38 92% 50%`    | Warning signal                                 |
| `--warning-foreground`     | `#141924` | `222 28% 11%`   | Text on `--warning`                            |
| `--info`                   | `#145BB8` | `214 80% 40%`   | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                               |
| `--border`                 | `#DADCE2` | `220 13% 87%`   | Default border / divider                       |
| `--input`                  | `#747C8B` | `220 9% 50%`    | Form field border (3:1 against the card)       |
| `--ring`                   | `#2463EB` | `221 83% 53%`   | Focus ring (visible on white and on ink)       |

### Text variants of the action colours

Yellow and mid green only pass contrast as *surfaces*. Use these when the hue
has to be text.

| Token              | Hex       | HSL             | Role                                  |
| ------------------ | --------- | --------------- | ------------------------------------- |
| `--cta-ink`        | `#814F03` | `36 95% 26%`    | Amber text on white                   |
| `--accent-ink`     | `#125E3B` | `152 68% 22%`   | Green text and links on white         |
| `--cta-bright`     | `#FFCE1F` | `47 100% 56%`   | Yellow text and icons on ink          |
| `--accent-on-dark` | `#69D39E` | `150 55% 62%`   | Green text on ink                     |

### Dark Band Tokens

These tokens support the header, hero, footer and other ink bands.

| Token            | Hex       | HSL             | Role                             |
| ---------------- | --------- | --------------- | -------------------------------- |
| `--ink`          | `#141924` | `222 28% 11%`   | Dark band surface                |
| `--ink-deep`     | `#0C1018` | `222 32% 7%`    | Utility strip, legal bar, depth  |
| `--ink-raised`   | `#242A38` | `221 22% 18%`   | Raised surface on a dark band    |
| `--on-dark`      | `#BFC4CF` | `220 14% 78%`   | Secondary text on dark surfaces  |
| `--on-dark-hi`   | `#FFFFFF` | `0 0% 100%`     | Primary text on dark surfaces    |
| `--shadow-color` | `#151B28` | `222 30% 12%`   | Shadows                          |

### Type

Headings and buttons use Barlow Condensed (`font-display`); body text uses
Inter (`font-sans`). `.display-impact` is the uppercase poster style for the
hero and section titles. Keep `font-display` at `text-xl` or larger — the
condensed face is hard to read below that.

### Brand motifs

- `.eyebrow` / `.eyebrow-on-dark` — uppercase label led by a yellow square.
- `.hazard-stripe` — the yellow and black tow-truck stripe, used as a thin
  rule (quote card, footer). Decorative only.

### WCAG contrast

Core text and UI should remain AA+. Large text and UI components follow WCAG
large-text thresholds. Do not rely on colour alone; status colours should have
supporting icons or text. Never use `--cta` yellow as text on white.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`.
- Pair every coloured surface with its matching `-foreground` token.
- Use `bg-cta text-cta-foreground` for the primary action button style
  (`hover:bg-cta-hover`).
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
