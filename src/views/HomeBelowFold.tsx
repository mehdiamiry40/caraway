import { TrustBadges } from "@/components/sections/TrustBadges";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DeferredPriceEstimator } from "@/components/sections/DeferredPriceEstimator";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";

/**
 * Below-the-fold sections. Deliberately slimmed for a quieter, premium flow:
 * trust row → how it works → quote form → why us → testimonials → service
 * areas → FAQ. CarTypes, Stats, InternalLinks and FinalCTA have been dropped
 * from the homepage to reduce section proliferation; they're still available
 * on service/suburb templates and in the footer.
 *
 * The PriceEstimator form is deferred via DeferredPriceEstimator so its
 * heavy deps stay off the initial page bundle.
 */
export default function HomeBelowFold() {
  return (
    <>
      <TrustBadges />
      <HowItWorks />
      <DeferredPriceEstimator />
      <WhyUs />
      <Testimonials />
      <ServiceAreas />
      <FAQ />
    </>
  );
}
