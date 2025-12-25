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
    <nav className={`nav transition-all duration-200 ${isScrolled ? '' : 'border-b-0'}`}>
      <div className="mx-auto max-w-content px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-heading font-bold text-white">
            Uprent Plus
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-3 md:flex">
            <a href="#pricing" className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors">
              Pricing
            </a>
            <Link href="/login" className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn-primary h-10 px-6 text-sm flex items-center justify-center">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 py-4 md:hidden">
            <a
              href="#pricing"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="mx-4 mt-3 block btn-primary text-center"
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
