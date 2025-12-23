import { HeroSection } from "@/components/marketing/hero-section";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import dynamic from "next/dynamic";

// Only dynamically import LiveStats which uses Trust Builder components
const LiveStats = dynamic(
  () => import("@/components/marketing/live-stats").then((mod) => ({ default: mod.LiveStats })),
  { 
    ssr: false,
    loading: () => <div className="h-96 animate-pulse rounded-3xl bg-gray-100" />
  }
);

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

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

