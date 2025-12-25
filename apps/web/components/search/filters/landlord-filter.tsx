'use client';

import { cn } from '@/lib/utils/cn';

const LANDLORD_TYPES = [
  { id: 'private', label: 'Private landlord' },
  { id: 'agency', label: 'Agency' },
  { id: 'corporation', label: 'Corporation' },
];

interface LandlordFilterProps {
  types: string[];
  onTypesChange: (types: string[]) => void;
  registrationRequired?: boolean;
  onRegistrationRequiredChange?: (required: boolean) => void;
}

export function LandlordFilter({
  types,
  onTypesChange,
  registrationRequired,
  onRegistrationRequiredChange,
}: LandlordFilterProps) {
  const toggleType = (typeId: string) => {
    if (types.includes(typeId)) {
      onTypesChange(types.filter((t) => t !== typeId));
    } else {
      onTypesChange([...types, typeId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Landlord Types */}
      <div className="space-y-2">
        {LANDLORD_TYPES.map((type) => {
          const isSelected = types.includes(type.id);
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
                onChange={() => toggleType(type.id)}
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

      {/* Registration Required */}
      {onRegistrationRequiredChange && (
        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 cursor-pointer hover:border-white/20 transition-all">
          <input
            type="checkbox"
            checked={registrationRequired || false}
            onChange={(e) => onRegistrationRequiredChange(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 text-electric-blue"
          />
          <span className="text-body-sm font-medium text-white/70">
            Must allow registration with municipality
          </span>
        </label>
      )}
    </div>
  );
}

