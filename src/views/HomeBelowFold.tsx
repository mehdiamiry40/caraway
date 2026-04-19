import { DeferredPriceEstimator } from "@/components/sections/DeferredPriceEstimator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";

export default function HomeBelowFold() {
  return (
    <>
      <DeferredPriceEstimator />
      <HowItWorks />
      <Testimonials />
      <ServiceAreas />
      <FAQ />
    </>
  );
}
