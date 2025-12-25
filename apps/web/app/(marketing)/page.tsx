import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { LogoBar } from '@/components/landing/logo-bar';
import { KeyBenefits } from '@/components/landing/key-benefits';
import { InteractiveDemo } from '@/components/landing/interactive-demo';
import { UseCases } from '@/components/landing/use-cases';
import { SocialProof } from '@/components/landing/social-proof';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { PricingSection } from '@/components/landing/pricing-section';
import { FAQSection } from '@/components/landing/faq-section';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'RentFusion - Find Your Dutch Rental in 15 Seconds',
  description:
    'AI-powered rental alerts for 1,500+ sources. Never miss a listing again. Trusted by 10,000+ renters in the Netherlands.',
  keywords: [
    'rental',
    'housing',
    'Netherlands',
    'Amsterdam',
    'Utrecht',
    'Rotterdam',
    'apartment finder',
    'rental alerts',
    'Dutch housing',
  ],
  authors: [{ name: 'RentFusion' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rentfusion.nl',
    title: 'RentFusion - Find Your Dutch Rental in 15 Seconds',
    description:
      'AI-powered alerts for 1,500+ sources. Never miss a listing again. Trusted by 10,000+ renters.',
    siteName: 'RentFusion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentFusion - Find Your Dutch Rental Fast',
    description: 'AI-powered rental alerts. 15-second notifications. 1,500+ sources.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <LogoBar />
        <KeyBenefits />
        <InteractiveDemo />
        <UseCases />
        <SocialProof />
        <div id="features">
          <FeaturesGrid />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
