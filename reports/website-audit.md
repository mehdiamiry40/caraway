# Website Audit (Swarm Agents)

Generated: 2026-04-09T23:25:19.519Z
Overall score: 86/100
Checks: 11 total | 9 pass | 1 warn | 1 fail

## Build & Type Safety Agent

- ✅ **Lint**: Command succeeded.
- ✅ **Typecheck**: Command succeeded.
- ❌ **Production build**: > caraway@0.0.0 build
> next build

Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

   ▲ Next.js 15.5.14
   - Experiments (use with caution):
     ✓ optimizeCss
     · optimizePackageImports

   Creating an optimized production build ...

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
Failed to fetch font `Inter`: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
Please check your network connection.

Retrying 1/3...
Failed to fetch font `DM Sans`: https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&display=swap
Please check your network connection.

Retrying 1/3...
Failed to fetch font `Inter`: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
Please check your network connection.

Retrying 2/3...
Failed to fetch font `DM Sans`: https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&display=swap
Please check your network connection.

Retrying 2/3...
Failed to fetch font `DM Sans`: https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&display=swap
Please check your network connection.

Retrying 3/3...
Failed to fetch font `Inter`: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
Please check your network connection.

Retrying 3/3...
[Error: Failed to fetch font `Inter`: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
Please check your network connection.]
[Error: Failed to fetch font `DM Sans`: https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&display=swap
Please check your network connection.]
Failed to compile.

src/app/layout.tsx
`next/font` error:
Failed to fetch `DM Sans` from Google Fonts.

src/app/layout.tsx
`next/font` error:
Failed to fetch `Inter` from Google Fonts.


> Build failed because of webpack errors

## SEO Agent

- ✅ **Sitemap route exists**: Found src/app/sitemap.ts.
- ✅ **Robots route exists**: Found src/app/robots.ts.
- ✅ **Web manifest exists**: Found public/site.webmanifest.

## Accessibility Agent

- ✅ **Contact form has labels**: Found 5 label tag(s).
- ✅ **Hero images include alt text**: Found 1 alt attribute(s).

## Conversion Agent

- ✅ **Quote action exists**: Found src/actions/quote.ts.
- ✅ **Contact action exists**: Found src/actions/contact.ts.
- ⚠️ **CTA language density on homepage**: Detected 0 CTA keyword matches in src/views/Home.tsx.
