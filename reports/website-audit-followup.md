# Website Audit — Follow-up Improvements

Generated: 2026-04-11
Scope: 8 parallel specialist agents auditing for improvements *beyond* the original `reports/website-audit.md` (score 86/100).

Business context: Caraway Pty Ltd — Brisbane cash-for-cars buyer, Next.js 15 / React 19 / Tailwind 4.

---

## P0 — Ship first (high impact, low effort)

1. **Phone number is hidden.** `1800 CAR AWAY (1800 227 293)` is defined in `src/lib/site.ts:11-12` but never rendered in `Header.tsx`, `Footer.tsx`, or Contact page header. Add a sticky header phone CTA and a footer `tel:` link. High-intent channel is currently invisible.
2. **Homepage CTA language deficit.** `src/components/sections/Hero.tsx:37` — single button "See my price in 60 seconds"; zero matches on "get quote / call / sell / cash". Add secondary "Call 1800 CAR AWAY" button and tighten primary copy to "Get my instant quote".
3. **Price range contradiction.** Stats/Hero show `$50–$9,999`, FAQ `src/app/faq/...` says `$150–$9,999`. Pick one. Also dedupe `MAX_PRICE` in `src/lib/site.ts:24-25` vs `PRICE_TABLE.maxHigh` in `src/lib/price-estimator.ts:76`.
4. **No physical address.** "Locally owned" claim in `About.tsx:39` conflicts with missing NAP. Add street address to `site.ts` and Footer; Locations page `src/views/Locations.tsx` also lacks phone/email/hours.
5. **Remove unused `critters` dependency.** `package.json:26` — `next.config.ts:16` comments that optimizeCss/critters was removed but the package is still installed.
6. **Sitemap `SITE_LAST_MODIFIED` is hardcoded** to `"2026-04-01"` in `src/app/sitemap.ts:7`. Replace with dynamic `new Date()` or per-page mtime.
7. **Unverified review claim.** Hero + Stats show "4.9★ / 200+ sellers served" with no link to Google/Trustpilot. Either link the source or soften the claim (founded 2025 per `site.ts:9`).

## P1 — Conversion & UX

8. **Quote form benefits hidden on mobile.** `QuoteForm.tsx:122` uses `hidden lg:flex` — trust reassurance disappears on the device where most submissions happen. Duplicate a compact mobile version.
9. **Success states lack next steps.** `QuoteForm.tsx:101` ("Thanks — we've got your details") and `ContactForm.tsx:69` ("Message sent") should state ETA ("We'll call within 1 business day") and mention spam folder.
10. **Contact form friction.** `quote-schema.ts:78` enforces `message >= 10 chars`. Drop to 5 with helper text "Optional: describe your car".
11. **Blog → conversion weak link.** `BlogPost.tsx:59` CTA "Get a free quote today — same-day pickup" has no phone number and no urgency. Replace with "Call 1800 227 293 or get a free instant quote".
12. **FAQ CTA lacks phone.** `src/views/FAQPage.tsx:80` "Still have questions?" only links to quote/contact. Add `tel:` link and "No obligation" micro-copy.
13. **Locations page NAP.** `Locations.tsx:28` CTA is only "Get an Instant Quote". Add local phone copy.
14. **FAQ schema missing telephone.** `src/app/faq/page.tsx` JSON-LD — add `telephone` to FAQPage schema for rich results.

## P1 — Accessibility (WCAG 2.1 AA blockers)

15. **Contrast failures on primary background.**
    - `Breadcrumbs.tsx:22` `text-white/30` on `bg-primary` ≈ 1.8:1 (needs 3:1).
    - `CarTypes.tsx:29` `text-primary-foreground/60` ≈ 2.2:1.
    - `CarTypes.tsx:61` `/40` ≈ 1.5:1.
    - `CarTypes.tsx:71` `/30` ≈ 1.2:1.
    Bump opacities to `/70` or higher and verify with contrast checker.
16. **Spinners ignore `prefers-reduced-motion`.** `button.tsx:50` and `PriceEstimator.tsx` use `animate-spin` with no `motion-reduce:` override.
17. **Accordion transition unguarded.** `accordion.tsx:62-64` `duration-300` transition — add `motion-reduce:transition-none`.
18. **Skip link target missing on loading pages.** `src/app/loading.tsx` and `src/app/contact/loading.tsx` render `<main>` without `id="main-content"`.
19. **No `fieldset`/`legend` grouping** around related fields in quote/contact forms.
20. **Mobile menu focus restoration.** `Header.tsx:48` uses `requestAnimationFrame` to restore focus on close — fragile with some screen readers. Use direct ref.focus() + small setTimeout fallback.

## P1 — SEO

