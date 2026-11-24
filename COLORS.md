# Design system: colour, type and spacing

This project uses **semantic tokens only**. The palette is defined in
`src/app/globals.css` as CSS custom properties and exposed to Tailwind via
`@theme inline`. Components should consume Tailwind utilities like
`bg-primary`, `text-foreground`, `border-border`, `bg-cta`, and `text-cta-ink`,
not raw hex, rgb, hsl, or palette-scale utilities like `bg-blue-500`.

The indirection keeps the brand consistent across pages, fallback UI, emails,
browser chrome, and app icons.

---

## The idea

Caraway should look like a well-run local trade business with a printed
identity: warm paper, deep green ink and one gold spot colour. Think of a
written offer on a docket, not a web template.

- **Green is the brand.** Titles, the utility strip and the footer.
- **Gold is the action.** It is kept for the primary button, the logo plate
  and one or two marks per page (the rule under the hero deck, the active nav
  item). If gold appears everywhere it stops meaning "do this".
- **Hierarchy comes from type, rules and space.** Lists, ruled rows, numbered
  steps and two-column text come before boxes. Icons are used only where they
  help someone scan (the tick in a checklist, the arrow on a link, the phone
  on a call button).

Light mode only.

---

## Current palette

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--background`            | `#FAF9F4` | `43 41% 97%`     | Paper: the page canvas |
| `--foreground`            | `#18201C` | `150 14% 11%`    | Ink: default body text |
| `--card`                  | `#FFFFFF` | `0 0% 100%`      | Form and panel surface |
| `--card-foreground`       | `#18201C` | `150 14% 11%`    | Text on cards |
| `--primary`               | `#123A2C` | `158 52% 15%`    | Caraway green: page titles, section headings, green bands |
| `--primary-foreground`    | `#FFFFFF` | `0 0% 100%`      | Text on `--primary` |
| `--secondary`             | `#F1EEE4` | `46 32% 92%`     | Stone: title bands and alternate sections |
| `--secondary-foreground`  | `#18201C` | `150 14% 11%`    | Text on `--secondary` |
| `--muted`                 | `#E8E4D8` | `45 26% 88%`     | Subtle fills (code, disabled) |
| `--muted-foreground`      | `#576059` | `132 5% 36%`     | Secondary and helper text |
| `--accent`                | `#1F6F4B` | `153 56% 28%`    | Confirmation green: ticks, step numerals |
| `--accent-foreground`     | `#FFFFFF` | `0 0% 100%`      | Text on `--accent` |
| `--cta`                   | `#F0B505` | `45 96% 48%`     | Gold: the primary action button and the logo plate |
| `--cta-hover`             | `#DBA100` | `44 100% 43%`    | Hover state of `--cta` |
| `--cta-foreground`        | `#1D1B11` | `50 27% 9%`      | Text on `--cta` |
| `--plate`                 | `#F0B505` | `45 96% 48%`     | Same gold, kept for the plate mark |
| `--plate-foreground`      | `#1D1B11` | `50 27% 9%`      | Text on `--plate` |
| `--destructive`           | `#B3261E` | `3 71% 41%`      | Errors, destructive actions |
| `--destructive-foreground`| `#FFFFFF` | `0 0% 100%`      | Text on `--destructive` |
| `--success`               | `#1F6F4B` | `153 56% 28%`    | Success signal |
| `--success-foreground`    | `#FFFFFF` | `0 0% 100%`      | Text on `--success` |
| `--warning`               | `#E9A30C` | `41 90% 48%`     | Warning signal |
| `--warning-foreground`    | `#18201C` | `150 14% 11%`    | Text on `--warning` |
| `--info`                  | `#1A5FAD` | `212 74% 39%`    | Neutral notices |
| `--info-foreground`       | `#FFFFFF` | `0 0% 100%`      | Text on `--info` |
| `--border`                | `#DAD5C8` | `44 20% 82%`     | Rules and dividers |
| `--input`                 | `#7A8179` | `111 3% 49%`     | Form field border (3:1 against the card) |
| `--ring`                  | `#1D60D3` | `218 76% 47%`    | Focus ring on paper, stone and cards |

### Text variants of the action colours

Gold and mid green only pass contrast as *surfaces*. Use these when the hue
has to be text.

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--cta-ink`               | `#7A4E00` | `38 100% 24%`    | Amber text on paper (rare) |
| `--accent-ink`            | `#17593B` | `153 59% 22%`    | Green text and links on paper |
| `--cta-bright`            | `#F7C53B` | `44 92% 60%`     | Gold text on green bands |
| `--accent-on-dark`        | `#7DD4A5` | `148 50% 66%`    | Green text on green bands |

### Green band tokens

| Token                     | Hex       | HSL             | Role |
| ------------------------- | --------- | --------------- | ---- |
| `--ink`                   | `#123A2C` | `158 52% 15%`    | Green band surface (footer, "Why Caraway") |
| `--ink-deep`              | `#0C2C20` | `158 56% 11%`    | Legal bar, depth |
| `--ink-raised`            | `#1B4B39` | `158 47% 20%`    | Raised surface on a green band |
| `--on-dark`               | `#C6D2CB` | `145 12% 80%`    | Secondary text on green bands |
| `--on-dark-hi`            | `#FFFFFF` | `0 0% 100%`      | Primary text on green bands |
| `--shadow-color`          | `#141F1A` | `150 20% 10%`    | Shadows |

Inside a green band add the `on-green` class to the band. It switches
`--ring` to `#FFD35C` so the focus ring keeps its contrast on green.

### WCAG contrast

