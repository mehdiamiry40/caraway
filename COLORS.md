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

Clean white canvas, charcoal navigation and footer surfaces, Caraway blue and
teal emphasis, neutral supporting washes, and lime-green primary actions.
Light mode only.

| Token                      | Hex      | HSL              | Role                                           |
| -------------------------- | -------- | ---------------- | ---------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`     | Page canvas                                    |
| `--foreground`             | `#303030` | `0 0% 19%`      | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#303030` | `0 0% 19%`      | Text on cards                                  |
| `--primary`                | `#2C5696` | `216 55% 38%`   | Brand blue / dominant brand surfaces           |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                            |
| `--secondary`              | `#F6F7F8` | `210 20% 97%`   | Low-emphasis neutral surface                   |
| `--secondary-foreground`   | `#26436D` | `216 48% 29%`   | Text on `--secondary`                          |
| `--muted`                  | `#F4F5F6` | `210 14% 96%`   | Subtle backgrounds (code, fills)               |
| `--muted-foreground`       | `#59636E` | `210 11% 39%`   | Secondary / helper text                        |
| `--accent`                 | `#2D8995` | `187 54% 38%`   | Teal emphasis / supporting action surfaces     |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                             |
| `--cta`                    | `#B3CF44` | `72 59% 54%`    | Lime primary CTA buttons and action accents    |
| `--cta-foreground`         | `#1E3557` | `216 48% 23%`   | Text on `--cta`                                |
| `--plate`                  | `#B3CF44` | `72 59% 54%`    | Vehicle plate / estimate accent                |
| `--plate-foreground`       | `#1E3557` | `216 48% 23%`   | Text on `--plate`                              |
| `--destructive`            | `#DC2626` | `0 72% 51%`     | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                        |
| `--success`                | `#16A34A` | `142 76% 36%`   | Success signal (distinct from CTA green)       |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                            |
| `--warning`                | `#F59E0B` | `38 92% 50%`    | Warning signal                                 |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                            |
| `--info`                   | `#0284C7` | `200 98% 39%`   | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                               |
| `--border`                 | `#D5D6D7` | `210 8% 84%`    | Default border / divider                       |
| `--input`                  | `#BEC8CF` | `207 15% 78%`   | Form field border                              |
| `--ring`                   | `#2C5696` | `216 55% 38%`   | Focus ring                                     |

### Dark Band Tokens

These tokens support the charcoal navigation/footer bands and dark content surfaces.

| Token                 | Hex      | HSL              | Role                             |
| --------------------- | -------- | ---------------- | -------------------------------- |
| `--ink`               | `#303030` | `0 0% 19%`      | Primary charcoal dark surface    |
| `--ink-deep`          | `#212121` | `0 0% 13%`      | Deeper navigation/footer surface |
| `--ink-raised`        | `#474747` | `0 0% 28%`      | Raised dark surface              |
| `--on-dark`           | `#E3E5E6` | `210 10% 90%`   | Secondary text on dark surfaces  |
| `--on-dark-hi`        | `#FFFFFF` | `0 0% 100%`     | Primary text on dark surfaces    |
| `--shadow-color`      | `#292929` | `0 0% 16%`      | Neutral shadows                  |

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
