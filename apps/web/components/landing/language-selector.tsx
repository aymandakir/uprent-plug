'use client';

import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (options: {
          pageLanguage: string;
          includedLanguages: string;
          layout: number;
        }) => void;
      };
    };
  }
}

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Determine current language from pathname
  const getCurrentLanguage = (): Language => {
    if (!pathname) return languages[0]!; // Default to English
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const excludedPaths = ['dashboard', 'register', 'login', 'pricing', 'api', 'matches', 'search'];
    
    // Check for zh-CN first (has hyphen)
    if (pathSegments[0] === 'zh-CN') {
      const lang = languages.find(l => l.code === 'zh-CN');
      if (lang) return lang;
    }
    
    // Check other languages
    const pathLang = pathSegments[0];
    if (pathLang && !excludedPaths.includes(pathLang)) {
      const lang = languages.find(l => l.code === pathLang);
      if (lang) return lang;
    }
    
    return languages[0]!; // Default to English
  };
  
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  
  // Update current language when pathname changes
  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, [pathname]);

  // Note: Google Translate is no longer needed since we have dedicated language pages

  const handleLanguageChange = (language: Language) => {
    setCurrentLang(language);
    setIsOpen(false);
    localStorage.setItem('selectedLanguage', language.code);

    // Navigate to language-specific route
    // Always navigate to root of language page (just /lang)
    if (language.code === 'en') {
      router.push('/');
    } else {
      router.push(`/${language.code}`);
    }
  };


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Globe className="h-4 w-4" />
        <span className="flex items-center gap-2">
          <span>{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 z-50 mb-2 max-h-96 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              <div className="p-2">
                <Link
                  href="/"
                  onClick={() => handleLanguageChange(languages[0]!)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    currentLang.code === 'en'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{languages[0]!.flag}</span>
                  <span>{languages[0]!.name}</span>
                </Link>
                {languages.slice(1).map((language) => (
                  <Link
                    key={language.code}
                    href={`/${language.code}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange(language);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      currentLang.code === language.code
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <span>{language.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

