import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Caraway directly",
  robots: { index: false, follow: true },
};
export default function FormUnavailable() {
  return (
    <PageShell
      title="Please contact us directly"
      eyebrow="Form unavailable"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Form unavailable" },
      ]}
    >
      <div className="site-container py-16">
        <p className="mb-6 max-w-xl">
          Your enquiry was not submitted. The online form needs JavaScript to
          finish loading. You can call or email our team instead.
        </p>
        <p>
          <a className="text-primary underline" href={BUSINESS.phoneTel}>
            Call {BUSINESS.phoneDisplay}
          </a>
        </p>
        <p className="mt-4">
          <a className="text-primary underline" href={BUSINESS.emailHref}>
            Email {BUSINESS.email}
          </a>
        </p>
      </div>
    </PageShell>
  );
}
