import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  activeSearches: number;
  newMatches: number;
  applications: number;
  savedProperties: number;
}

export interface ActivityItem {
  id: string;
  type: 'match' | 'saved' | 'application' | 'search';
  title: string;
  subtitle: string;
  timestamp: string;
  thumbnail?: string;
  propertyId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: ActivityItem[];
  userName?: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
}

async function fetchDashboardData(): Promise<DashboardData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, subscription_tier')
    .eq('id', user.id)
    .single();

  // Fetch stats in parallel
  const [searchesResult, matchesResult, applicationsResult, savedResult] = await Promise.all([
    supabase
      .from('search_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('property_matches')
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

  const stats: DashboardStats = {
    activeSearches: searchesResult.count || 0,
    newMatches: matchesResult.count || 0,
    applications: applicationsResult.count || 0,
    savedProperties: savedResult.count || 0,
  };

  // Fetch recent activities
  const { data: recentMatches } = await supabase
    .from('property_matches')
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
    .order('matched_at', { ascending: false })
    .limit(10);

  const activities: ActivityItem[] = (recentMatches || []).map((match: any) => ({
    id: match.id,
    type: 'match',
    title: `New match: ${match.properties?.title || 'Property'}`,
    subtitle: `${match.match_score}% match · €${match.properties?.price_monthly}/month`,
    timestamp: match.matched_at,
    thumbnail: match.properties?.images?.[0] || match.properties?.photos?.[0],
    propertyId: match.property_id,
  }));

  return {
    stats,
    activities,
    userName: profile?.full_name || undefined,
    subscriptionTier: (profile?.subscription_tier as 'free' | 'basic' | 'premium') || 'free',
  };
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

