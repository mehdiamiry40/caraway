import { TrustBadges } from "@/components/sections/TrustBadges";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FAQ } from "@/components/sections/FAQ";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomeBelowFold() {
  return (
    <>
      {/* Server-rendered with the page: the primary conversion surface must
          exist in the HTML for crawlers, JS-off users, and #quote-form deep
          links. */}
      <QuoteForm source="home" />
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
