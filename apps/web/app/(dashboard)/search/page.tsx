'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { FilterPanelComplete } from '@/components/search/filters/filter-panel-complete';
import { PropertyCard } from '@/components/search/property-card';
import { Grid, List, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { SearchFilters, SearchSort } from '@/types/search';
import type { Property } from '@/types';

type ViewMode = 'grid' | 'list' | 'map';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    cities: [],
    neighborhoods: [],
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
  });
  const [sort, setSort] = useState<SearchSort>({ field: 'relevance' });

  useEffect(() => {
    loadProperties();
  }, [filters, sort, query]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .limit(24);

      // Apply filters
      if (filters.cities && filters.cities.length > 0) {
        queryBuilder = queryBuilder.in('city', filters.cities);
      }

      if (filters.priceMin !== null) {
        queryBuilder = queryBuilder.gte('price_monthly', filters.priceMin);
      }

      if (filters.priceMax !== null) {
        queryBuilder = queryBuilder.lte('price_monthly', filters.priceMax);
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        queryBuilder = queryBuilder.in('property_type', filters.propertyTypes);
      }

      // Apply sort
      switch (sort.field) {
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
          break;
        case 'price_asc':
          queryBuilder = queryBuilder.order('price_monthly', { ascending: true });
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.order('price_monthly', { ascending: false });
          break;
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error('Failed to load properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save properties');
        return;
      }

      const { error } = await supabase
        .from('saved_properties')
        .upsert({
          user_id: user.id,
          property_id: propertyId,
        });

      if (error) throw error;
      toast.success('Property saved');
    } catch (error: any) {
      toast.error('Failed to save property');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Search Bar */}
      <div className="border-b border-white/10 bg-neutral-900 sticky top-16 z-40">
        <div className="mx-auto max-w-content px-6 py-6">
          <SearchBar
            onSearch={(q) => {
              setQuery(q);
              loadProperties();
            }}
            initialValue={query}
            size="large"
            className="mb-4"
          />

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'map' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sort.field}
                onChange={(e) => setSort({ field: e.target.value as SearchSort['field'] })}
                className="input"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="size_desc">Size: Largest first</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Filters Sidebar (Desktop) */}
        {showFilters && (
          <div className="hidden md:block">
            <FilterPanelComplete
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              variant="sidebar"
              resultCount={properties.length}
            />
          </div>
        )}

        {/* Filters Modal (Mobile) */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50">
            <FilterPanelComplete
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              variant="modal"
              resultCount={properties.length}
            />
          </div>
        )}

        {/* Results */}
        <main className="flex-1 px-6 py-8">
          {viewMode === 'map' ? (
            <div className="flex items-center justify-center h-[600px] rounded-lg border border-white/10 bg-white/5">
              <p className="text-white/60">Map view coming soon</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-body text-white/60">
                  Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </p>
              </div>

              {/* Properties Grid/List */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-[4/3] bg-white/10 rounded-lg mb-4" />
                      <div className="h-4 bg-white/10 rounded mb-2" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="mb-6 text-6xl">🔍</div>
                  <h3 className="text-h3 font-heading font-bold text-white mb-2">
                    No properties match your search
                  </h3>
                  <p className="text-body text-white/60 mb-6">
                    Try adjusting your filters or expanding your search area
                  </p>
                  <button
                    onClick={() => {
                      setFilters({});
                      setQuery('');
                    }}
                    className="btn-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }
                >
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant={viewMode}
                      onSave={handleSaveProperty}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
