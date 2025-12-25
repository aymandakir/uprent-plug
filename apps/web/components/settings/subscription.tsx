'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Download, ExternalLink, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export function SubscriptionSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser(profile);
      // TODO: Load subscription details from Stripe
    } catch (error) {
      console.error('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error('Failed to open billing portal');
    }
  };

  const getPlanFeatures = (tier: string) => {
    switch (tier) {
      case 'premium':
        return [
          'Unlimited search profiles',
          'SMS + Push + Email alerts',
          'All filters + custom rules',
          'Unlimited AI letters',
          'Contract review',
          'Neighborhood insights',
          '24/7 priority support',
        ];
      case 'basic':
        return [
          '3 search profiles',
          'Instant push notifications',
          'Advanced filters',
          'AI letter generation (10/month)',
          'Priority support',
        ];
      default:
        return [
          '1 search profile',
          'Email alerts',
          'Basic filters',
          'Community support',
        ];
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  const currentTier = user?.subscription_tier || 'free';

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Subscription & Billing</h2>

      <div className="space-y-8">
        {/* Current Plan */}
        <section>
          <h3 className="text-h3 font-heading font-semibold text-white mb-4">Current Plan</h3>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-h3 font-heading font-bold text-white capitalize">{currentTier}</h4>
                  {currentTier !== 'free' && (
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-caption text-green-500">
                      Active
                    </span>
                  )}
                </div>
                {user?.subscription_end_date && (
                  <p className="text-body-sm text-white/60">
                    Renews {formatDate(user.subscription_end_date)}
                  </p>
                )}
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {getPlanFeatures(currentTier).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-body-sm text-white/80">
                  <Check className="h-4 w-4 text-electric-blue flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {currentTier === 'free' ? (
              <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2">
                Upgrade Plan
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={handleManageBilling}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                Manage Billing
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {/* Usage Stats */}
        <section className="border-t border-white/10 pt-8">
          <h3 className="text-h3 font-heading font-semibold text-white mb-4">Usage This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-body-sm text-white/60 mb-1">Search Profiles</p>
              <p className="text-h3 font-heading font-bold text-white">
                {user?.properties_viewed || 0}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-body-sm text-white/60 mb-1">AI Letters Generated</p>
              <p className="text-h3 font-heading font-bold text-white">
                {user?.applications_sent || 0}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-body-sm text-white/60 mb-1">Matches Found</p>
              <p className="text-h3 font-heading font-bold text-white">
                {user?.matches_found || 0}
              </p>
            </div>
          </div>
        </section>

        {/* Billing History */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3 font-heading font-semibold text-white">Billing History</h3>
            <button
              onClick={handleManageBilling}
              className="text-body-sm text-electric-blue hover:text-electric-blue/80"
            >
              View All
            </button>
          </div>
          {currentTier === 'free' ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <CreditCard className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-body text-white/60">No billing history for free plans</p>
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-body text-white/60">Billing history available in Stripe portal</p>
            </div>
          )}
        </section>

        {/* Payment Method */}
        {currentTier !== 'free' && (
          <section className="border-t border-white/10 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">Payment Method</h3>
                <p className="text-body-sm text-white/60 mt-1">Manage your payment details</p>
              </div>
              <button
                onClick={handleManageBilling}
                className="btn-secondary flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Update
              </button>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-body text-white/60">Manage payment method in billing portal</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

