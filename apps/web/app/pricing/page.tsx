import { Navbar } from '@/components/landing/navbar';
import { PricingSection } from '@/components/landing/pricing-section';
import { FAQSection } from '@/components/landing/faq-section';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';
import { getTranslation } from '@/lib/translations';

export const metadata = {
  title: 'Pricing - Uprent Plus',
  description: 'Simple, transparent pricing for Uprent Plus. Choose the plan that works for you.',
};

export default function PricingPage() {
  const t = getTranslation('en');

  return (
    <div className="min-h-screen bg-black">
      <Navbar translations={t.footer} />
      <main>
        <PricingSection translations={t.pricing} />
        <FAQSection translations={t.faq} />
        <FinalCTA translations={t.finalCta} />
      </main>
      <Footer translations={t.footer} />
    </div>
  );
}
