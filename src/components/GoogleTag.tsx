import Script from "next/script";

/**
 * Google tag (gtag.js) for Google Ads conversion measurement.
 *
 * Renders the two-part gtag snippet via next/script with the
 * "afterInteractive" strategy — Google's recommended approach — so the tag
 * loads as soon as the page is interactive without blocking first paint.
 * Rendered once from the root layout, so it is present on every page.
 *
 * The inline init script relies on `'unsafe-inline'` in the CSP script-src,
 * and the loader/transport domains (googletagmanager.com plus the Google ad
 * domains) must stay allow-listed in script-src / connect-src / img-src
 * (see next.config.ts) or the browser will block the tag.
 */
export function GoogleTag({ id }: { id: string }) {
  return (
    <>
      <Script
        id="gtag-js"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
