import { Stats } from "@/components/sections/Stats";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUs } from "@/components/sections/WhyUs";
import { CarTypes } from "@/components/sections/CarTypes";
import { Testimonials } from "@/components/sections/Testimonials";
import dynamic from "next/dynamic";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";

const QuoteForm = dynamic(() => import("@/components/sections/QuoteForm").then((mod) => mod.QuoteForm));
const PriceEstimator = dynamic(() => import("@/components/sections/PriceEstimator").then((mod) => mod.PriceEstimator));

/**
 * Deferred chunk: below-the-fold sections + quote form + FAQ.
 * Keeps the initial Home bundle smaller (Hero + chrome load first).
 */
export default function HomeBelowFold() {
  return (
    <>
      <Stats />
      <HowItWorks />
      <PriceEstimator />
      <WhyUs />
      <CarTypes />
      <Testimonials />
      <ServiceAreas />
      <QuoteForm />
      <FAQ />
    </>
  );
}
