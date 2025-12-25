'use client';

import Link from 'next/link';
import { LanguageSelector } from './language-selector';
import type { Translation } from '@/lib/translations/en';

interface FooterProps {
  translations?: Translation['footer'];
}

export function Footer({ translations }: FooterProps = {}) {
  const defaultT = {
    tagline: 'Enhanced features for Uprent - The AI rental search platform',
    attribution: 'Built for Uprent. Not officially affiliated with Uprent B.V.',
    links: {
      product: {
        title: 'Product',
        items: [
          { label: 'Uprent Platform', href: 'https://uprent.nl/en-nl' },
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '/pricing' },
        ],
      },
      company: {
        title: 'Company',
        items: [
          { label: 'About Uprent', href: 'https://uprent.nl/en-nl' },
          { label: 'Contact', href: 'https://uprent.nl/en-nl#contact' },
        ],
      },
      legal: {
        title: 'Legal',
        items: [
          { label: 'Privacy Policy', href: 'https://uprent.nl/en-nl/privacy' },
          { label: 'Terms of Service', href: 'https://uprent.nl/en-nl/terms' },
        ],
      },
    },
    copyright: '© 2025 Uprent Plus. All rights reserved.',
    disclaimer: 'This is a demonstration extension showcasing additional features for the Uprent platform.',
  };

  const t = translations || defaultT;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🏠 Uprent Plus
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              {t.tagline}
            </p>
          </div>

          {/* Links */}
          {Object.entries(t.links).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-gray-600">
              {t.copyright} {t.attribution}
            </p>
            <p className="text-xs text-gray-500">
              {t.disclaimer}
            </p>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
