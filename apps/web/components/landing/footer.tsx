'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
  Contact: [
    { label: 'Email', href: 'mailto:hello@rentfusion.nl' },
    { label: 'Twitter', href: 'https://twitter.com/rentfusion' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/rentfusion' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🏠 RentFusion
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Find your Dutch rental faster with AI-powered alerts.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 font-semibold text-gray-900">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
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
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RentFusion. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <select className="border-0 bg-transparent text-sm text-gray-600 focus:outline-none">
              <option>English</option>
              <option>Nederlands</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
