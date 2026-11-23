import { TrustBadges } from "@/components/sections/TrustBadges";
import { CarTypes } from "@/components/sections/CarTypes";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HomeCashForCars } from "@/components/sections/HomeCashForCars";

export default function HomeBelowFold() {
  return (
    <>
      {/* The hero quote card is the home page's only quote surface: it is
          server-rendered with the page, so the primary conversion path and
          the #quote-form deep link still work for crawlers and JS-off users. */}
      <TrustBadges />
      <CarTypes />
      <HowItWorks />
      <WhyUs />
      <HomeCashForCars />
      <ServiceAreas />
      <FAQ />
      <SellingSafelySection />
      <FinalCTA />
    </>
  );
}
