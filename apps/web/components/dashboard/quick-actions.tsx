'use client';

import { Search, Sparkles, Settings, HelpCircle, CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/search-bar';
import { cn } from '@/lib/utils/cn';

interface QuickActionsProps {
  subscriptionTier?: 'free' | 'basic' | 'premium';
  className?: string;
}

export function QuickActions({ subscriptionTier = 'free', className }: QuickActionsProps) {
  const isPremium = subscriptionTier === 'premium';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Again */}
      <div className="card">
        <h3 className="text-h4 font-heading font-semibold text-white mb-4">Search Again</h3>
        <SearchBar
          placeholder="Search properties..."
          size="default"
          className="mb-4"
        />
        <Link href="/dashboard/search" className="btn-secondary w-full">
          Start new search
        </Link>
      </div>

      {/* AI Tools */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-electric-blue" />
          <h3 className="text-h4 font-heading font-semibold text-white">AI Tools</h3>
        </div>
        <div className="space-y-3">
          <Link href="/dashboard/applications/new" className="btn-secondary w-full flex items-center justify-center gap-2">
            Generate Application Letter
            <Sparkles className="h-4 w-4" />
          </Link>
          <Link
            href={isPremium ? '/dashboard/contracts/analyze' : '/pricing'}
            className={cn(
              'w-full rounded-lg border px-4 py-3 text-body font-medium transition-all flex items-center justify-center gap-2',
              isPremium
                ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                : 'border-white/20 bg-white/5 text-white/60 cursor-not-allowed'
            )}
          >
            Analyze Contract
            {!isPremium && <span className="text-caption text-electric-blue">Premium</span>}
          </Link>
        </div>
      </div>

      {/* Account */}
      <div className="card">
        <h3 className="text-h4 font-heading font-semibold text-white mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-white/60">Subscription</span>
            <span className={cn(
              'rounded-full px-2 py-1 text-caption font-medium capitalize',
              subscriptionTier === 'premium' ? 'bg-purple-500/20 text-purple-400' :
              subscriptionTier === 'basic' ? 'bg-electric-blue/20 text-electric-blue' :
              'bg-white/20 text-white/60'
            )}>
              {subscriptionTier}
            </span>
          </div>
          {!isPremium && (
            <Link href="/pricing" className="btn-primary w-full">
              Upgrade to Premium
            </Link>
          )}
          <div className="flex gap-2">
            <Link href="/dashboard/settings" className="btn-ghost flex-1 flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-white/60" />
          <h3 className="text-h4 font-heading font-semibold text-white">Help & Support</h3>
        </div>
        <div className="space-y-2">
          <Link href="/support" className="text-body text-white/70 hover:text-white transition-colors block">
            Contact Support
          </Link>
          <Link href="/help" className="text-body text-white/70 hover:text-white transition-colors block">
            Help Center
          </Link>
          <Link href="/support/report" className="text-body text-white/70 hover:text-white transition-colors block">
            Report Issue
          </Link>
        </div>
      </div>
    </div>
  );
}

