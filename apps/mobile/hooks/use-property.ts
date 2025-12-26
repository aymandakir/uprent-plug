import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/types/property';

async function fetchProperty(id: string): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Property;
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}

export function useIsSaved(propertyId: string) {
  return useQuery({
    queryKey: ['saved', propertyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      return !!data;
    },
    enabled: !!propertyId,
  });
}

