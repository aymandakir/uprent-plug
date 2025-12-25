'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

const CONTRACT_TYPES = [
  { id: 'indefinite', label: 'Indefinite' },
  { id: 'temporary', label: 'Temporary' },
  { id: 'short_term', label: 'Short-term (< 6 months)' },
];

interface AvailabilityFilterProps {
  availableFrom?: string | null;
  contractTypes?: string[];
  onAvailableFromChange: (date: string | null) => void;
  onContractTypesChange: (types: string[]) => void;
  maxContractDuration?: number | null;
  onMaxContractDurationChange?: (duration: number | null) => void;
}

export function AvailabilityFilter({
  availableFrom,
  contractTypes = [],
  onAvailableFromChange,
  onContractTypesChange,
  maxContractDuration,
  onMaxContractDurationChange,
}: AvailabilityFilterProps) {
  const [isFlexible, setIsFlexible] = useState(!availableFrom);

  const toggleContractType = (typeId: string) => {
    if (contractTypes.includes(typeId)) {
      onContractTypesChange(contractTypes.filter((t) => t !== typeId));
    } else {
      onContractTypesChange([...contractTypes, typeId]);
    }
  };

  const handleFlexibleToggle = (checked: boolean) => {
    setIsFlexible(checked);
    if (checked) {
      onAvailableFromChange(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Available From */}
      <div>
        <label className="text-body-sm font-medium text-white mb-3 block">
          Available From
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isFlexible}
              onChange={(e) => handleFlexibleToggle(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 text-electric-blue"
            />
            <span className="text-body-sm text-white/70">Flexible</span>
          </label>
          {!isFlexible && (
            <input
              type="date"
              value={availableFrom || ''}
              onChange={(e) => onAvailableFromChange(e.target.value || null)}
              min={new Date().toISOString().split('T')[0]}
              className="input w-full"
            />
          )}
        </div>
      </div>

      {/* Contract Types */}
      <div>
        <label className="text-body-sm font-medium text-white mb-3 block">
          Contract Type
        </label>
        <div className="space-y-2">
          {CONTRACT_TYPES.map((type) => {
            const isSelected = contractTypes.includes(type.id);
            return (
              <label
                key={type.id}
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
                  onChange={() => toggleContractType(type.id)}
                  className="h-4 w-4 rounded border-white/20 text-electric-blue"
                />
                <span className={cn(
                  'text-body-sm font-medium',
                  isSelected ? 'text-white' : 'text-white/70'
                )}>
                  {type.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Contract Duration (conditional) */}
      {contractTypes.includes('temporary') && onMaxContractDurationChange && (
        <div>
          <label className="text-body-sm font-medium text-white mb-2 block">
            Maximum Contract Duration (months)
          </label>
          <input
            type="number"
            value={maxContractDuration || ''}
            onChange={(e) => onMaxContractDurationChange(e.target.value ? parseInt(e.target.value) : null)}
            min="1"
            max="60"
            className="input w-full"
            placeholder="e.g., 12"
          />
        </div>
      )}
    </div>
  );
}

