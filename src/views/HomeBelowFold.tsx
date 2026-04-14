import { Stats } from "@/components/sections/Stats";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUs } from "@/components/sections/WhyUs";
import { CarTypes } from "@/components/sections/CarTypes";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { DeferredPriceEstimator } from "@/components/sections/DeferredPriceEstimator";
import { TrustBadges } from "@/components/sections/TrustBadges";

/**
 * Below-the-fold sections. The PriceEstimator form is deferred via
 * DeferredPriceEstimator (client component with ssr:false dynamic import
 * + IntersectionObserver gate) so its heavy deps (~200 KiB) stay off the
 * initial page bundle.
 */
export default function HomeBelowFold() {
  return (
    <>
      <Stats />
      <TrustBadges />
      <DeferredPriceEstimator />
      <HowItWorks />
      <WhyUs />
      <CarTypes />
      <ServiceAreas />
      <Testimonials />
      <FAQ />
      <InternalLinks />
      <FinalCTA />
    </>
  );
}
