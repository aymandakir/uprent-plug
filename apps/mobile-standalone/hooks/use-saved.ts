import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { SavedProperty } from '@/types/property';

async function fetchSavedProperties(): Promise<SavedProperty[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_properties')
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
        created_at,
        updated_at
      )
    `)
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return (data || []) as SavedProperty[];
}

export function useSavedProperties() {
  return useQuery({
    queryKey: ['saved'],
    queryFn: fetchSavedProperties,
    staleTime: 30000,
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
      queryClient.invalidateQueries({ queryKey: ['saved'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

