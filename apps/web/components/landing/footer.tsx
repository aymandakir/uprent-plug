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
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Logo */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-heading font-bold text-white">
              Uprent Plus
            </Link>
            <p className="mt-4 text-body-sm text-white/60">
              {t.tagline}
            </p>
          </div>

          {/* Links */}
          {Object.entries(t.links).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 text-body-sm font-medium text-white uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((link: { label: string; href: string }) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-white/60 hover:text-white transition-colors"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-body-sm text-white/60">
              {t.copyright} {t.attribution}
            </p>
            <p className="text-caption text-white/50">
              {t.disclaimer}
            </p>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
