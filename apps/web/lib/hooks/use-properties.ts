'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Property, PropertyFilters } from '@/types';

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const supabase = createClient();
      
      let query = supabase
        .from('properties')
        .select('*')
        .order('scraped_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (filters?.city && filters.city.length > 0) {
        query = query.in('location->>city', filters.city);
      }

      if (filters?.price_min) {
        query = query.gte('price', filters.price_min);
      }

      if (filters?.price_max) {
        query = query.lte('price', filters.price_max);
      }

      if (filters?.property_type && filters.property_type.length > 0) {
        query = query.in('property_type', filters.property_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as any[]) || [];
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });
}

export function useSaveProperty() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

