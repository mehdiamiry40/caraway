import { Stats } from "@/components/sections/Stats";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUs } from "@/components/sections/WhyUs";
import { CarTypes } from "@/components/sections/CarTypes";
import { Testimonials } from "@/components/sections/Testimonials";
import dynamic from "next/dynamic";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { DeferredOnVisible } from "@/components/DeferredOnVisible";

// DeferredOnVisible (client component) gates this so the PriceEstimator
// chunk (react-hook-form + zod + @hookform/resolvers) is only fetched when
// the user scrolls near it. ssr: false can't be used here because this is a
// server component; the IntersectionObserver gate does the deferral.
const PriceEstimator = dynamic(
  () => import("@/components/sections/PriceEstimator").then((mod) => mod.PriceEstimator),
);

/**
 * Deferred chunk: below-the-fold sections + FAQ.
 * Keeps the initial Home bundle smaller (Hero + chrome load first).
 */
export default function HomeBelowFold() {
  return (
    <>
      <Stats />
      <DeferredOnVisible minHeight={600}>
        <PriceEstimator />
      </DeferredOnVisible>
      <Testimonials />
      <HowItWorks />
      <WhyUs />
      <CarTypes />
      <ServiceAreas />
      <FAQ />
      <FinalCTA />
    </>
  );
}
