import { PageShell } from "@/components/layout/PageShell";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Accessibility" }
];

export default function Accessibility() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Accessibility at Caraway"
      subtitle={<p>We&apos;re committed to making our website usable by everyone, including people with disabilities.</p>}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="prose-body">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Our commitment</h2>
          <p>
            We aim to conform to <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>.
            Where we fall short, we&apos;re working to improve.
          </p>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">What we&apos;ve done</h2>
          <ul className="list-styled mt-4">
            <li>Semantic HTML with proper heading hierarchy</li>
            <li>Keyboard navigation and visible focus indicators</li>
            <li>Screen reader announcements for form validation and step changes</li>
            <li>Sufficient color contrast (4.5:1 for text, 3:1 for UI components)</li>
            <li>Reduced motion support via <code>prefers-reduced-motion</code></li>
            <li>Skip-to-content link at the top of every page</li>
            <li>Large touch targets (44×44px minimum)</li>
            <li>Text resize support up to 200% without loss of content</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Known limitations</h2>
          <ul className="list-styled mt-4">
            <li>Our quote tool requires JavaScript. If you can&apos;t run JavaScript, please email us at info@caraway.au.</li>
            <li>Some testimonial videos (when added) may lack captions — we&apos;ll add them as we can.</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Need help?</h2>
          <p>
            If you have trouble using our site, please email{" "}
            <a href="mailto:info@caraway.au" className="text-primary underline font-medium">info@caraway.au</a>{" "}
            and we&apos;ll help you personally. We aim to respond within one business day.
          </p>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Your rights</h2>
          <p>
            The <strong>Disability Discrimination Act 1992 (Cth)</strong> makes it unlawful to discriminate against
            a person because of their disability. If you believe we have failed to meet these standards, please contact us
            first. You can also make a complaint to the Australian Human Rights Commission at{" "}
            <a href="https://humanrights.gov.au" rel="noopener noreferrer" className="text-primary underline">humanrights.gov.au</a>.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
