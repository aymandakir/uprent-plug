import { HeroSection } from "@/components/marketing/hero-section";
import { LiveStats } from "@/components/marketing/live-stats";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";

export default function MarketingPage() {
  return (
    <main>
      <HeroSection />
      <LiveStats />
      <FeaturesGrid />
      <ComparisonTable />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTA />
    </main>
  );
}

