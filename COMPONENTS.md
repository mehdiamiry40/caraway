# Components

Minimal reference for the most-used UI primitives in `src/components/ui/`.
See [COLORS.md](COLORS.md) for the underlying token system.

---

## Button

File: [src/components/ui/button.tsx](src/components/ui/button.tsx)

Pill-shaped, bold-weight CTA with chunky offset-shadow. Built on CVA so
variants and sizes compose.

### Variants

| Variant       | Surface                            | Use when                                    |
| ------------- | ---------------------------------- | ------------------------------------------- |
| `cta` (default) | Lime green (`--cta`)             | Primary action on any light surface         |
| `primary`     | Deep purple (`--primary`)          | Brand-forward button on a light band        |
| `accent`      | Orange (`--accent`)                | Emphasis on a colour-mixed layout           |
| `outline`     | White card + purple 2px border     | Quiet secondary action on white             |
| `ghost`       | Transparent + purple text          | Tertiary / link-like                        |
| `inkOutline`  | Transparent + on-dark 2px border   | Secondary action on a `--primary` band      |

### Sizes

| Size      | Height                | Use when              |
| --------- | --------------------- | --------------------- |
| `default` | `h-12` / `px-6`       | Most buttons          |
| `sm`      | `h-11` / `px-5`       | Dense rows, filters (44px touch target) |
| `lg`      | `h-14 sm:h-16`        | Hero / section CTA    |
| `icon`    | `h-12 w-12`           | Icon-only button      |

### Props

| Prop        | Type              | Default  | Description                              |
| ----------- | ----------------- | -------- | ---------------------------------------- |
| `variant`   | see above         | `cta`    | Visual variant                           |
| `size`      | see above         | `default`| Height / padding                         |
| `isLoading` | `boolean`         | `false`  | Shows spinner, disables click, sets `aria-busy` |
| ...plus all native `<button>` attributes | | |           |

### States

All variants cover: default, hover (lift + deeper shadow), active
(translate-back), focus-visible (2px ring), disabled (60% opacity, no
pointer), loading (spinner + disabled + aria-busy).

### Accessibility

- Renders a real `<button>`; all native keyboard behaviour applies.
- `isLoading` sets `aria-busy="true"`.
- Focus ring uses `--ring` (matches `--primary`) with 2px offset.

### Don't

- Don't style buttons inline. Extend via `className` with layout-only
  utilities (`w-full`, `group`, `gap-*`).
- Don't use `variant="primary"` where `cta` is more appropriate — `cta`
  is the lime action colour the user is trained to click.

---

## Input, Textarea, Select

Files: [input.tsx](src/components/ui/input.tsx) ·
[textarea.tsx](src/components/ui/textarea.tsx) ·
[select.tsx](src/components/ui/select.tsx)

All three share the same surface and state classes via
[field-classes.ts](src/components/ui/field-classes.ts) so changes to
the form-field look happen in one place.

### Shared states

| State          | Visual                                                          |
| -------------- | --------------------------------------------------------------- |
| Default        | `--card` fill, 1px `--border`, subtle bottom shadow             |
| Hover          | Border goes to `primary/40`                                     |
| Focus-visible  | 2px `ring/30`, `--primary` border, 4px accent glow              |
| Disabled       | 50% opacity, not-allowed cursor, no hover                       |
| Invalid (`aria-invalid="true"`) | Destructive border + tinted bg + destructive ring |
| Autofill (Input/Textarea only)  | Card-colour override so Chrome's yellow doesn't leak |

### Input extras

- `file:` reset so native file button picks up our typography.
- `placeholder:text-muted-foreground/60`.

### Textarea extras

- `resize-y` enabled by default (users expect it).
- `min-h` of 136px mobile / 160px desktop.

### Select extras

- Custom caret (`ChevronDown` absolute-positioned); native `<select>`
  still handles keyboard + option list.
- Optional `placeholder` prop renders a disabled first option.

---

## Accordion

File: [src/components/ui/accordion.tsx](src/components/ui/accordion.tsx)

Single-open FAQ accordion. Not a compound/headless component — it takes
an `items` array and renders the full tree.

### Props

| Prop           | Type                               | Default | Description                                 |
| -------------- | ---------------------------------- | ------- | ------------------------------------------- |
| `items`        | `{ question, answer }[]`           | required| Item list                                   |
| `headingLevel` | `2` \| `3` \| `4`                  | `3`     | Semantic level of each trigger heading      |
| `onItemToggle` | `(q, opening) => void`             | —       | Fires on open/close (analytics)             |
| `className`    | `string`                           | —       | Applied to the root wrapper                 |

### Accessibility

- Each trigger is a real `<button>` wrapped in the chosen heading level
  (`h3` by default). Set `headingLevel={2}` on pages where the nearest
  preceding heading is an `h1` to avoid skipping levels.
- `aria-expanded`, `aria-controls`, and `role="region"` wire trigger ↔
  panel correctly for screen readers.
- Keyboard: Tab / Shift+Tab, Enter / Space to toggle.
- Motion-reduce-safe (grid-rows animation falls back instantly).

### Don't

- Don't wrap an Accordion trigger in a `<div>` or `<summary>` — it's
  already a button under a heading.
- Don't nest accordions; the single-open state is scoped per-instance
  but nesting causes confusing focus flow.

---

## Checkbox

File: [src/components/ui/checkbox.tsx](src/components/ui/checkbox.tsx)

Plain native `<input type="checkbox">` with a styled checked state and
an inline SVG tick. Covers default / checked / focus / disabled.

### Intentionally out of scope

Sizes, indeterminate state, and a built-in label slot are **not**
included. The site's current forms use the checkbox in a single size with
an external `<label>`, so adding variants now would be dead API. Add
them when a second use case appears.

---

## Other primitives

- **AddressAutocomplete** ([address-autocomplete.tsx](src/components/ui/address-autocomplete.tsx)) — Places-backed combobox; full ARIA (`role="combobox"`, `aria-activedescendant`, listbox), keyboard nav, loading + no-results states, silent fallback when the proxy returns 503.
- **Icon** ([icon.tsx](src/components/ui/icon.tsx)) — thin wrapper over Lucide that normalises stroke width to 1.5 and offers 5 discrete sizes. `duotone` renders a 10%-opacity purple square behind the icon.
- **Skeleton** ([skeleton.tsx](src/components/ui/skeleton.tsx)) — `animate-pulse` on a muted fill. Motion-reduce-safe.
- **Reveal / RevealGroup / RevealItem** ([motion.tsx](src/components/ui/motion.tsx)) — currently no-op passthrough wrappers. Kept so animations can be added later without touching every consumer.
