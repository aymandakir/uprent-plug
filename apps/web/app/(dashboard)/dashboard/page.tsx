'use client';

import { useState, useEffect } from 'react';
import { Search, Star, FileText, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { PropertyCard } from '@/components/search/property-card';
import type { ActivityItem } from '@/components/dashboard/activity-feed';

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    activeSearches: 0,
    newMatches: 0,
    applications: 0,
    savedProperties: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<any[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user profile for subscription tier
      const { data: profile } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profile?.subscription_tier) {
        setSubscriptionTier(profile.subscription_tier as any);
      }

      // Load stats
      const [searchesResult, matchesResult, applicationsResult, savedResult] = await Promise.all([
        supabase
          .from('search_profiles')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true),
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'new'),
        supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('saved_properties')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      setStats({
        activeSearches: searchesResult.count || 0,
        newMatches: matchesResult.count || 0,
        applications: applicationsResult.count || 0,
        savedProperties: savedResult.count || 0,
      });

      // Load recent matches for activities
      const { data: recentMatches } = await supabase
        .from('matches')
        .select(`
          *,
          properties (
            id,
            title,
            price_monthly,
            city,
            neighborhood,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Transform matches to activities
      const matchActivities: ActivityItem[] = (recentMatches || []).map((match: any) => ({
        id: match.id,
        type: 'match',
        title: `New match: ${match.properties?.title || 'Property'}`,
        subtitle: `${match.match_score}% match · €${match.properties?.price_monthly}/month`,
        timestamp: match.created_at,
        thumbnail: match.properties?.images?.[0],
        actions: [
          { label: 'View', href: `/dashboard/search/${match.property_id}` },
          { label: 'Dismiss', onClick: () => {} },
        ],
      }));

      setActivities(matchActivities);

      // Load recommended properties
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      setRecommendedProperties(properties || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-32 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active searches"
            value={stats.activeSearches}
            icon={<Search className="h-6 w-6" />}
            subtext="2 new matches today"
            href="/dashboard/search"
          />
          <StatsCard
            title="New matches"
            value={stats.newMatches}
            icon={<Star className="h-6 w-6" />}
            subtext="Since your last visit"
            badge={stats.newMatches > 0 ? 'New' : undefined}
            trend={stats.newMatches > 0 ? { value: '+3 since yesterday', isPositive: true } : undefined}
            href="/dashboard/matches"
          />
          <StatsCard
            title="Applications"
            value={stats.applications}
            icon={<FileText className="h-6 w-6" />}
            subtext="2 pending responses"
            href="/dashboard/applications"
          />
          <StatsCard
            title="Saved properties"
            value={stats.savedProperties}
            icon={<Heart className="h-6 w-6" />}
            subtext="In 3 folders"
            href="/dashboard/saved"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Feed */}
            <ActivityFeed activities={activities} />

            {/* Recommended Properties */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-h2 font-heading font-bold text-white mb-1">
                    Recommended for you
                  </h2>
                  <p className="text-body text-white/60">
                    Based on your search history and preferences
                  </p>
                </div>
                <a
                  href="/dashboard/search?recommended=true"
                  className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                >
                  View all
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuickActions subscriptionTier={subscriptionTier} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
