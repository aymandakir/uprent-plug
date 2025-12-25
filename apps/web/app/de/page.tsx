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
import { getTranslation } from '@/lib/translations';

const t = getTranslation('de');

export const metadata: Metadata = {
  title: t.metadata.title,
  description: t.metadata.description,
  keywords: ['Miete', 'Wohnen', 'Niederlande', 'Amsterdam', 'Utrecht', 'Rotterdam'],
  authors: [{ name: 'Uprent Plus' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://uprent.nl/de',
    title: t.metadata.title,
    description: t.metadata.description,
    siteName: 'Uprent Plus',
  },
  twitter: {
    card: 'summary_large_image',
    title: t.metadata.title,
    description: t.metadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GermanLandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection translations={t.hero} />
        <LogoBar translations={t.logoBar} />
        <KeyBenefits translations={t.keyBenefits} />
        <InteractiveDemo translations={t.interactiveDemo} />
        <UseCases translations={t.useCases} />
        <SocialProof translations={t.socialProof} />
        <div id="features">
          <FeaturesGrid translations={t.features} />
        </div>
        <div id="pricing">
          <PricingSection translations={t.pricing} />
        </div>
        <div id="faq">
          <FAQSection translations={t.faq} />
        </div>
        <FinalCTA translations={t.finalCta} />
      </main>
      <Footer translations={t.footer} />
    </div>
  );
}
