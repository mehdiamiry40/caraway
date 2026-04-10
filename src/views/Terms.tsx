import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Terms of Service" },
];

export default function Terms() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Terms of Service"
      subtitle={
        <p>
          Last updated: March 2026. These terms apply to use of this website and our services in Queensland, Australia.
        </p>
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8 text-foreground/90 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Agreement</h2>
            <p>
              By using this website or engaging Caraway to buy or remove your vehicle, you agree to these terms. If you do not agree, do not use the site or our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Services</h2>
            <p>
              We provide quotes, vehicle purchase, and towing where offered. Quotes are based on information you provide and market conditions; a final offer may be confirmed after inspection. We will not pressure you to accept an offer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Your responsibilities</h2>
            <p>You must provide accurate information about the vehicle and ownership. You must have the right to sell the vehicle and cooperate with transfer paperwork as required by Queensland law.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by the Australian Consumer Law and other applicable law, we exclude liability for indirect or consequential loss arising from use of this site or our services. Our liability for any claim related to services we provide is limited to resupplying the goods or services or paying the cost of having them supplied again, or otherwise as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Website</h2>
            <p>
              Content on this site is for general information. We aim to keep information accurate but do not warrant that it is complete or current. Links to third-party sites are not endorsements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Contact</h2>
            <p>
              Questions about these terms: see our{" "}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>

      <InternalLinks />
    </PageShell>
  );
}
