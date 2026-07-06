import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS, LEGAL_DATES } from "@/lib/site";

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
      <div className="site-container py-14 sm:py-20 lg:py-28">
        <div className="prose-body max-w-3xl">
          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Who we are</h2>
            <p>
              Caraway is a registered business name operated by {BUSINESS.legalName} as a sole trader, ABN {BUSINESS.abn} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), providing vehicle buying and removal services in Queensland. We use the Australian Privacy Principles as our privacy standard and comply with the{" "}
              <a
                href="https://www.oaic.gov.au/privacy/the-privacy-act/"
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Act 1988 (Cth)
              </a>{" "}
              and Australian Privacy Principles (APPs) where they apply to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Personal information we collect</h2>
            <p>The types of personal information we collect include:</p>
            <ul className="list-styled mt-4">
              <li><strong>Name</strong> — to address you personally and to complete ownership transfer paperwork.</li>
              <li><strong>Phone number</strong> — to contact you about your quote and coordinate pickup.</li>
              <li><strong>Email address</strong> — to send written quotes, receipts, and follow-up messages.</li>
              <li><strong>Vehicle details</strong> (make, model, year, condition, location, registration status) — to value your vehicle and arrange removal.</li>
              <li><strong>Authority-to-sell records and photo ID</strong> at pickup — we may sight or record details needed to verify the transaction, and retain a copy only where reasonably necessary.</li>
              <li><strong>Technical data</strong> such as browser type, device type and approximate region via standard web analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">How we collect it</h2>
            <p>
              We collect personal information directly from you through our website quote forms, by phone, by SMS, and by email. We may also collect information from our tow operators at the time of pickup (for example, photos of the vehicle and a signed receipt).
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Why we collect it and how we use it</h2>
            <p>We use personal information for the following purposes:</p>
            <ul className="list-styled mt-4">
              <li><strong>Quote delivery</strong> — to prepare and send you a valuation based on the details you provide.</li>
              <li><strong>Pickup coordination</strong> — to arrange a suitable time and location with you and our tow operator.</li>
              <li><strong>Transaction paperwork</strong> — to prepare receipts and assist with the Queensland Transport and Main Roads (TMR) steps relevant to the sale.</li>
              <li><strong>Follow-up</strong> — to confirm you were satisfied with our service and, where you consent, to request a review.</li>
              <li><strong>Legal and record-keeping obligations</strong> — including records required for vehicle transfer and tax.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">How long we keep it</h2>
            <ul className="list-styled mt-4">
              <li><strong>Quote enquiries</strong> where no sale takes place: kept only while reasonably needed for follow-up, fraud prevention, or dispute handling, then deleted or de-identified.</li>
              <li><strong>Completed-sale records</strong>: kept only for the period reasonably needed for transaction, dispute, accounting, tax, and legal obligations.</li>
              <li><strong>Identity information</strong>: minimised and deleted or de-identified when it is no longer reasonably required.</li>
              <li><strong>Technical server logs</strong>: retained only as reasonably needed for security, debugging, fraud prevention, and service reliability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Who we disclose information to</h2>
            <p>We may disclose your personal information to:</p>
            <ul className="list-styled mt-4">
              <li><strong>Tow operators and drivers</strong> who carry out the pickup — they receive your name, phone number and pickup address.</li>
              <li><strong>The Queensland Department of Transport and Main Roads (TMR)</strong> where you ask us to assist with an applicable process or disclosure is otherwise permitted or required.</li>
              <li><strong>IT service providers</strong> who help us run the website, forms, SMS and email (listed below).</li>
              <li><strong>Professional advisors and regulators</strong> where we are required or permitted to by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Overseas disclosure</h2>
            <p>
              Some service providers operate global infrastructure and may process or store information outside Australia, including in the United States. This may include Vercel, Resend, Google, and providers configured for form delivery. Provider locations and subprocessors can change, so refer to their current privacy and subprocessor information. Where required, we take reasonable steps to ensure overseas recipients handle information consistently with applicable Australian privacy requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Service providers we use</h2>
            <ul className="list-styled mt-4">
              <li><strong>Vercel</strong> — website hosting and delivery infrastructure.</li>
              <li><strong>Upstash</strong> — managed Redis we use for rate limiting on our forms and the address-autocomplete service. Your IP address is processed and stored briefly as a rate-limit counter to prevent abuse; no form contents or personal details are stored there.</li>
              <li><strong>Webhook processor</strong> — receives form submissions from the site and forwards them securely to our team.</li>
              <li>
                <strong>Resend</strong> — transactional email delivery to the Caraway team when a quote or contact form is submitted. Resend may receive your name, phone, vehicle details, and pickup address for this purpose. Privacy policy:{" "}
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
                <strong>Google Places API</strong> — address autocomplete in the quote form. Address text you enter is sent to Google through our server to return suggestions. Privacy policy:{" "}
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
              <li><strong>Fonts</strong> — the site uses system fonts, so no third-party font request is made when you visit.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Cookies and browser storage</h2>
            <p>
              The estimator may use essential browser storage to remember non-sensitive vehicle selections on your device. We do not load advertising tags or third-party analytics scripts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Security</h2>
            <p>
              We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access, modification or disclosure. These steps include <strong>encryption in transit (HTTPS/TLS)</strong>, <strong>access controls</strong> so only authorised staff can view customer records, and regular review of our third-party providers. No system is completely secure, and we encourage you to tell us promptly if you suspect any misuse of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Accessing and correcting your information</h2>
            <p>
              Under APPs 12 and 13 you have the right to request access to the personal information we hold about you and to ask us to correct it if it is inaccurate, out of date, incomplete, irrelevant or misleading. To make a request, email{" "}
              <a href="mailto:privacy@caraway.au" className="text-primary underline underline-offset-2">privacy@caraway.au</a>
              . We will respond within a reasonable time and, in most cases, at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Complaints</h2>
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
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Updates to this policy</h2>
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
    </PageShell>
  );
}
