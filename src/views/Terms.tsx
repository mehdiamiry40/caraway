import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS, LEGAL_DATES } from "@/lib/site";

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
      <div className="site-container py-14 sm:py-20 lg:py-28">
        <div className="prose-body max-w-3xl">
          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Agreement</h2>
            <p>
              Caraway is a registered business name operated by {BUSINESS.legalName} as a sole trader, ABN {BUSINESS.abn}. By using this website or engaging Caraway to buy or remove your vehicle, you agree to these terms. If you do not agree, do not use the site or our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Services</h2>
            <p>
              We provide free, no-obligation vehicle quotes, vehicle purchase, and collection where agreed. Quotes are based on the information you provide and current assessment inputs. Pickup is included when Caraway buys and the supplied vehicle, location, and access details match. We will not pressure you to accept an offer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Quoted prices</h2>
            <p>
              The online estimator is indicative. We review the information you provide and confirm an offer in writing before pickup is booked. At collection, we check that the vehicle matches the disclosed details. If there is a material difference, such as undisclosed damage, missing major components, or different access conditions, we will explain any revised offer and you may reject it before the vehicle is loaded. No generic website amount guarantees the offer for an individual vehicle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Pickup timing</h2>
            <p>
              Collection timing depends on the vehicle, location, access, equipment, and availability. The pickup window and payment arrangement are confirmed for each accepted job before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Your responsibilities</h2>
            <p>You must provide accurate information about the vehicle and ownership. You must have the right to sell the vehicle and cooperate with transfer paperwork as required by Queensland law.</p>
            <p className="mt-3">You must be at least 18 years old and the legal owner of the vehicle (or authorised by the owner) to request a quote or sell a vehicle through our service.</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Selling your car to us</h2>
            <p>
              Queensland Transport and Main Roads (TMR) requirements depend on whether the vehicle is transferred with registration, sold unregistered, or has its registration cancelled. You remain responsible for completing the seller-side steps that apply and confirming the TMR record is updated. We will:
            </p>
            <ul className="list-styled mt-4">
              <li>Provide a receipt showing the sale price, your details, and the buyer&apos;s details</li>
              <li>Provide the buyer details and transaction information needed for the applicable paperwork</li>
              <li>Help identify whether the transaction requires a registration transfer, cancellation, or an unregistered-vehicle sale record</li>
            </ul>
            <p className="mt-3">You agree to:</p>
            <ul className="list-styled mt-4">
              <li>Present valid photo ID at pickup</li>
              <li>Remove personal belongings from the vehicle</li>
              <li>Sign and keep copies of the applicable transaction documentation</li>
              <li>Handle Queensland number plates according to the transaction type and current TMR requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Cooling-off and cancellation</h2>
            <p>
              A quote is no-obligation until you accept it. If you accept and book collection, tell us promptly if your plans change. Any cancellation or completed-sale terms that apply to the job will be confirmed in writing; nothing in these terms removes rights that cannot lawfully be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Your rights under Australian Consumer Law</h2>
            <p>
              Nothing in these terms limits your rights under the Australian Consumer Law, including any consumer guarantees that cannot be lawfully excluded. Where a term of this agreement conflicts with the Australian Consumer Law, the Australian Consumer Law prevails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Dispute resolution</h2>
            <p>
              If you are not satisfied with any aspect of your sale, contact us promptly at{" "}
              <a href="mailto:info@caraway.au" className="text-primary underline underline-offset-2">info@caraway.au</a>
              . We will work with you to resolve the issue, and if we cannot agree, you may refer the matter to the Queensland Civil and Administrative Tribunal (QCAT).
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Limitation of liability</h2>
            <p>
              To the extent permitted by law, we are not responsible for loss caused by inaccurate information supplied to us, unauthorised sale of a vehicle, or use of general website information without checking current official requirements. Nothing in these terms excludes or limits rights or remedies that cannot lawfully be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Website</h2>
            <p>
              Content on this site is for general information. We aim to keep information accurate but do not warrant that it is complete or current. Links to third-party sites are not endorsements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Governing law</h2>
            <p>
              These terms are governed by the laws of Queensland, Australia. You consent to the exclusive jurisdiction of the Queensland courts and QCAT for any dispute.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-display text-foreground mt-10 mb-4 tracking-tight">Contact</h2>
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
    </PageShell>
  );
}
