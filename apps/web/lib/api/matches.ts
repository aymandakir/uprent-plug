import { createClient } from '@/lib/supabase/server';
import type { PropertyMatch } from '@/types';

export async function getMatches(userId: string): Promise<PropertyMatch[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('property_matches')
    .select(`
      *,
      property:properties(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch matches: ${error.message}`);
  }

  return (data || []).map((match: any) => ({
    property_id: match.property_id,
    search_profile_id: match.search_profile_id,
    match_score: match.match_score,
    match_reasons: match.match_reasons || [],
    created_at: match.created_at,
    property: match.property,
  }));
}

export async function getMatchById(userId: string, matchId: string): Promise<PropertyMatch | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('property_matches')
    .select(`
      *,
      property:properties(*)
    `)
    .eq('id', matchId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch match: ${error.message}`);
  }

  return {
    property_id: data.property_id,
    search_profile_id: data.search_profile_id,
    match_score: data.match_score,
    match_reasons: data.match_reasons || [],
    created_at: data.created_at,
    property: data.property,
  };
}

