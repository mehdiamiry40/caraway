import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { LEGAL_DATES } from "@/lib/site";

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
          Last updated: {LEGAL_DATES.termsLastUpdated}. These terms apply to use of this website and our services in Queensland, Australia.
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
            <h2 className="text-xl font-display font-bold text-primary mb-3">Quoted prices</h2>
            <p>
              Prices quoted through our online estimator or over the phone are indicative, based on the information you provide. The final offer is confirmed at pickup after a visual inspection. Market conditions, vehicle condition, and undisclosed damage may affect the final offer. Our published range is $300–$9,999; vehicles may fall anywhere in this range.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Pickup timing</h2>
            <p>
              We aim to offer same- or next-day pickup where scheduling, location, and driver availability permit. Your confirmed pickup window is agreed when you book and may be the following day in some cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Your responsibilities</h2>
            <p>You must provide accurate information about the vehicle and ownership. You must have the right to sell the vehicle and cooperate with transfer paperwork as required by Queensland law.</p>
            <p className="mt-3">You must be at least 18 years old and the legal owner of the vehicle (or authorised by the owner) to request a quote or sell a vehicle through our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Selling your car to us</h2>
            <p>
              When you sell your vehicle to Caraway, you remain the registered owner until the Queensland Transport and Main Roads (TMR) register is updated. We will:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide a receipt showing the sale price, your details, and the buyer&apos;s details</li>
              <li>Lodge the TMR transfer paperwork within 14 days of pickup</li>
              <li>Cancel the registration where you request (you may be entitled to a rego refund)</li>
              <li>Provide photos of the pickup for your records</li>
            </ul>
            <p className="mt-3">You agree to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Present valid photo ID at pickup</li>
              <li>Remove personal belongings from the vehicle</li>
              <li>Sign the transfer documentation provided</li>
              <li>Surrender Queensland number plates if we request them</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Cooling-off and cancellation</h2>
            <p>
              You may cancel a sale at any time before our driver arrives for pickup. Once the vehicle is loaded and payment has been made, the sale is final unless we agree otherwise in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Your rights under Australian Consumer Law</h2>
            <p>
              Nothing in these terms limits your rights under the Australian Consumer Law, including any consumer guarantees that cannot be lawfully excluded. Where a term of this agreement conflicts with the Australian Consumer Law, the Australian Consumer Law prevails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-primary mb-3">Dispute resolution</h2>
            <p>
              If you are not satisfied with any aspect of your sale, please contact us within 24 hours at{" "}
              <a href="mailto:info@caraway.au" className="text-primary underline underline-offset-2">info@caraway.au</a>
              . We will work with you to resolve the issue, and if we cannot agree, you may refer the matter to the Queensland Civil and Administrative Tribunal (QCAT).
            </p>
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
            <h2 className="text-xl font-display font-bold text-primary mb-3">Governing law</h2>
            <p>
              These terms are governed by the laws of Queensland, Australia. You consent to the exclusive jurisdiction of the Queensland courts and QCAT for any dispute.
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
