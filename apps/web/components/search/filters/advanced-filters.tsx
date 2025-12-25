'use client';

import { useState } from 'react';
import { Calendar, Square, Bed, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { PropertyFilters } from '@/types';

interface AdvancedFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (updates: Partial<PropertyFilters>) => void;
}

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const handleToggle = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({ [key]: filters[key] === value ? undefined : value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Bedrooms */}
      <div>
        <label className="text-caption text-white/60 uppercase tracking-wider mb-3 block">
          Bedrooms
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={filters.bedrooms_min || ''}
              onChange={(e) =>
                onFiltersChange({
                  bedrooms_min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
              className="input w-full"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={filters.bedrooms_max || ''}
              onChange={(e) =>
                onFiltersChange({
                  bedrooms_max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
              className="input w-full"
            />
          </div>
        </div>
      </div>

      {/* Size (sqm) */}
      <div>
        <label className="text-caption text-white/60 uppercase tracking-wider mb-3 block">
          Size (m²)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={filters.size_sqm_min || ''}
              onChange={(e) =>
                onFiltersChange({
                  size_sqm_min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
              className="input w-full"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={filters.size_sqm_max || ''}
              onChange={(e) =>
                onFiltersChange({
                  size_sqm_max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
              className="input w-full"
            />
          </div>
        </div>
      </div>

      {/* Furnished */}
      <div>
        <label className="text-caption text-white/60 uppercase tracking-wider mb-3 block">
          Furnished
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: 'Furnished' },
            { value: false, label: 'Unfurnished' },
          ].map((option) => {
            const isSelected = filters.furnished === option.value;
            return (
              <button
                key={String(option.value)}
                onClick={() => handleToggle('furnished', option.value)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all',
                  isSelected
                    ? 'border-electric-blue bg-electric-blue/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Available From */}
      <div>
        <label className="text-caption text-white/60 uppercase tracking-wider mb-3 block">
          Available From
        </label>
        <input
          type="date"
          value={filters.available_from || ''}
          onChange={(e) =>
            onFiltersChange({ available_from: e.target.value || undefined })
          }
          min={new Date().toISOString().split('T')[0]}
          className="input w-full"
        />
      </div>

      {/* Features */}
      <div>
        <label className="text-caption text-white/60 uppercase tracking-wider mb-3 block">
          Features
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Balcony',
            'Garden',
            'Parking',
            'Elevator',
            'Pets Allowed',
            'Washing Machine',
            'Dishwasher',
            'Air Conditioning',
          ].map((feature) => {
            const isSelected = filters.features?.includes(feature);
            return (
              <button
                key={feature}
                onClick={() => {
                  const currentFeatures = filters.features || [];
                  const newFeatures = isSelected
                    ? currentFeatures.filter((f) => f !== feature)
                    : [...currentFeatures, feature];
                  onFiltersChange({ features: newFeatures.length > 0 ? newFeatures : undefined });
                }}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-body-sm transition-all',
                  isSelected
                    ? 'border-electric-blue bg-electric-blue/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                )}
              >
                {feature}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

