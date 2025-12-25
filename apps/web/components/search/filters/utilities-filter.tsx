'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const UTILITIES = [
  { id: 'utilities_included', label: 'Utilities included' },
  { id: 'internet_included', label: 'Internet included' },
];

const HEATING_TYPES = [
  'Any',
  'Central heating',
  'District heating',
  'Gas',
  'Electric',
  'Heat pump',
];

const ENERGY_LABELS = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

interface UtilitiesFilterProps {
  utilities: string[];
  onUtilitiesChange: (utilities: string[]) => void;
  heatingType?: string;
  onHeatingTypeChange?: (type: string) => void;
  energyLabels?: string[];
  onEnergyLabelsChange?: (labels: string[]) => void;
}

export function UtilitiesFilter({
  utilities,
  onUtilitiesChange,
  heatingType,
  onHeatingTypeChange,
  energyLabels,
  onEnergyLabelsChange,
}: UtilitiesFilterProps) {
  const toggleUtility = (utilityId: string) => {
    if (utilities.includes(utilityId)) {
      onUtilitiesChange(utilities.filter((u) => u !== utilityId));
    } else {
      onUtilitiesChange([...utilities, utilityId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Utilities Checkboxes */}
      <div className="space-y-2">
        {UTILITIES.map((utility) => {
          const isSelected = utilities.includes(utility.id);
          return (
            <label
              key={utility.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all',
                isSelected
                  ? 'border-electric-blue bg-electric-blue/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleUtility(utility.id)}
                className="h-4 w-4 rounded border-white/20 text-electric-blue focus:ring-electric-blue"
              />
              <span className={cn(
                'text-body-sm font-medium',
                isSelected ? 'text-white' : 'text-white/70'
              )}>
                {utility.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Heating Type */}
      {onHeatingTypeChange && (
        <div>
          <label className="text-body-sm font-medium text-white mb-2 block">
            Heating Type
          </label>
          <select
            value={heatingType || 'Any'}
            onChange={(e) => onHeatingTypeChange(e.target.value === 'Any' ? '' : e.target.value)}
            className="input w-full"
          >
            {HEATING_TYPES.map((type) => (
              <option key={type} value={type === 'Any' ? '' : type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Energy Labels */}
      {onEnergyLabelsChange && (
        <div>
          <label className="text-body-sm font-medium text-white mb-2 block">
            Energy Label
          </label>
          <div className="flex flex-wrap gap-2">
            {ENERGY_LABELS.map((label) => {
              const isSelected = energyLabels?.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const updated = energyLabels || [];
                    if (isSelected) {
                      onEnergyLabelsChange(updated.filter((l) => l !== label));
                    } else {
                      onEnergyLabelsChange([...updated, label]);
                    }
                  }}
                  className={cn(
                    'rounded-lg border-2 px-3 py-1.5 text-body-sm font-medium transition-all',
                    isSelected
                      ? 'border-electric-blue bg-electric-blue/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

