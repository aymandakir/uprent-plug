'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { FilterSection } from './filter-section';
import { LocationFilter } from './location-filter';
import { PriceRangeFilter } from './price-range';
import { PropertyTypeFilter } from './property-type';
import { SizeRoomsFilter } from './size-rooms-filter';
import { FeaturesFilter } from './features-filter';
import { UtilitiesFilter } from './utilities-filter';
import { AvailabilityFilter } from './availability-filter';
import { LandlordFilter } from './landlord-filter';
import type { SearchFilters } from '@/types/search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  variant?: 'sidebar' | 'modal';
  resultCount?: number;
}

export function FilterPanelComplete({
  filters,
  onFiltersChange,
  onClose,
  variant = 'sidebar',
  resultCount = 0,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearAll = () => {
    const emptyFilters: SearchFilters = {
      cities: [],
      neighborhoods: [],
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      sizeMin: null,
      sizeMax: null,
      bedroomsMin: null,
      bedroomsMax: null,
      bathroomsMin: null,
      features: [],
      utilities: [],
      availableFrom: null,
      contractTypes: [],
      landlordTypes: [],
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.values(localFilters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v !== null && v !== undefined) return true;
    return false;
  }).length;

  const isModal = variant === 'modal';
  const panelClasses = isModal
    ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm'
    : 'w-80 flex-shrink-0';

  return (
    <>
      {/* Modal Overlay */}
      {isModal && (
        <div className="fixed inset-0 z-40 bg-black/80" onClick={onClose} />
      )}

      {/* Panel */}
      <div className={panelClasses}>
        <div className={cn(
          'h-full bg-neutral-900 border-r border-white/10 flex flex-col',
          isModal && 'fixed right-0 top-0 w-full max-w-lg h-full shadow-2xl'
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="text-h3 font-heading font-bold text-white">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-electric-blue px-2 py-0.5 text-caption text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-body-sm text-white/60 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <FilterSection title="Location" badge={localFilters.cities?.length || undefined}>
              <LocationFilter
                filters={{
                  city: localFilters.cities || [],
                  neighborhood: localFilters.neighborhoods || [],
                } as any}
                onFiltersChange={(updates) => {
                  if (updates.city !== undefined) updateFilter('cities', updates.city);
                  if (updates.neighborhood !== undefined) updateFilter('neighborhoods', updates.neighborhood);
                }}
              />
            </FilterSection>

            <FilterSection title="Price Range">
              <PriceRangeFilter
                priceMin={localFilters.priceMin}
                priceMax={localFilters.priceMax}
                onPriceChange={(min, max) => {
                  updateFilter('priceMin', min);
                  updateFilter('priceMax', max);
                }}
              />
            </FilterSection>

            <FilterSection title="Property Type" badge={localFilters.propertyTypes?.length || undefined}>
              <PropertyTypeFilter
                types={localFilters.propertyTypes || []}
                onTypesChange={(types) => updateFilter('propertyTypes', types)}
              />
            </FilterSection>

            <FilterSection title="Size & Rooms">
              <SizeRoomsFilter
                sizeMin={localFilters.sizeMin}
                sizeMax={localFilters.sizeMax}
                bedroomsMin={localFilters.bedroomsMin}
                bedroomsMax={localFilters.bedroomsMax}
                bathroomsMin={localFilters.bathroomsMin}
                onSizeChange={(min, max) => {
                  updateFilter('sizeMin', min);
                  updateFilter('sizeMax', max);
                }}
                onBedroomsChange={(min, max) => {
                  updateFilter('bedroomsMin', min);
                  updateFilter('bedroomsMax', max);
                }}
                onBathroomsChange={(min) => updateFilter('bathroomsMin', min)}
              />
            </FilterSection>

            <FilterSection title="Features" badge={localFilters.features?.length || undefined}>
              <FeaturesFilter
                features={localFilters.features || []}
                onFeaturesChange={(features) => updateFilter('features', features)}
              />
            </FilterSection>

            <FilterSection title="Utilities">
              <UtilitiesFilter
                utilities={localFilters.utilities || []}
                onUtilitiesChange={(utilities) => updateFilter('utilities', utilities)}
                heatingType={localFilters.heatingType}
                onHeatingTypeChange={(type) => updateFilter('heatingType', type)}
                energyLabels={localFilters.energyLabels}
                onEnergyLabelsChange={(labels) => updateFilter('energyLabels', labels)}
              />
            </FilterSection>

            <FilterSection title="Availability">
              <AvailabilityFilter
                availableFrom={localFilters.availableFrom}
                contractTypes={localFilters.contractTypes || []}
                onAvailableFromChange={(date) => updateFilter('availableFrom', date)}
                onContractTypesChange={(types) => updateFilter('contractTypes', types)}
                maxContractDuration={localFilters.maxContractDuration}
                onMaxContractDurationChange={(duration) => updateFilter('maxContractDuration', duration)}
              />
            </FilterSection>

            <FilterSection title="Landlord" badge={localFilters.landlordTypes?.length || undefined}>
              <LandlordFilter
                types={localFilters.landlordTypes || []}
                onTypesChange={(types) => updateFilter('landlordTypes', types)}
                registrationRequired={localFilters.registrationRequired}
                onRegistrationRequiredChange={(required) => updateFilter('registrationRequired', required)}
              />
            </FilterSection>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-neutral-900 sticky bottom-0">
            <button
              onClick={onClose || (() => {})}
              className="btn-primary w-full"
            >
              Show {resultCount} {resultCount === 1 ? 'property' : 'properties'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import { cn } from '@/lib/utils/cn';

