import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { SellerSituations } from "@/components/sections/SellerSituations";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { Stats } from "@/components/sections/Stats";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { WhyUs } from "@/components/sections/WhyUs";

export default function HomeBelowFold() {
  return (
    <>
      <TrustBadges />
      <PriceEstimator />
      <HowItWorks />
      <WhyUs />
      <ServiceAreas />
      <SellerSituations />
      <Stats />
      <SellingSafelySection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
