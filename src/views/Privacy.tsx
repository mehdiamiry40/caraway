import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Privacy Policy" },
];

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-primary text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl font-display font-bold mt-4 mb-4">Privacy Policy</h1>
            <p className="text-white/80 text-sm">
              Last updated: March 2026. This policy applies to caraway.au and our cash-for-cars services in Queensland.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8 text-foreground/90 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-display font-bold text-primary mb-3">Who we are</h2>
              <p>
                Caraway (&quot;we&quot;, &quot;us&quot;) operates a vehicle buying and removal service in Greater Brisbane. This policy explains how we handle personal information under the{" "}
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
              <h2 className="text-xl font-display font-bold text-primary mb-3">What we collect</h2>
              <p>We may collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Contact details you provide (name, phone number, email)</li>
                <li>Vehicle details (make, model, year, condition)</li>
                <li>Technical data from the site (e.g. browser type, approximate region) where standard web analytics are used</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-primary mb-3">Why we collect it</h2>
              <p>
                We use this information to respond to quote requests, arrange inspections or pickup, complete vehicle transfers, and improve our service. We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-primary mb-3">Storage and security</h2>
              <p>
                We take reasonable steps to protect personal information from misuse, loss, and unauthorised access. Data may be stored by service providers we use to run our business (for example hosting or email), subject to appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-primary mb-3">Your rights</h2>
              <p>
                You may request access to or correction of your personal information, or complain about our handling of it, by contacting us using the details on our{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2">
                  contact page
                </Link>
                . If you are not satisfied, you may contact the Office of the Australian Information Commissioner (OAIC).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-primary mb-3">Updates</h2>
              <p>We may update this policy from time to time. The revised version will be posted on this page with an updated date.</p>
            </section>
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
