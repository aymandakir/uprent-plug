/**
 * Cached property data fetching with SWR
 */

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { PropertyFilters } from '@/types/search';

const fetcher = async ([url, filters]: [string, PropertyFilters]) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active');

  if (error) throw error;
  return data;
};

export function usePropertiesCached(filters: PropertyFilters) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/properties', filters],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
      refreshInterval: 60000, // Refresh every minute
      keepPreviousData: true,
    }
  );

  return {
    properties: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

/**
 * Cached fetch with TTL
 */
const cache = new Map<string, { data: any; timestamp: number }>();

export async function cachedFetch(url: string, ttl: number = 60000): Promise<any> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetch(url).then((r) => r.json());
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

