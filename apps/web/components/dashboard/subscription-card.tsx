'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@rentfusion/database';
import { CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SubscriptionCard({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_ends_at')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to open billing portal');
    }
  };

  if (!user) return null;

  const tier = user.subscription_tier || 'free';
  const endsAt = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-brand-400" />
          <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
        </div>
        <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold capitalize">
          {tier}
        </span>
      </div>

      {endsAt && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Renews on {endsAt.toLocaleDateString()}</span>
        </div>
      )}

      {tier === 'free' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Limited to 1 search profile</p>
            <p>Upgrade to create more searches and get faster alerts</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tier !== 'free' && (
          <button
            onClick={handleManageSubscription}
            className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Manage Subscription
          </button>
        )}
        
        <button
          onClick={() => window.location.href = '/pricing'}
          className="w-full py-2 bg-brand-400 text-white rounded-lg font-medium hover:bg-brand-500 transition-colors"
        >
          {tier === 'free' ? 'Upgrade Now' : 'Change Plan'}
        </button>
      </div>
    </div>
  );
}

