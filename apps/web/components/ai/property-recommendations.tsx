'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/search/property-card';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface PropertyRecommendationsProps {
  userId?: string;
  limit?: number;
  className?: string;
}

export function PropertyRecommendations({ userId, limit = 6, className }: PropertyRecommendationsProps) {
  const supabase = createClient();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasoning, setReasoning] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's search profiles and preferences
      const { data: searchProfiles } = await supabase
        .from('search_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!searchProfiles || searchProfiles.length === 0) {
        // Fallback: Show recent properties
        const { data: recent } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(limit);

        setProperties(recent || []);
        setLoading(false);
        return;
      }

      // Build recommendation query based on search profiles
      const cities = searchProfiles.flatMap((p) => p.cities || []);
      const priceMin = Math.min(...searchProfiles.map((p) => p.min_price || 0));
      const priceMax = Math.max(...searchProfiles.map((p) => p.max_price || 5000));

      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .gte('price_monthly', priceMin)
        .lte('price_monthly', priceMax)
        .limit(limit);

      if (cities.length > 0) {
        query = query.in('city', cities);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Generate reasoning for each property
      const reasoningMap: Record<string, string> = {};
      data?.forEach((property) => {
        const reasons: string[] = [];
        if (cities.includes(property.city)) {
          reasons.push(`In your preferred city (${property.city})`);
        }
        if (property.price_monthly >= priceMin && property.price_monthly <= priceMax) {
          reasons.push('Matches your budget');
        }
        if (property.bedrooms && searchProfiles.some((p) => property.bedrooms >= (p.min_bedrooms || 0))) {
          reasons.push('Right number of bedrooms');
        }
        reasoningMap[property.id] = reasons.join(' • ') || 'Recommended for you';
      });

      setProperties(data || []);
      setReasoning(reasoningMap);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-heading font-bold text-white mb-1">Recommended for you</h2>
            <p className="text-body text-white/60">Based on your search history and preferences</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-white/10 rounded-lg mb-4" />
              <div className="h-4 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-electric-blue" />
            <h2 className="text-h2 font-heading font-bold text-white">Recommended for you</h2>
          </div>
          <p className="text-body text-white/60">Based on your search history and preferences</p>
        </div>
        <Link
          href="/dashboard/search?recommended=true"
          className="text-body-sm text-electric-blue hover:text-electric-blue/80 flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="relative group">
            <PropertyCard property={property} variant="grid" />
            {reasoning[property.id] && (
              <div className="absolute bottom-16 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 text-body-sm text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3 w-3 text-electric-blue" />
                    <span className="font-medium">Why recommended:</span>
                  </div>
                  <p className="text-white/80">{reasoning[property.id]}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

