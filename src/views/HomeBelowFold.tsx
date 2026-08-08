import { TrustBadges } from "@/components/sections/TrustBadges";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomeBelowFold() {
  return (
    <>
      {/* Server-rendered with the page: the primary conversion surface must
          exist in the HTML for crawlers, JS-off users, and #price-estimator
          deep links — the previous ssr:false + IntersectionObserver gate
          served all three an empty placeholder. */}
      <PriceEstimator />
      <TrustBadges />
      <HowItWorks />
      <WhyUs />
      <ServiceAreas />
      <FAQ />
      <SellingSafelySection />
      <FinalCTA />
    </>
  );
}
