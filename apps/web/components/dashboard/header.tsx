'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function DashboardHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className={`nav transition-all duration-200 ${isScrolled ? '' : 'border-b-0'}`}>
      <div className="mx-auto max-w-content px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-heading font-bold text-white">
            Uprent Plus
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-3 md:flex">
            <Link 
              href="/dashboard" 
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/search" 
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link 
              href="/dashboard/matches" 
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
            >
              Matches
            </Link>
            <Link 
              href="/dashboard/applications" 
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
            >
              Applications
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
            >
              Settings
            </Link>
            {userEmail && (
              <span className="text-sm font-sans font-medium text-white/60 px-3">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
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
            <Link
              href="/dashboard"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/search"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/dashboard/matches"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              href="/dashboard/applications"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Applications
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-3 text-white/80 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            {userEmail && (
              <div className="px-4 py-3 text-white/60 text-sm border-t border-white/10">
                {userEmail}
              </div>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