21. **Blog OpenGraph incomplete.** `src/app/blog/[slug]/page.tsx:31-46` has `type: "article"` but missing `authors`, `tags`, and `modified_time`. Match BlogPosting JSON-LD richness.
22. **Twitter creator handle missing.** `src/app/blog/[slug]/page.tsx:46` and `src/app/layout.tsx:72-74` — add `twitter: { creator, site }` when a handle exists.
23. **Orphan pages lack JSON-LD.** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/accessibility/page.tsx` have no breadcrumb or WebPage schema.
24. **OG images are all the same.** Every page falls back to `/images/tow-truck-hero.webp`. Service pages should use `service.image` if available.

## P1 — Performance

25. **Providers is `"use client"` for the entire tree.** `src/app/providers.tsx:1` — only `BackToTopButton` needs client hydration. Move it out and keep `children` server-rendered.
26. **Header is entirely client.** `Header.tsx:1` — split mobile-menu state into a tiny client component; keep the static header skeleton server-rendered.
27. **Oversized static assets.**
    - `public/images/logo.png` (274K) — export as SVG or re-compress to < 100K.
    - `public/icon-512.png` (102K) — convert to WebP.
    - `public/opengraph.jpg` (90K) — target < 50K.
28. **Font weights may be over-loaded.** `layout.tsx:16-28` loads Ubuntu `400/500/700` and Exo `600/700`. Audit actual rendered weights and trim.
29. **Verify PriceEstimator is below the fold.** `HomeBelowFold.tsx:11` uses `dynamic()` — confirm it doesn't ship to the homepage initial bundle.

## P2 — Security

30. **CSP uses `'unsafe-inline'` for scripts.** `next.config.ts:34` — justified by App Router hydration; add a tracking TODO for nonce-based migration when feasible.
31. **In-memory rate limiter.** `middleware.ts:9-11` resets on cold starts. Document limitation, or move to Vercel KV / Upstash for production.
32. **JSON-LD `dangerouslySetInnerHTML`.** `src/components/JsonLd.tsx:23` — safe today via `JSON.stringify`, but add a JSDoc warning on the helper explaining why it's acceptable.

## P2 — UI consistency

33. **Global error page uses inline styles.** `src/app/global-error.tsx:21-40` — replace with Tailwind, use `<Button>` variant, add focus ring and ARIA.
34. **Loading state is text-only.** `src/app/loading.tsx:9` — replace with section skeletons.
35. **No centralized z-index scale.** `Header.tsx:160` z-50, `BackToTopButton.tsx:31` z-40, mobile drawer `z-[100]`. Extract to `src/lib/z-index.ts`.
36. **Input/Select height redundancy.** `Input.tsx:12` declares both `min-h-[44px]` and `h-12 sm:h-14`. Pick one definition.
37. **Icon sizes ad-hoc.** Hero stars `w-3.5`, Testimonials `w-5`, HowItWorks `w-8`. Define `icon-sm/md/lg` tokens.
38. **Empty states missing.** `Blog.tsx` and `Locations.tsx` (filter results) have no fallback UI.
39. **Breadcrumb truncation ugly.** `Breadcrumbs.tsx:37` uses `max-w-[200px] sm:max-w-none`. Allow wrap or use `truncate` with a `title` attribute.

## P2 — Code quality & tech debt

40. **Test coverage gap.** Only 2 test files for 72 TSX components. `vitest.config.ts:15` restricts discovery to `src/lib/__tests__`. Extend globs and cover `submit-form.ts`, `contact.ts`, `quote.ts`, `PriceEstimator`, `ContactForm`, `QuoteForm`.
41. **Magic numbers.** `ContactForm.tsx:36-37` (`MESSAGE_MAX=5000`, `MESSAGE_WARN=4500`), `submit-form.ts:79,93` (1500ms, 8000ms), `-9999px` honeypot offset appearing 3× — extract to `src/data/constants.ts`.
42. **Error handling.** `submit-form.ts:103-105` logs only in dev. Wire Sentry `captureException` (already installed) for server action failures.
43. **Sessionstorage parse is silent.** `PriceEstimator.tsx:124` — `JSON.parse()` swallows errors; log via Sentry instead.
44. **Data coupling.** `FAQ.tsx:5` re-exports `faqs`; `QuoteForm.tsx:22-25` has hardcoded benefit copy. Move to `src/data/`.
45. **ESLint is too permissive.** `eslint.config.mjs` — enable `@typescript-eslint/no-unused-vars`, `react-hooks/exhaustive-deps`, `no-implicit-any`.

## P2 — Content

46. **"About team" is thin.** `About.tsx:46` names only founder Mehdi Emir; "local team" claim is unsubstantiated. Add team section or remove the claim.
47. **Two email addresses.** `info@caraway.au` vs `privacy@caraway.au` (`Privacy.tsx:127`) — consolidate; keep privacy@ only in the privacy page.
48. **No process/timeline page.** Users can't answer "how long does it take?" Add "How It Works" with realistic hour estimates.
49. **No visual service-area map.** `About.tsx:79-81` and `services.ts:181` have text suburb walls. Add an embedded map.
50. **Accessibility claim vague.** `Accessibility.tsx` claims WCAG 2.2 AA but no audit date or third-party cert — tighten the language or commit to an audit date.
51. **Terms liability gaps.** `Terms.tsx:86-89` — missing liability cap dollar amount and tow-truck damage liability clause.
52. **Blog metadata weak.** No byline/author schema, no "Last updated" date. Add to BlogPost.tsx template and blog-posts data.
53. **Punctuation inconsistency.** `BlogPost.tsx:59` uses `--` (en-dash fallback) rather than `—` em-dash.

---

## Suggested sequencing

**Week 1 (P0 quick wins):** items 1–7. Phone number visibility, price contradiction, address, sitemap date, unused dep, CTA copy.
**Week 2 (a11y + conversion):** items 8–20. Contrast fixes, reduced-motion, form success copy, mobile benefits panel.
**Week 3 (SEO + perf):** items 21–29. JSON-LD for orphan pages, richer blog OG, trim client boundaries, compress assets.
**Ongoing:** items 30–53 (code quality, test coverage, content depth).

## Agent coverage

- Build & type safety: pre-existing `website-audit.md` (build still failing due to offline Google Fonts — unrelated to code).
- This run (8 agents): SEO, a11y, performance, security, conversion/UX, code quality, content, UI/responsive.
