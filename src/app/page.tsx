import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";
import HowItWorks from "@/components/HowItWorks";
import StatsBar from "@/components/StatsBar";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoryGrid />
      <FeaturedOpportunities />
      <HowItWorks />
      <CTASection />
    </>
  );
}
