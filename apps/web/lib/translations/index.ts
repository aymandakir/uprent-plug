import { en } from './en';
import { nl } from './nl';
import { de } from './de';
import { ar } from './ar';
import { ru } from './ru';
import { fr } from './fr';
import { es } from './es';
import { it } from './it';
import { pl } from './pl';
import { pt } from './pt';
import { ja } from './ja';
import { zh } from './zh-CN';
import { ko } from './ko';
import { sv } from './sv';
import type { Translation } from './en';

// Import all other translations as they're created
// For now, we'll use English as fallback for missing languages

export const translations: Record<string, Translation> = {
  en,
  nl,
  de,
  ar,
  ru,
  fr,
  es,
  it,
  pl,
  pt,
  ja,
  'zh-CN': zh,
  ko,
  sv,
  // Temporary: Use English for missing translations (will be replaced as files are created)
  tr: en,
  vi: en,
  th: en,
  id: en,
  hi: en,
  sv: en,
  no: en,
  da: en,
  fi: en,
  cs: en,
  ro: en,
  hu: en,
  el: en,
} as const;

export type LocaleCode = keyof typeof translations;

export function getTranslation(locale: string): Translation {
  const normalizedLocale = locale.toLowerCase().replace('_', '-');
  
  // Handle zh-CN special case
  if (normalizedLocale === 'zh' || normalizedLocale.startsWith('zh-')) {
    return translations['zh-CN'] || translations.en;
  }
  
  return translations[normalizedLocale as LocaleCode] || translations.en;
}

export function getSupportedLocales(): string[] {
  return Object.keys(translations);
}
