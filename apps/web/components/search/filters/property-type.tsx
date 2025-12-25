'use client';

import { Home, Building2, DoorOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'house', label: 'House', icon: Home },
  { id: 'studio', label: 'Studio', icon: DoorOpen },
  { id: 'room', label: 'Room', icon: Users },
];

interface PropertyTypeFilterProps {
  types: string[];
  onTypesChange: (types: string[]) => void;
}

export function PropertyTypeFilter({ types, onTypesChange }: PropertyTypeFilterProps) {
  const handleToggle = (typeId: string) => {
    const newTypes = types.includes(typeId)
      ? types.filter((t) => t !== typeId)
      : [...types, typeId];
    onTypesChange(newTypes);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-3">
        {PROPERTY_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = types.includes(type.id);
          
          return (
            <button
              key={type.id}
              onClick={() => handleToggle(type.id)}
              className={cn(
                'group flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all',
                isSelected
                  ? 'border-electric-blue bg-electric-blue/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isSelected ? 'text-electric-blue' : 'text-white/60 group-hover:text-white'
                )}
              />
              <span
                className={cn(
                  'text-body-sm font-medium',
                  isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                )}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

