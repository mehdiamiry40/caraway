import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { WhyUs } from "@/components/sections/WhyUs";

export default function HomeBelowFold() {
  return (
    <>
      <PriceEstimator />
      <HowItWorks />
      <WhyUs />
      <FAQ />
      <FinalCTA />
    </>
  );
}
