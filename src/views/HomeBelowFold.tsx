import { HowItWorks } from "@/components/sections/HowItWorks";
import { DeferredPriceEstimator } from "@/components/sections/DeferredPriceEstimator";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";

export default function HomeBelowFold() {
  return (
    <>
      <HowItWorks />
      <DeferredPriceEstimator />
      <WhyUs />
      <Testimonials />
      <ServiceAreas />
      <FAQ />
    </>
  );
}
