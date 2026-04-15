import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { LEGAL_DATES } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Privacy Policy" },
];

export default function Privacy() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Privacy Policy"
      subtitle={
        <p>
          This policy applies to Caraway — a cash-for-cars service operating in Queensland. Last updated: {LEGAL_DATES.privacyLastUpdated}.
        </p>
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="prose-body">
          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Who we are</h2>
            <p>
              Caraway (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a vehicle buying and removal service in Queensland. This policy explains how we handle personal information under the{" "}
              <a
                href="https://www.oaic.gov.au/privacy/privacy-act"
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Act 1988 (Cth)
              </a>{" "}
              and the Australian Privacy Principles (APPs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Personal information we collect</h2>
            <p>The types of personal information we collect include:</p>
            <ul className="list-styled mt-4">
              <li><strong>Name</strong> — to address you personally and to complete ownership transfer paperwork.</li>
              <li><strong>Phone number</strong> — to contact you about your quote and coordinate pickup.</li>
              <li><strong>Email address</strong> — to send written quotes, receipts, and follow-up messages.</li>
              <li><strong>Vehicle details</strong> (make, model, year, condition, location, registration status) — to value your vehicle and arrange removal.</li>
              <li><strong>Proof of ownership and photo ID</strong> at the time of pickup — to verify you are entitled to sell the vehicle.</li>
              <li><strong>Technical data</strong> such as browser type, device type and approximate region via standard web analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">How we collect it</h2>
            <p>
              We collect personal information directly from you through our website quote forms, by phone, by SMS, and by email. We may also collect information from our tow operators at the time of pickup (for example, photos of the vehicle and a signed receipt).
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Why we collect it and how we use it</h2>
            <p>We use personal information for the following purposes:</p>
            <ul className="list-styled mt-4">
              <li><strong>Quote delivery</strong> — to prepare and send you a valuation based on the details you provide.</li>
              <li><strong>Pickup coordination</strong> — to arrange a suitable time and location with you and our tow operator.</li>
              <li><strong>Ownership transfer</strong> — to complete the Queensland Transport and Main Roads (TMR) transfer of registration.</li>
              <li><strong>Follow-up</strong> — to confirm you were satisfied with our service and, where you consent, to request a review.</li>
              <li><strong>Legal and record-keeping obligations</strong> — including records required for vehicle transfer and tax.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">How long we keep it</h2>
            <ul className="list-styled mt-4">
              <li><strong>Quote enquiries</strong> where no sale takes place: kept for up to <strong>90 days</strong>, then deleted or de-identified.</li>
              <li><strong>Vehicle transfer records</strong> (receipts, TMR paperwork, ID verification): kept for <strong>7 years</strong> in line with Queensland record-keeping requirements and general tax law.</li>
              <li><strong>Analytics data</strong>: kept in aggregated, anonymised form only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Who we disclose information to</h2>
            <p>We may disclose your personal information to:</p>
            <ul className="list-styled mt-4">
              <li><strong>Tow operators and drivers</strong> who carry out the pickup — they receive your name, phone number and pickup address.</li>
              <li><strong>The Queensland Department of Transport and Main Roads (TMR)</strong> for registration transfer and cancellation.</li>
              <li><strong>IT service providers</strong> who help us run the website, forms, SMS and email (listed below).</li>
              <li><strong>Professional advisors and regulators</strong> where we are required or permitted to by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Overseas disclosure</h2>
            <p>
              <strong>Yes, some personal information is disclosed overseas.</strong> Our website is hosted on <strong>Vercel</strong> in the <strong>United States</strong>, transactional emails to our team are sent through <strong>Resend</strong> in the <strong>United States</strong>, and address autocomplete in our quote form is provided by the <strong>Google Places API</strong> in the <strong>United States</strong>. Our analytics provider may also process data outside Australia. Where we disclose information overseas we take reasonable steps to ensure the recipient handles it consistently with the APPs, including through contractual protections and recipients&apos; own privacy frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Service providers we use</h2>
            <ul className="list-styled mt-4">
              <li><strong>Vercel</strong> — website hosting and Vercel Analytics (United States).</li>
              <li><strong>Webhook processor</strong> — receives form submissions from the site and forwards them securely to our team.</li>
              <li>
                <strong>Resend</strong> (United States) — transactional email delivery to the Caraway team when a quote or contact form is submitted. Resend may receive your name, phone, vehicle details, and pickup address for this purpose. Privacy policy:{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  className="text-primary underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  resend.com/legal/privacy-policy
                </a>
                .
              </li>
              <li>
                <strong>Google Places API</strong> (United States) — address autocomplete in the quote form. When you type an address, the partial query (not your personal details) is sent to Google via our server. Privacy policy:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-primary underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  policies.google.com/privacy
                </a>
                .
              </li>
              <li><strong>SMS and email providers</strong> — to deliver quotes, booking confirmations and follow-ups.</li>
              <li><strong>Google Fonts</strong> — our fonts are self-hosted via <code>next/font</code>, so no request is made to Google when you visit the site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Cookies and analytics</h2>
            <p>
              We use a small number of <strong>essential cookies</strong> needed for the site to function, and <strong>Vercel Analytics</strong>, which measures site performance and traffic in an anonymised form. Vercel Analytics does not use cookies and does not store personal identifiers such as your name, email or IP address in a way that identifies you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Security</h2>
            <p>
              We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access, modification or disclosure. These steps include <strong>encryption in transit (HTTPS/TLS)</strong>, <strong>access controls</strong> so only authorised staff can view customer records, and regular review of our third-party providers. No system is completely secure, and we encourage you to tell us promptly if you suspect any misuse of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Accessing and correcting your information</h2>
            <p>
              Under APPs 12 and 13 you have the right to request access to the personal information we hold about you and to ask us to correct it if it is inaccurate, out of date, incomplete, irrelevant or misleading. To make a request, email{" "}
              <a href="mailto:privacy@caraway.au" className="text-primary underline underline-offset-2">privacy@caraway.au</a>
              . We will respond within a reasonable time and, in most cases, at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Complaints</h2>
            <p>If you believe we have breached the APPs or mishandled your personal information, please follow these steps:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                Contact us first at{" "}
                <a href="mailto:privacy@caraway.au" className="text-primary underline underline-offset-2">privacy@caraway.au</a>{" "}
                with details of your concern. We will acknowledge your complaint and aim to respond within 30 days.
              </li>
              <li>
                If you are not satisfied with our response, you may escalate the matter to the{" "}
                <a
                  href="https://www.oaic.gov.au/"
                  className="text-primary underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Office of the Australian Information Commissioner (OAIC)
                </a>
                . The OAIC can be reached on <strong>1300 363 992</strong>.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-10 mb-4 tracking-tight">Updates to this policy</h2>
            <p>
              We may update this policy from time to time. The revised version will be posted on this page with an updated date. For general questions, see our{" "}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>
              .
            </p>
            <p className="mt-3"><strong>Last updated:</strong> {LEGAL_DATES.privacyLastUpdated}.</p>
          </section>
        </div>
      </div>

      <InternalLinks />
    </PageShell>
  );
}
