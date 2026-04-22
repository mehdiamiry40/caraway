import { TrustBadges } from "@/components/sections/TrustBadges";
import { Stats } from "@/components/sections/Stats";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomeBelowFold() {
  return (
    <>
      <TrustBadges />
      <Stats />
      <HowItWorks />
      <PriceEstimator />
      <WhyUs />
      <Testimonials />
      <ServiceAreas />
      <FAQ />
      <FinalCTA />
    </>
  );
}
