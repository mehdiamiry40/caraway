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

Clean white canvas, corporate charcoal for structure (headings, dark bands,
footer, nav), and a single brand red spent sparingly on calls to action,
accents, and emphasis. Light mode only.

| Token                      | Hex      | HSL              | Role                                           |
| -------------------------- | -------- | ---------------- | ---------------------------------------------- |
| `--background`             | `#FFFFFF` | `0 0% 100%`     | Page canvas                                    |
| `--foreground`             | `#212121` | `0 0% 13%`      | Default body text                              |
| `--card`                   | `#FFFFFF` | `0 0% 100%`     | Elevated surface (cards, popovers, inputs)     |
| `--card-foreground`        | `#212121` | `0 0% 13%`      | Text on cards                                  |
| `--primary`                | `#242424` | `0 0% 14%`      | Charcoal — headings, dark bands, nav           |
| `--primary-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--primary`                            |
| `--secondary`              | `#F2F2F2` | `0 0% 95%`      | Low-emphasis grey surface                      |
| `--secondary-foreground`   | `#242424` | `0 0% 14%`      | Text on `--secondary`                          |
| `--muted`                  | `#F7F7F7` | `0 0% 97%`      | Subtle backgrounds (code, fills)               |
| `--muted-foreground`       | `#595959` | `0 0% 35%`      | Secondary / helper text                        |
| `--accent`                 | `#CE0E2D` | `350 87% 43%`   | Brand red — accents, emphasis surfaces         |
| `--accent-foreground`      | `#FFFFFF` | `0 0% 100%`     | Text on `--accent`                             |
| `--cta`                    | `#CE0E2D` | `350 87% 43%`   | Red primary CTA buttons                        |
| `--cta-foreground`         | `#FFFFFF` | `0 0% 100%`     | Text on `--cta`                                |
| `--plate`                  | `#CE0E2D` | `350 87% 43%`   | Vehicle plate / estimate accent                |
| `--plate-foreground`       | `#FFFFFF` | `0 0% 100%`     | Text on `--plate`                              |
| `--destructive`            | `#B42318` | `4 76% 40%`     | Errors, destructive actions                    |
| `--destructive-foreground` | `#FFFFFF` | `0 0% 100%`     | Text on `--destructive`                        |
| `--success`                | `#16A34A` | `142 76% 36%`   | Success signal                                 |
| `--success-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--success`                            |
| `--warning`                | `#F59E0B` | `38 92% 50%`    | Warning signal                                 |
| `--warning-foreground`     | `#FFFFFF` | `0 0% 100%`     | Text on `--warning`                            |
| `--info`                   | `#0284C7` | `200 98% 39%`   | Neutral notices                                |
| `--info-foreground`        | `#FFFFFF` | `0 0% 100%`     | Text on `--info`                               |
| `--border`                 | `#DEDEDE` | `0 0% 87%`      | Default border / divider                       |
| `--input`                  | `#949494` | `0 0% 58%`      | Form field border (3.03:1 on white)            |
| `--ring`                   | `#CE0E2D` | `350 87% 43%`   | Focus ring                                     |

### Red is the accent, not the structure

`--primary` is charcoal, not red. Headings, dark bands, the footer, and nav
chrome are all charcoal; red enters only through `--accent`, `--cta`, and
`--plate`. Keep it that way — a page where every heading is red loses the
emphasis that makes the red CTA read as the next action.

`--destructive` is deliberately a warmer, darker red than the brand red so
error states stay distinguishable from red CTAs. Never rely on that difference
alone: status always carries a supporting icon or label.

### Dark Band Tokens

These tokens support charcoal hero/footer bands and dark quote-result surfaces.

| Token                 | Hex      | HSL              | Role                             |
| --------------------- | -------- | ---------------- | -------------------------------- |
| `--ink`               | `#242424` | `0 0% 14%`      | Primary charcoal dark surface    |
| `--ink-deep`          | `#121212` | `0 0% 7%`       | Deeper shadow / dark depth       |
| `--ink-raised`        | `#3D3D3D` | `0 0% 24%`      | Raised dark surface              |
| `--on-dark`           | `#D6D6D6` | `0 0% 84%`      | Secondary text on dark surfaces  |
| `--on-dark-hi`        | `#FFFFFF` | `0 0% 100%`     | Primary text on dark surfaces    |
| `--shadow-color`      | `#1F1F1F` | `0 0% 12%`      | Neutral shadows                  |

### Red text variants

The brand red clears AA both as a surface (white text, 5.6:1) and as text on
white (5.6:1). The variants below cover the cases it does not.

| Token                | Hex      | HSL              | Role                                  |
| -------------------- | -------- | ---------------- | ------------------------------------- |
| `--cta-ink`          | `#B00C26` | `350 87% 37%`   | Red small text / links on white (7.2:1) |
| `--accent-ink`       | `#B00C26` | `350 87% 37%`   | Eyebrow labels on white               |
| `--cta-bright`       | `#FF8F98` | `350 100% 78%`  | Red emphasis on charcoal (6.9:1)      |
| `--accent-on-dark`   | `#FFB3B8` | `350 100% 85%`  | Soft red tint on charcoal             |

### WCAG contrast

Core text and UI should remain AA+. Large text and UI components follow WCAG
large-text thresholds. Do not rely on colour alone; status colours should have
supporting icons or text.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`.
- Pair every coloured surface with its matching `-foreground` token.
- Use `bg-cta text-cta-foreground` for the primary action button style (red on white text).
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
| `src/app/review/card/page.tsx`         | Print artifact — colours must survive print  |

When the palette changes, update all eight files above in lockstep.

### Deliberately frozen

`scripts/build-vehicle-data-social-images.mjs` also hardcodes colours, but it
is **excluded** from palette updates. It renders the `-v1` open-data graphics
that are published externally and pinned by sha256; the hash guard exists so a
published artifact can never change underneath its consumers. A palette change
must not be applied there. If those graphics ever need the current palette,
publish them as new `-v2` files rather than re-pinning `-v1`.

---

## Raster assets

These have baked-in colours and should be regenerated from the current
`public/favicon.svg` whenever the palette changes:

- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-512.webp`
- `public/images/logo.webp`
- `public/images/logo.avif`
