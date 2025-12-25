'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { PriceRangeFilter } from './price-range';
import { LocationFilter } from './location-filter';
import { PropertyTypeFilter } from './property-type';
import { AdvancedFilters } from './advanced-filters';
import { cn } from '@/lib/utils/cn';
import type { PropertyFilters } from '@/types';

interface FilterPanelProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearAll: () => void;
  className?: string;
  variant?: 'sidebar' | 'modal';
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onClearAll,
  className,
  variant = 'sidebar',
}: FilterPanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.search_query || '');

  const activeFilterCount = getActiveFilterCount(filters);

  const updateFilters = (updates: Partial<PropertyFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ search_query: query || undefined });
  };

  const sections = [
    {
      id: 'search',
      title: 'Search',
      icon: Search,
      component: (
        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search properties..."
            className="input w-full"
          />
        </div>
      ),
    },
    {
      id: 'location',
      title: 'Location',
      component: (
        <LocationFilter
          filters={filters}
          onFiltersChange={updateFilters}
        />
      ),
    },
    {
      id: 'price',
      title: 'Price Range',
      component: (
        <PriceRangeFilter
          priceMin={filters.price_min}
          priceMax={filters.price_max}
          onPriceChange={(min, max) => {
            updateFilters({ price_min: min, price_max: max });
          }}
        />
      ),
    },
    {
      id: 'type',
      title: 'Property Type',
      component: (
        <PropertyTypeFilter
          types={filters.property_type || []}
          onTypesChange={(types) => updateFilters({ property_type: types })}
        />
      ),
    },
    {
      id: 'advanced',
      title: 'Advanced Filters',
      icon: SlidersHorizontal,
      component: (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={updateFilters}
        />
      ),
    },
  ];

  if (variant === 'modal') {
    return (
      <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm', className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
        >
          <div className="flex h-full max-h-[90vh] flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-white" />
                <h2 className="text-h3 font-heading font-semibold text-white">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-electric-blue px-2.5 py-0.5 text-caption font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClearAll}
                className="text-body-sm text-white/60 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {sections.map((section) => {
                  const isOpen = activeSection === section.id;
                  const Icon = section.icon || ChevronDown;
                  
                  return (
                    <div
                      key={section.id}
                      className="overflow-hidden rounded-lg border border-white/10 bg-neutral-800"
                    >
                      <button
                        onClick={() => setActiveSection(isOpen ? null : section.id)}
                        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="text-body font-medium text-white">{section.title}</span>
                        <Icon
                          className={cn(
                            'h-5 w-5 text-white/60 transition-transform',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {section.component}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6">
              <div className="flex gap-3">
                <button
                  onClick={onClearAll}
                  className="btn-secondary flex-1"
                >
                  Clear All
                </button>
                <button className="btn-primary flex-1">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className={cn('flex h-full flex-col border-r border-white/10 bg-neutral-900', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-white" />
          <h2 className="text-h3 font-heading font-semibold text-white">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-electric-blue px-2.5 py-0.5 text-caption font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = activeSection === section.id || !activeSection;
            const Icon = section.icon || ChevronDown;
            
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-lg border border-white/10 bg-neutral-800"
              >
                <button
                  onClick={() => setActiveSection(isOpen ? null : section.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-body font-medium text-white">{section.title}</span>
                  <Icon
                    className={cn(
                      'h-5 w-5 text-white/60 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {section.component}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-6">
        <button
          onClick={onClearAll}
          className="btn-secondary w-full"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

function getActiveFilterCount(filters: PropertyFilters): number {
  let count = 0;
  if (filters.search_query) count++;
  if (filters.city && filters.city.length > 0) count++;
  if (filters.neighborhood && filters.neighborhood.length > 0) count++;
  if (filters.price_min || filters.price_max) count++;
  if (filters.property_type && filters.property_type.length > 0) count++;
  if (filters.bedrooms_min || filters.bedrooms_max) count++;
  if (filters.size_sqm_min || filters.size_sqm_max) count++;
  if (filters.furnished !== undefined && filters.furnished !== null) count++;
  if (filters.available_from) count++;
  if (filters.features && filters.features.length > 0) count++;
  return count;
}

