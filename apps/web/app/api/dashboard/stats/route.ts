import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stats in parallel
    const [searchesResult, matchesResult, savedResult, applicationsResult] = await Promise.all([
      supabase
        .from('search_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_active', true),
      supabase
        .from('property_matches')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('viewed', false),
      supabase
        .from('saved_properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    return NextResponse.json({
      activeSearches: searchesResult.count || 0,
      newMatches: matchesResult.count || 0,
      savedProperties: savedResult.count || 0,
      applications: applicationsResult.count || 0,
    });
  } catch (error) {
    console.error('Dashboard stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
