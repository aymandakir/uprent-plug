# Remaining Language Pages to Update

All language pages need to follow the pattern from nl/page.tsx and de/page.tsx.

Quick update script pattern for each remaining language:

```typescript
// app/[lang]/page.tsx template
import { getTranslation } from '@/lib/translations';
const t = getTranslation('[LANG]');

export const metadata = {
  title: t.metadata.title,
  description: t.metadata.description,
  openGraph: { locale: '[LOCALE]', ... },
};

export default function Page() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection translations={t.hero} />
        <LogoBar translations={t.logoBar} />
        <KeyBenefits translations={t.keyBenefits} />
        <InteractiveDemo translations={t.interactiveDemo} />
        <UseCases translations={t.useCases} />
        <SocialProof translations={t.socialProof} />
        <FeaturesGrid translations={t.features} />
        <PricingSection translations={t.pricing} />
        <FAQSection translations={t.faq} />
        <FinalCTA translations={t.finalCta} />
      </main>
      <Footer translations={t.footer} />
    </div>
  );
}
```

Remaining pages: ru, fr, es, it, pl, pt, ja, zh-CN, ko, sv, tr, vi, th, id, hi, no, da, fi, cs, ro, hu, el
