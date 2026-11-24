# Design system: colour, type and spacing

This project uses **semantic tokens only**. The palette is defined in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components should consume Tailwind utilities like
`bg-primary`, `text-foreground`, `border-border`, `bg-cta`, and
`text-accent-ink`, not raw hex, rgb, hsl, or palette-scale utilities like
`bg-blue-500`.

The indirection keeps the brand consistent across pages, fallback UI, emails,
browser chrome, and app icons.

---

## The idea

A bright, plain-spoken local trade site: white pages, bold blue headings,
green ticks, and full-width blue and green bands between white sections.

- **Blue is for headings, links and bands.** Section headings, the inner-page
  title band, the call-to-action band, the icon band and the footer.
- **Green is for the navigation bar and for "yes".** The nav bar, every tick,
  the line under a section heading, the services band and the copyright bar.
- **Yellow is the action.** The primary button ("Get my quote", the phone
  button in a call-to-action band), the logo plate and a few small marks.
- **White between bands.** Two coloured bands never touch; a white or tint
  section always sits between them. Where a band would sit directly above the
  blue footer, use its green variant.

The blue and green are deliberately a step darker than the brightest web
blue and green so that white text on them passes WCAG AA.

Light mode only.

---

## Current palette

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--background`            | `#FFFFFF` | `0 0% 100%`        | Page canvas |
| `--foreground`            | `#1C2430` | `216 26% 15%`      | Body text |
| `--card`                  | `#FFFFFF` | `0 0% 100%`        | Form and panel surface |
| `--card-foreground`       | `#1C2430` | `216 26% 15%`      | Text on cards |
| `--primary`               | `#146AEB` | `216 84% 50%`      | Blue: headings, links, bands, the footer |
| `--primary-hover`         | `#0F5BCC` | `216 86% 43%`      | Hover state of `--primary` |
| `--primary-foreground`    | `#FFFFFF` | `0 0% 100%`        | Text on `--primary` |
| `--accent`                | `#1B833A` | `138 66% 31%`      | Green: navigation bar, ticks, alternate bands, copyright bar |
| `--accent-hover`          | `#147130` | `138 70% 26%`      | Hover state of `--accent` |
| `--accent-foreground`     | `#FFFFFF` | `0 0% 100%`        | Text on `--accent` |
| `--cta`                   | `#FFC105` | `45 100% 51%`      | Yellow: the primary action button and the logo plate |
| `--cta-hover`             | `#F0A400` | `41 100% 47%`      | Hover state of `--cta` |
| `--cta-foreground`        | `#151D28` | `216 30% 12%`      | Text on `--cta` |
| `--plate`                 | `#FFC105` | `45 100% 51%`      | Same yellow, kept for the plate mark |
| `--plate-foreground`      | `#151D28` | `216 30% 12%`      | Text on `--plate` |
| `--secondary`             | `#F3F7FC` | `214 60% 97%`      | Tint band and note panels |
| `--secondary-foreground`  | `#1C2430` | `216 26% 15%`      | Text on `--secondary` |
| `--muted`                 | `#E7ECF3` | `214 32% 93%`      | Subtle fills (code, disabled) |
| `--muted-foreground`      | `#576170` | `215 13% 39%`      | Secondary and helper text |
| `--destructive`           | `#BA261C` | `4 74% 42%`        | Errors, destructive actions |
| `--destructive-foreground`| `#FFFFFF` | `0 0% 100%`        | Text on `--destructive` |
| `--success`               | `#1B833A` | `138 66% 31%`      | Success signal |
| `--success-foreground`    | `#FFFFFF` | `0 0% 100%`        | Text on `--success` |
| `--warning`               | `#FFA200` | `38 100% 50%`      | Warning signal |
| `--warning-foreground`    | `#1C2430` | `216 26% 15%`      | Text on `--warning` |
| `--info`                  | `#146AEB` | `216 84% 50%`      | Neutral notices |
| `--info-foreground`       | `#FFFFFF` | `0 0% 100%`        | Text on `--info` |
| `--border`                | `#D5DDE6` | `214 26% 87%`      | Rules and dividers |
| `--input`                 | `#6E7B8C` | `214 12% 49%`      | Form field border (3:1 against the card) |
| `--ring`                  | `#082D6D` | `218 86% 23%`      | Focus ring on white and tint |

