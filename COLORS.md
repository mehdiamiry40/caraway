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

Navy, sand and coral. Navy carries the header, footer and feature panels; sand
is the warm secondary ground; coral is the action colour (pill buttons) and the
decorative accent (rules under headings, the starburst, arches). Headings use
Marcellus (display serif, single weight), body text uses Lato. Light mode only.

| Token                      | Hex       | HSL              | Role                                           |
| -------------------------- | --------- | ---------------- | ---------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`      | Page canvas                                    |
| `--foreground`             | `#1E2B45` | `220 39% 19%`    | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`      | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#1E2B45` | `220 39% 19%`    | Text on cards                                  |
| `--primary`                | `#041C44` | `218 89% 14%`    | Navy: headings, header, feature panels         |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`      | Text on `--primary`                            |
| `--secondary`              | `#EBE6E0` | `33 22% 90%`     | Sand: warm section ground                      |
| `--secondary-foreground`   | `#041C44` | `218 89% 14%`    | Text on `--secondary`                          |
| `--muted`                  | `#F5F2EE` | `34 26% 95%`     | Subtle warm fills                              |
| `--muted-foreground`       | `#5A6275` | `222 13% 41%`    | Secondary / helper text                        |
| `--accent`                 | `#DD6650` | `9 67% 59%`      | Decorative coral: rules, starburst, arches     |
| `--accent-foreground`      | `#041C44` | `218 89% 14%`    | Text on `--accent` (4.9:1)                     |
| `--cta`                    | `#C24E3A` | `9 54% 49%`      | Coral pill buttons and action accents          |
| `--cta-foreground`         | `#FFFFFF` | `0 0% 100%`      | Text on `--cta` (4.7:1)                        |
| `--cta-ink` / `--accent-ink` | `#9C3B2A` | `9 58% 39%`    | Coral as text on light surfaces                |
| `--cta-bright`             | `#E98A76` | `10 72% 69%`     | Coral as text/icons on navy (6.7:1)            |
| `--plate`                  | `#C24E3A` | `9 54% 49%`      | Vehicle plate / estimate accent                |
| `--plate-foreground`       | `#FFFFFF` | `0 0% 100%`      | Text on `--plate`                              |
| `--destructive`            | `#DC2626` | `0 72% 51%`      | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`      | Text on `--destructive`                        |
| `--success`                | `#16A34A` | `142 76% 36%`    | Success signal                                 |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`      | Text on `--success`                            |
| `--warning`                | `#F59E0B` | `38 92% 50%`     | Warning signal                                 |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`      | Text on `--warning`                            |
| `--info`                   | `#0284C7` | `200 98% 39%`    | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`      | Text on `--info`                               |
| `--border`                 | `#D9D1C7` | `33 19% 82%`     | Default border / divider                       |
| `--input`                  | `#90857A` | `30 9% 52%`      | Form field border (3.6:1 on white)             |
| `--ring`                   | `#041C44` | `218 89% 14%`    | Focus ring                                     |

### Dark Band Tokens

These tokens support the navy header, footer, feature panels and quote-result
surfaces.

| Token                 | Hex       | HSL              | Role                             |
| --------------------- | --------- | ---------------- | -------------------------------- |
| `--ink`               | `#041C44` | `218 89% 14%`    | Navy dark surface                |
| `--ink-deep`          | `#02132F` | `217 92% 10%`    | Deeper navy                      |
| `--ink-raised`        | `#1A3357` | `215 54% 22%`    | Footer and photo-banner wash     |
| `--on-dark`           | `#E0E4EA` | `216 24% 90%`    | Secondary text on dark surfaces  |
| `--on-dark-hi`        | `#FFFFFF` | `0 0% 100%`      | Primary text on dark surfaces    |
| `--shadow-color`      | `#102443` | `218 60% 16%`    | Navy-tinted shadows              |

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
