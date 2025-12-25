'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const FEATURES = [
  { id: 'furnished', label: 'Furnished', icon: '🪑' },
  { id: 'pets_allowed', label: 'Pets allowed', icon: '🐕' },
  { id: 'smoking_allowed', label: 'Smoking allowed', icon: '🚬' },
  { id: 'balcony', label: 'Balcony', icon: '🌿' },
  { id: 'garden', label: 'Garden', icon: '🏡' },
  { id: 'parking', label: 'Parking', icon: '🚗' },
  { id: 'elevator', label: 'Elevator', icon: '🛗' },
  { id: 'accessible', label: 'Accessible', icon: '♿' },
];

interface FeaturesFilterProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

export function FeaturesFilter({ features, onFeaturesChange }: FeaturesFilterProps) {
  const toggleFeature = (featureId: string) => {
    if (features.includes(featureId)) {
      onFeaturesChange(features.filter((f) => f !== featureId));
    } else {
      onFeaturesChange([...features, featureId]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {FEATURES.map((feature) => {
        const isSelected = features.includes(feature.id);
        return (
          <button
            key={feature.id}
            type="button"
            onClick={() => toggleFeature(feature.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all',
              isSelected
                ? 'border-electric-blue bg-electric-blue/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
          >
            <span className="text-xl">{feature.icon}</span>
            <span className={cn(
              'text-body-sm font-medium flex-1',
              isSelected ? 'text-white' : 'text-white/70'
            )}>
              {feature.label}
            </span>
            {isSelected && <Check className="h-4 w-4 text-electric-blue" />}
          </button>
        );
      })}
    </div>
  );
}

