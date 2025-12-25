const fs = require('fs');
const path = require('path');

const langs = [
  { code: 'ar', locale: 'ar_SA' },
  { code: 'ru', locale: 'ru_RU' },
  { code: 'zh-CN', locale: 'zh_CN' },
  { code: 'ja', locale: 'ja_JP' },
  { code: 'de', locale: 'de_DE' },
  { code: 'it', locale: 'it_IT' },
  { code: 'es', locale: 'es_ES' },
  { code: 'pl', locale: 'pl_PL' },
  { code: 'fr', locale: 'fr_FR' },
  { code: 'pt', locale: 'pt_PT' },
  { code: 'ko', locale: 'ko_KR' },
  { code: 'tr', locale: 'tr_TR' },
  { code: 'vi', locale: 'vi_VN' },
  { code: 'th', locale: 'th_TH' },
  { code: 'id', locale: 'id_ID' },
  { code: 'hi', locale: 'hi_IN' },
  { code: 'sv', locale: 'sv_SE' },
  { code: 'no', locale: 'no_NO' },
  { code: 'da', locale: 'da_DK' },
  { code: 'fi', locale: 'fi_FI' },
  { code: 'cs', locale: 'cs_CZ' },
  { code: 'ro', locale: 'ro_RO' },
  { code: 'hu', locale: 'hu_HU' },
  { code: 'el', locale: 'el_GR' },
];

const template = `import type { Metadata } from 'next';
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
import { getLanguageMetadata } from '@/lib/lang-routes';

export const metadata: Metadata = (() => {
  const meta = getLanguageMetadata('LANG_CODE');
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['rental', 'housing', 'Netherlands', 'Amsterdam', 'Utrecht', 'Rotterdam', 'apartment finder', 'rental alerts', 'Dutch housing'],
    authors: [{ name: 'RentFusion' }],
    openGraph: {
      type: 'website',
      locale: meta.locale,
      url: 'https://rentfusion.nl/LANG_CODE',
      title: meta.title,
      description: meta.description,
      siteName: 'RentFusion',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
})();

export default function LanguageLandingPage() {
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
`;

langs.forEach(lang => {
  const dir = path.join(__dirname, '..', 'app', lang.code);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = template.replace(/LANG_CODE/g, lang.code);
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log(`Created: ${dir}/page.tsx`);
});