### Text variants

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--accent-ink`            | `#187C36` | `138 68% 29%`      | Green text on white and tint (sub-lines, labels) |
| `--cta-ink`               | `#8A4900` | `32 100% 27%`      | Amber text on white (rare) |
| `--cta-bright`            | `#FFD23D` | `46 100% 62%`      | Yellow marks on coloured bands: active nav rule, underlines |

### Band tokens

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--ink`                   | `#0B1F2D` | `205 61% 11%`      | Dark wash over the hero photo |
| `--ink-deep`              | `#071722` | `205 65% 8%`       | Menu backdrop, depth |
| `--ink-raised`            | `#193143` | `205 45% 18%`      | Raised surface on the dark band |
| `--on-dark`               | `#FFFFFF` | `0 0% 100%`        | Text on blue, green and dark bands |
| `--on-dark-hi`            | `#FFFFFF` | `0 0% 100%`        | Same; kept as a separate token |
| `--shadow-color`          | `#0F1F2E` | `210 50% 12%`      | Shadows |

Add the `on-band` class to any blue, green or dark band, and `on-light` to a
white card placed inside one (the hero quote form) so it goes back to the navy
ring. It switches `--ring`
to `#FFDB4D` so the focus ring keeps its contrast on the band. Add
`on-band-green` as well on a green band so ticks turn into white squares with
green ticks; `ticks-inverse` does the same for a single list on a blue band.

### WCAG contrast

Measured pairs (WCAG 2.1 relative luminance):

| Text / surface | Ratio |
| -------------- | ----- |
| Body text on white / tint | 15.6 / 14.5 |
| Muted text on white / tint / muted | 6.3 / 5.8 / 5.3 |
| Blue headings and links on white / tint | 4.89 / 4.55 |
| White on blue band / blue hover | 4.89 / 6.2 |
| White on green band / green hover | 4.82 / 6.1 |
| Green text (`--accent-ink`) on white / tint | 5.3 / 4.9 |
| Button text on yellow / yellow hover | 10.4 / 8.1 |
| White on the hero photo over pure white sky, 75% / 80% wash | 7.5 / 8.9 |
| Error text on white | 6.2 |
| Field border on white (needs 3:1) | 4.3 |
| Focus ring on white / tint / yellow button (needs 3:1) | 13.1 / 12.2 / 8.0 |
| Focus ring on blue / green / dark band (`on-band`) | 3.6 / 3.6 / 12.4 |

Rules that follow from the numbers:

- On a blue or green band, text is **white only**. A tinted or semi-opaque
  white drops below 4.5:1.
- Never use `--accent` (the band green) as text on the tint; use
  `--accent-ink`.
- Never use yellow as text on white or on a band. Yellow is a surface, or a
  thin rule under white text.
- The hero wash (`bg-ink/80` on phones, `bg-ink/75` on desktop) is the minimum.
  Do not lighten it.

Do not rely on colour alone: status colours carry an icon or words.

---

## Type

One family: **Asap**, a friendly humanist sans, loaded as a single variable
file through `next/font/google` in `src/app/layout.tsx` (self-hosted, latin
subset, `display: swap`). `font-sans` and `font-display` both resolve to it.

- Headings are bold and blue. `h1` and `h2` are shown with each word
  capitalised (`text-transform: capitalize`); the text itself stays in
  sentence case in the source, so this is presentation only. Add `normal-case`
  where a heading is a question or an article title in a list.
- **"Bold" is weight 740, not 700** (`--font-weight-bold`). Asap is unhinted,
  and FreeType's auto-hinter (Linux, ChromeOS) closes the gap under the dot of
  i and j at weight 700 on a few common sizes. 740 renders cleanly from 14px
  up. Keep text smaller than 14px at semibold (600).

