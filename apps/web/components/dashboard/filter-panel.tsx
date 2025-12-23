"use client";

import { X } from "lucide-react";

interface Filters {
  cities: string[];
  priceRange: [number, number];
  bedrooms: number | null;
  furnished: boolean | null;
  petsAllowed: boolean | null;
  keywords: string[];
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose?: () => void;
}

const DUTCH_CITIES = [
  "Amsterdam",
  "Rotterdam",
  "Utrecht",
  "Den Haag",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen"
];

export function FilterPanel({ filters, onChange, onClose }: FilterPanelProps) {
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Cities</label>
        <div className="flex flex-wrap gap-2">
          {DUTCH_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => {
                const newCities = filters.cities.includes(city)
                  ? filters.cities.filter((c) => c !== city)
                  : [...filters.cities, city];
                updateFilter("cities", newCities);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                filters.cities.includes(city)
                  ? "bg-brand-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Price Range: €{filters.priceRange[0]} - €{filters.priceRange[1]}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={filters.priceRange[1]}
            value={filters.priceRange[0]}
            onChange={(e) =>
              updateFilter("priceRange", [Number(e.target.value), filters.priceRange[1]])
            }
            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
          <span>to</span>
          <input
            type="number"
            min={filters.priceRange[0]}
            max={5000}
            value={filters.priceRange[1]}
            onChange={(e) =>
              updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])
            }
            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => updateFilter("bedrooms", filters.bedrooms === num ? null : num)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                filters.bedrooms === num
                  ? "bg-brand-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Furnished only</span>
          <input
            type="checkbox"
            checked={filters.furnished ?? false}
            onChange={(e) => updateFilter("furnished", e.target.checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Pets allowed</span>
          <input
            type="checkbox"
            checked={filters.petsAllowed ?? false}
            onChange={(e) => updateFilter("petsAllowed", e.target.checked)}
          />
        </div>
      </div>

      <button
        onClick={() =>
          onChange({
            cities: [],
            priceRange: [500, 2500],
            bedrooms: null,
            furnished: null,
            petsAllowed: null,
            keywords: []
          })
        }
        className="w-full rounded-lg border border-gray-300 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );
}

