'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { PropertyMatch } from '@/types';

export function useMatches() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('property_matches')
        .select(`
          *,
          property:properties(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((match: any) => ({
        property_id: match.property_id,
        search_profile_id: match.search_profile_id,
        match_score: match.match_score,
        match_reasons: match.match_reasons || [],
        created_at: match.created_at,
        property: match.property,
      })) as PropertyMatch[];
    },
  });
}

