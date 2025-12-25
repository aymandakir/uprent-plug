'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';

interface PriceRangeFilterProps {
  priceMin?: number | null;
  priceMax?: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  min?: number;
  max?: number;
}

export function PriceRangeFilter({
  priceMin,
  priceMax,
  onPriceChange,
  min = 0,
  max = 5000,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState<number>(priceMin || min);
  const [localMax, setLocalMax] = useState<number>(priceMax || max);

  useEffect(() => {
    setLocalMin(priceMin ?? min);
    setLocalMax(priceMax ?? max);
  }, [priceMin, priceMax, min, max]);

  const handleMinChange = (value: number) => {
    const newMin = Math.max(min, Math.min(value, localMax));
    setLocalMin(newMin);
    onPriceChange(newMin === min ? null : newMin, priceMax);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(localMin, Math.min(value, max));
    setLocalMax(newMax);
    onPriceChange(priceMin, newMax === max ? null : newMax);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Range Display */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-caption text-white/60 uppercase tracking-wider mb-1">Min Price</p>
          <p className="text-h4 font-heading font-bold text-white">
            {formatCurrency(localMin, 'EUR')}
          </p>
        </div>
        <div className="text-white/40">—</div>
        <div className="text-center">
          <p className="text-caption text-white/60 uppercase tracking-wider mb-1">Max Price</p>
          <p className="text-h4 font-heading font-bold text-white">
            {formatCurrency(localMax, 'EUR')}
          </p>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative h-2">
        <div className="absolute h-2 w-full rounded-full bg-white/10" />
        <div
          className="absolute h-2 rounded-full bg-electric-blue"
          style={{
            left: `${((localMin - min) / (max - min)) * 100}%`,
            width: `${((localMax - localMin) / (max - min)) * 100}%`,
          }}
        />
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-caption text-white/60 uppercase tracking-wider mb-2 block">
            Minimum
          </label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            min={min}
            max={localMax}
            step="50"
            className="input w-full"
          />
        </div>
        <div>
          <label className="text-caption text-white/60 uppercase tracking-wider mb-2 block">
            Maximum
          </label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            min={localMin}
            max={max}
            step="50"
            className="input w-full"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Under €1,000', min: min, max: 1000 },
          { label: '€1,000 - €2,000', min: 1000, max: 2000 },
          { label: '€2,000 - €3,000', min: 2000, max: 3000 },
          { label: 'Over €3,000', min: 3000, max: max },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLocalMin(preset.min);
              setLocalMax(preset.max);
              onPriceChange(preset.min === min ? null : preset.min, preset.max === max ? null : preset.max);
            }}
            className={cn(
              'rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-body-sm text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white',
              localMin === preset.min && localMax === preset.max && 'border-electric-blue bg-electric-blue/20 text-white'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

