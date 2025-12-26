import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { PropertyMatch } from '@/types/property';

export interface MatchFilters {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  neighborhood?: string;
  propertyType?: string;
  minMatchScore?: number;
}

export interface MatchSortOption {
  field: 'match_score' | 'matched_at' | 'price_monthly';
  order: 'asc' | 'desc';
}

async function fetchMatches(filters?: MatchFilters, sort?: MatchSortOption): Promise<PropertyMatch[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('property_matches')
    .select(`
      *,
      properties (
        id,
        title,
        address,
        city,
        neighborhood,
        price_monthly,
        bedrooms,
        bathrooms,
        size_sqm,
        property_type,
        images,
        photos,
        description,
        available_from,
        furnished,
        pets_allowed,
        balcony,
        elevator,
        parking,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'new');

  // Apply filters
  if (filters?.minPrice || filters?.maxPrice) {
    // Note: Filtering on related table requires different approach
    // This is a simplified version - in production, you'd filter properties first
  }

  if (filters?.minMatchScore) {
    query = query.gte('match_score', filters.minMatchScore);
  }

  // Apply sorting
  if (sort) {
    if (sort.field === 'price_monthly') {
      // Sorting by related table field - requires join or separate query
      // Simplified: sort by match_score for now
      query = query.order('match_score', { ascending: sort.order === 'asc' });
    } else {
      query = query.order(sort.field, { ascending: sort.order === 'asc' });
    }
  } else {
    // Default: highest match score first
    query = query.order('match_score', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;

  // Filter by price, city, property type in memory (for now)
  // In production, use a more efficient approach
  let filteredData = data || [];

  if (filters?.minPrice || filters?.maxPrice) {
    filteredData = filteredData.filter((match: any) => {
      const price = match.properties?.price_monthly;
      if (!price) return false;
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;
      return true;
    });
  }

  if (filters?.city) {
    filteredData = filteredData.filter((match: any) =>
      match.properties?.city?.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters?.propertyType) {
    filteredData = filteredData.filter((match: any) =>
      match.properties?.property_type === filters.propertyType
    );
  }

  return filteredData as PropertyMatch[];
}

export function useMatches(filters?: MatchFilters, sort?: MatchSortOption) {
  return useQuery({
    queryKey: ['matches', filters, sort],
    queryFn: () => fetchMatches(filters, sort),
    staleTime: 30000,
  });
}

export function useSaveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('saved_properties').insert({
        user_id: user.id,
        property_id: propertyId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });
}

export function useUnsaveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });
}
