'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface SearchProfileSetupProps {
  onNext: () => void;
  onBack: () => void;
}

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
];

export function SearchProfileSetup({ onNext, onBack }: SearchProfileSetupProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [searchProfile, setSearchProfile] = useState({
    name: 'My First Search',
    cities: [] as string[],
    priceMin: 1000,
    priceMax: 2500,
    bedroomsMin: 1,
    bedroomsMax: null as number | null,
    propertyTypes: [] as string[],
    availableFrom: '',
  });

  const handleCityToggle = (city: string) => {
    setSearchProfile({
      ...searchProfile,
      cities: searchProfile.cities.includes(city)
        ? searchProfile.cities.filter((c) => c !== city)
        : [...searchProfile.cities, city],
    });
  };

  const handlePropertyTypeToggle = (type: string) => {
    setSearchProfile({
      ...searchProfile,
      propertyTypes: searchProfile.propertyTypes.includes(type)
        ? searchProfile.propertyTypes.filter((t) => t !== type)
        : [...searchProfile.propertyTypes, type],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (searchProfile.cities.length === 0) {
      toast.error('Please select at least one city');
      setLoading(false);
      return;
    }

    if (searchProfile.propertyTypes.length === 0) {
      toast.error('Please select at least one property type');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('search_profiles')
        .insert({
          user_id: user.id,
          name: searchProfile.name,
          cities: searchProfile.cities,
          property_types: searchProfile.propertyTypes,
          min_price: searchProfile.priceMin,
          max_price: searchProfile.priceMax,
          min_bedrooms: searchProfile.bedroomsMin,
          max_bedrooms: searchProfile.bedroomsMax,
          available_from: searchProfile.availableFrom || null,
          is_active: true,
        });

      if (error) {
        toast.error('Failed to create search profile');
        setLoading(false);
        return;
      }

      onNext();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-narrow">
      <div className="mb-8 text-center">
        <h2 className="text-h2 font-heading font-bold text-white">Let's find your perfect home</h2>
        <p className="mt-2 text-body text-white/70">
          Create your first search profile to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cities */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Cities <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DUTCH_CITIES.map((city) => {
              const isSelected = searchProfile.cities.includes(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityToggle(city)}
                  className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                    isSelected
                      ? 'border-electric-blue bg-electric-blue/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-body-sm font-medium">{city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Price Range <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={searchProfile.priceMin}
                onChange={(e) => setSearchProfile({ ...searchProfile, priceMin: parseInt(e.target.value) || 0 })}
                min="0"
                step="50"
                className="input w-full"
                placeholder="Min"
              />
            </div>
            <div>
              <input
                type="number"
                value={searchProfile.priceMax}
                onChange={(e) => setSearchProfile({ ...searchProfile, priceMax: parseInt(e.target.value) || 0 })}
                min="0"
                step="50"
                className="input w-full"
                placeholder="Max"
              />
            </div>
          </div>
          <p className="mt-2 text-body-sm text-white/60">
            €{searchProfile.priceMin.toLocaleString()} - €{searchProfile.priceMax.toLocaleString()} per month
          </p>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Number of Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            {['Studio', '1', '2', '3', '4+'].map((bedrooms) => {
              const value = bedrooms === 'Studio' ? 0 : bedrooms === '4+' ? 4 : parseInt(bedrooms);
              const isSelected = searchProfile.bedroomsMin === value;
              return (
                <button
                  key={bedrooms}
                  type="button"
                  onClick={() => {
                    setSearchProfile({
                      ...searchProfile,
                      bedroomsMin: value,
                      bedroomsMax: bedrooms === '4+' ? null : value,
                    });
                  }}
                  className={`rounded-lg border-2 px-4 py-2 text-body font-medium transition-all ${
                    isSelected
                      ? 'border-electric-blue bg-electric-blue/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {bedrooms === 'Studio' ? 'Studio' : bedrooms === '4+' ? '4+' : `${bedrooms} Bedroom${bedrooms !== '1' ? 's' : ''}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Property Type <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'apartment', label: 'Apartment' },
              { id: 'house', label: 'House' },
              { id: 'studio', label: 'Studio' },
              { id: 'room', label: 'Room' },
            ].map((type) => {
              const isSelected = searchProfile.propertyTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handlePropertyTypeToggle(type.id)}
                  className={`rounded-lg border-2 p-4 text-body font-medium transition-all ${
                    isSelected
                      ? 'border-electric-blue bg-electric-blue/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available From */}
        <div>
          <label htmlFor="availableFrom" className="text-body-sm font-medium text-white mb-2 block">
            Move-in Date (Optional)
          </label>
          <input
            id="availableFrom"
            type="date"
            value={searchProfile.availableFrom}
            onChange={(e) => setSearchProfile({ ...searchProfile, availableFrom: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="input w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

