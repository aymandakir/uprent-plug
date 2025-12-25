'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            🏠 RentFusion
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white py-4 md:hidden">
            <a
              href="#pricing"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="mx-4 mt-2 block rounded-full bg-blue-600 px-6 py-2 text-center font-semibold text-white hover:bg-blue-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
