'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface SizeRoomsFilterProps {
  sizeMin?: number | null;
  sizeMax?: number | null;
  bedroomsMin?: number | null;
  bedroomsMax?: number | null;
  bathroomsMin?: number | null;
  onSizeChange: (min: number | null, max: number | null) => void;
  onBedroomsChange: (min: number | null, max: number | null) => void;
  onBathroomsChange: (min: number | null) => void;
}

export function SizeRoomsFilter({
  sizeMin,
  sizeMax,
  bedroomsMin,
  bedroomsMax,
  bathroomsMin,
  onSizeChange,
  onBedroomsChange,
  onBathroomsChange,
}: SizeRoomsFilterProps) {
  const [localSizeMin, setLocalSizeMin] = useState(sizeMin || 0);
  const [localSizeMax, setLocalSizeMax] = useState(sizeMax || 300);

  const handleBedroomClick = (value: number | 'studio' | '4+') => {
    if (value === 'studio') {
      onBedroomsChange(0, 0);
    } else if (value === '4+') {
      onBedroomsChange(4, null);
    } else {
      onBedroomsChange(value, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Range */}
      <div>
        <label className="text-body-sm font-medium text-white mb-3 block">
          Size (m²)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={localSizeMin}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setLocalSizeMin(val);
              onSizeChange(val, localSizeMax);
            }}
            min="0"
            max="300"
            step="10"
            className="input flex-1"
            placeholder="Min"
          />
          <span className="text-white/60">-</span>
          <input
            type="number"
            value={localSizeMax}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 300;
              setLocalSizeMax(val);
              onSizeChange(localSizeMin, val);
            }}
            min="0"
            max="300"
            step="10"
            className="input flex-1"
            placeholder="Max"
          />
          <span className="text-white/60 text-body-sm">m²</span>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-body-sm font-medium text-white mb-3 block">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Studio', value: 'studio' as const },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4+', value: '4+' as const },
          ].map((option) => {
            const isSelected =
              option.value === 'studio' && bedroomsMin === 0 && bedroomsMax === 0 ||
              option.value === '4+' && bedroomsMin === 4 && bedroomsMax === null ||
              option.value === bedroomsMin && option.value === bedroomsMax;
            
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleBedroomClick(option.value)}
                className={cn(
                  'rounded-lg border-2 px-4 py-2 text-body-sm font-medium transition-all',
                  isSelected
                    ? 'border-electric-blue bg-electric-blue/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="text-body-sm font-medium text-white mb-3 block">
          Bathrooms
        </label>
        <select
          value={bathroomsMin || ''}
          onChange={(e) => onBathroomsChange(e.target.value ? parseInt(e.target.value) : null)}
          className="input w-full"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>
    </div>
  );
}