Measured pairs (WCAG 2.1 relative luminance):

| Text / surface | Ratio |
| -------------- | ----- |
| Ink on paper / card / stone | 15.8 / 16.6 / 14.3 |
| Green titles on paper / stone | 12.0 / 10.9 |
| Muted text on paper / card / stone / muted | 6.2 / 6.5 / 5.6 / 5.1 |
| Green link text (`--accent-ink`) on paper / card / stone | 7.9 / 8.3 / 7.2 |
| Button text on gold / gold hover | 9.3 / 7.5 |
| White on green band | 12.6 |
| Secondary text (`--on-dark`) on green / deep green | 8.1 / 9.7 |
| Gold text (`--cta-bright`) on green | 7.8 |
| Error text on card / paper | 6.5 / 6.2 |
| Field border on card / paper (needs 3:1) | 4.0 / 3.8 |
| Focus ring on paper / card / stone (needs 3:1) | 5.4 / 5.7 / 4.9 |
| Focus ring on green / deep green (`on-green`) | 8.8 / 10.5 |

Core text stays AA or better; most pairs are AAA. Do not rely on colour
alone: status colours carry an icon or words. Never use `--cta` gold as text
on paper; use `--cta-ink`.

---

## Type

Two families, both variable, loaded through `next/font/google` in
`src/app/layout.tsx` (self-hosted, latin subset, `display: swap`):

| Family | Variable | Used for |
| ------ | -------- | -------- |
| **Besley** (a Clarendon) | `font-display` | Page titles, section headings, the logo word, a few display lines |
| **Public Sans** | `font-sans` | Body copy, sub-headings, labels, buttons, forms, navigation |

Base styles set `h1` and `h2` in Besley and `h3`–`h6` in Public Sans, so a
sub-heading never competes with the heading above it. Headings are written
and shown in sentence case; there are no all-caps display headlines. The only
uppercase text is the small `.eyebrow` / `type-label` label, used sparingly.

| Utility | Size | Use |
| ------- | ---- | --- |
| `type-display` | 38px → 66px, fluid | Home hero, the green band line, the closing question |
| `type-h1` | 32px → 52px, fluid | Inner page titles |
| `type-h2` | 26px → 38px, fluid | Section headings on bands |
| `SectionHeading` (component) | 24px / 28px | Headings inside a text column |
| `type-h3` | 19px | Sub-headings |
| `type-lead` | 17px → 19px | Intro paragraph under a title |
| body | 16px–18px, line-height 1.6–1.7 | Running text; articles use `.prose-body` at 17/18px |
| `type-label` / `.eyebrow` | 13px, uppercase, tracked | A kicker above a title, rarely |

Long text is held to a 60–68 character measure (`max-w-[68ch]`).

---

## Spacing and shape

- **Scale.** Tailwind's 4px scale. Related items sit 8–16px apart, blocks
  inside a section 24–48px, sections 64–112px.
- **Section rhythm.** `.section-y` (64 / 80 / 112px), `.section-y-tight`
  (48 / 56 / 64px) and `.section-y-hero` for title bands. Bands alternate
  paper and stone, with one green band on the home page, so sections do not
  all look alike.
- **Rules.** A 2px green rule opens a list or a run of steps; 1px
  `border-border` rules separate rows. Reach for a rule before a box.
- **Corners.** 2–6px (`rounded-sm` to `rounded-xl`). Nothing is pill-shaped.
- **Shadow.** Only the form cards, menus and the mobile call bar lift off the
  page (`shadow-lg` / `shadow-xl`).

## Patterns

- **Buttons.** Two styles: the gold primary (`buttonVariants()` default) and
  the outlined secondary (`variant: "outline"`, or `"outlineOnDark"` on a
  green band). `ghost` is a quiet text button for a third action in a row.
- **Links.** Green, underlined. `.link-arrow` adds the trailing arrow for
  "go here next" links; add `.link-back` when the arrow leads.
- **Lists.** `.list-ticks` for checklists, `.list-inline` for a run of short
  items that reads as a sentence, ruled rows for anything linkable.
- **Forms.** A visible label above every field, 48px controls, a red
  asterisk for required fields and "(optional)" spelled out.

---

## Usage rules

### Do
- Use semantic tokens in JSX: `className="bg-primary text-primary-foreground"`.
- Pair every coloured surface with its matching `-foreground` token.
- Use the button variants rather than hand-rolled button classes.
- Add opacity with slash syntax on semantic tokens: `bg-primary/10`,
  `text-foreground/80`.

### Don't
- **No hardcoded hex, rgb, or hsl literals in components.** Exceptions:
  the two email templates (`src/lib/quote-email.ts`,
  `src/lib/contact-email.ts`) and `src/app/global-error.tsx` must use inline
  hex because CSS variables are not available in those contexts.
- **No `bg-white`, `text-white`, `bg-black`, or `text-black`.** Use
  `bg-card`, `text-primary-foreground`, or the relevant semantic foreground.
- **No named Tailwind colour utilities** (`bg-blue-500`, `text-gray-900`,
  etc.). If a colour is needed, add it to `globals.css` first.
- **No icon in a coloured square, no hazard stripes, no eyebrow label on
  every section.** They are what made the previous design read as a template.

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
lockup is the header logo (plate mark, "Caraway" in Besley, "Cash for Cars" in
Public Sans) on the green band colour, at 512 × 279.

- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-512.webp`
- `public/images/logo.webp`
- `public/images/logo.avif`

`public/images/og-card.jpg` is a photograph with no brand colour in it, so it
does not change with the palette.
