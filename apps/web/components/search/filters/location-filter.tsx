'use client';

import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { PropertyFilters } from '@/types';

const DUTCH_CITIES = [
  'Amsterdam',
  'Rotterdam',
  'The Hague',
  'Utrecht',
  'Eindhoven',
  'Groningen',
  'Tilburg',
  'Almere',
  'Breda',
  'Nijmegen',
  'Enschede',
  'Haarlem',
  'Arnhem',
  'Zaanstad',
  'Amersfoort',
  'Apeldoorn',
  'Hoofddorp',
  'Maastricht',
  'Leiden',
  'Dordrecht',
];

interface LocationFilterProps {
  filters: PropertyFilters;
  onFiltersChange: (updates: Partial<PropertyFilters>) => void;
}

export function LocationFilter({ filters, onFiltersChange }: LocationFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCities = filters.city || [];
  const selectedNeighborhoods = filters.neighborhood || [];

  const filteredCities = DUTCH_CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCityToggle = (city: string) => {
    const newCities = selectedCities.includes(city)
      ? selectedCities.filter((c) => c !== city)
      : [...selectedCities, city];
    onFiltersChange({ city: newCities.length > 0 ? newCities : undefined });
  };

  const handleNeighborhoodAdd = (neighborhood: string) => {
    if (neighborhood.trim() && !selectedNeighborhoods.includes(neighborhood.trim())) {
      onFiltersChange({
        neighborhood: [...selectedNeighborhoods, neighborhood.trim()],
      });
    }
  };

  const handleNeighborhoodRemove = (neighborhood: string) => {
    onFiltersChange({
      neighborhood: selectedNeighborhoods.filter((n) => n !== neighborhood),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cities..."
          className="input w-full"
        />
      </div>

      {/* Selected Cities Chips */}
      {selectedCities.length > 0 && (
        <div>
          <p className="text-caption text-white/60 uppercase tracking-wider mb-3">Selected Cities</p>
          <div className="flex flex-wrap gap-2">
            {selectedCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityToggle(city)}
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-body-sm text-white transition-colors hover:bg-red-500/20 hover:border-red-500"
              >
                <MapPin className="h-4 w-4" />
                {city}
                <X className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City List */}
      <div>
        <p className="text-caption text-white/60 uppercase tracking-wider mb-3">Cities</p>
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filteredCities.map((city) => {
            const isSelected = selectedCities.includes(city);
            return (
              <button
                key={city}
                onClick={() => handleCityToggle(city)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-body-sm transition-colors',
                  isSelected
                    ? 'bg-electric-blue/20 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded border-2 flex items-center justify-center',
                    isSelected
                      ? 'border-electric-blue bg-electric-blue'
                      : 'border-white/30'
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span>{city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Neighborhoods */}
      <div>
        <p className="text-caption text-white/60 uppercase tracking-wider mb-3">Neighborhoods</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedNeighborhoods.map((neighborhood) => (
            <button
              key={neighborhood}
              onClick={() => handleNeighborhoodRemove(neighborhood)}
              className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-body-sm text-white transition-colors hover:bg-red-500/20 hover:border-red-500"
            >
              {neighborhood}
              <X className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add neighborhood..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNeighborhoodAdd(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="input w-full"
        />
      </div>
    </div>
  );
}