| Utility | Size | Use |
| ------- | ---- | --- |
| `type-display` | 32px → 46px, fluid | Home hero title, the call-to-action band |
| `type-h1` | 30px → 42px, fluid | Inner page titles (white, on the blue band) |
| `type-h2` | 26px → 34px, fluid | Section headings |
| `SectionHeading` (component) | 26px / 30px | Headings inside a text column |
| `type-h3` | 20px | Sub-headings |
| `.eyebrow` | 18px, bold, green | The line that sits with a section heading |
| `type-lead` | 17px → 19px | Intro paragraph under a title |
| body | 16px–17px, line-height 1.6–1.7 | Running text |
| `type-label` | 13px, semibold, uppercase | Small labels, rarely |

Long text is held to a 70-character measure (`max-w-[72ch]`).

---

## Spacing and shape

- **Scale.** Tailwind's 4px scale. Related items 8–16px apart, blocks inside
  a section 24–40px, sections 48–64px.
- **Section rhythm.** `.section-y` (48 / 56 / 64px), `.section-y-tight`
  (40 / 48px) and `.section-y-hero` for title bands.
- **Corners.** 2–8px. Buttons and inputs are nearly square (`rounded-sm`).
- **Shadow.** Only the form cards, menus and the mobile call bar lift off the
  page.

## Patterns

- **Header.** White bar with the logo and the phone number; a full-width
  green navigation bar under it. On phones: logo and menu button, then the
  outlined quote button and the blue phone button side by side. The header
  sits in the page flow; from `lg` up it is sticky with a negative offset so
  only the green bar stays stuck (`--header-h` is that bar's height).
- **Section heading.** `.section-head` centres a blue `h2` with an optional
  green `.eyebrow` line under it. Long-form text sections are left-aligned.
- **Ticks.** `.list-ticks` gives every direct child a white tick in a green
  rounded square. Use a grid of them for short lists.
- **Bands.** Blue call-to-action band (`FinalCTA`): white heading, outlined
  quote button, yellow phone button. Blue icon band (`TrustBadges`): four
  large white line icons with labels. Green band of outlined boxes with white
  line icons for the service links (`CarTypes`). Both `FinalCTA` and
  `TrustBadges` take `tone="green"` for use directly above the footer.
- **Buttons.** `buttonVariants()` default is the yellow primary; `outline` is
  the blue outlined secondary; `outlineOnDark` is the white outlined button on
  a band; `ghost` is a quiet text button.
- **Links.** Blue, underlined. `.link-arrow` adds the trailing arrow; add
  `.link-back` when the arrow leads.
- **Forms.** A visible label above every field, 48px controls, a red asterisk
  for required fields and "(optional)" spelled out. Form cards have a large
  blue heading and a yellow submit button.
- **Footer.** Blue, logo and contact details on the left, link columns with
  thin dividers, a green copyright bar.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`.
- Pair every coloured surface with its matching `-foreground` token.
- Use the button variants rather than hand-rolled button classes.
- Put `on-band` on every coloured band so focus rings stay visible.

### Don't
- **No hardcoded hex, rgb, or hsl literals in components.** Exceptions:
  the two email templates (`src/lib/quote-email.ts`,
  `src/lib/contact-email.ts`) and `src/app/global-error.tsx` must use inline
  hex because CSS variables are not available in those contexts.
- **No `bg-white`, `text-white`, `bg-black`, or `text-black`.** Use
  `bg-card`, `text-primary-foreground`, `text-on-dark-hi`, or the relevant
  semantic foreground.
- **No named Tailwind colour utilities** (`bg-blue-500`, `text-gray-900`,
  etc.). If a colour is needed, add it to `globals.css` first.
- **No testimonials, star ratings or car-maker logos.** Caraway has no
  published reviews, and maker logos are trademarks.

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

These have baked-in colours and should be regenerated whenever the palette or
the logo lettering changes. The icons come from `public/favicon.svg`; the logo
image is the footer logo (plate mark, "Caraway" and "Cash for Cars" in Asap,
white on the blue) at 512 × 279.

- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-512.webp`
- `public/images/logo.webp`
- `public/images/logo.avif`

`public/images/og-card.jpg` and the hero photographs have no brand colour in
them, so they do not change with the palette.
