'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SearchProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    cities: [] as string[],
    budget_min: '',
    budget_max: '',
    bedrooms_min: '',
    bedrooms_max: '',
    furnished: undefined as boolean | undefined,
    keywords: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('search_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile({
        cities: data.cities || [],
        budget_min: data.budget_min || '',
        budget_max: data.budget_max || '',
        bedrooms_min: data.bedrooms_min || '',
        bedrooms_max: data.bedrooms_max || '',
        furnished: data.furnished,
        keywords: data.keywords || [],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('search_profiles')
      .upsert({
        user_id: user.id,
        cities: profile.cities,
        budget_min: profile.budget_min ? parseInt(profile.budget_min) : null,
        budget_max: profile.budget_max ? parseInt(profile.budget_max) : null,
        bedrooms_min: profile.bedrooms_min ? parseInt(profile.bedrooms_min) : null,
        bedrooms_max: profile.bedrooms_max ? parseInt(profile.bedrooms_max) : null,
        furnished: profile.furnished,
        keywords: profile.keywords,
        is_active: true,
      });

    setLoading(false);

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      alert('Search profile saved!');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Search Criteria</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cities */}
        <div>
          <label className="block text-sm font-medium mb-2">Cities</label>
          <input
            type="text"
            placeholder="amsterdam, rotterdam, utrecht"
            value={profile.cities.join(', ')}
            onChange={(e) => setProfile({ ...profile, cities: e.target.value.split(',').map(c => c.trim()) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Budget (€)</label>
            <input
              type="number"
              value={profile.budget_min}
              onChange={(e) => setProfile({ ...profile, budget_min: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Budget (€)</label>
            <input
              type="number"
              value={profile.budget_max}
              onChange={(e) => setProfile({ ...profile, budget_max: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Bedrooms</label>
            <input
              type="number"
              value={profile.bedrooms_min}
              onChange={(e) => setProfile({ ...profile, bedrooms_min: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Bedrooms</label>
            <input
              type="number"
              value={profile.bedrooms_max}
              onChange={(e) => setProfile({ ...profile, bedrooms_max: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Furnished */}
        <div>
          <label className="block text-sm font-medium mb-2">Furnished</label>
          <select
            value={profile.furnished === undefined ? '' : profile.furnished.toString()}
            onChange={(e) => setProfile({ ...profile, furnished: e.target.value === '' ? undefined : e.target.value === 'true' })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">No preference</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
          <input
            type="text"
            placeholder="balcony, parking, pets allowed"
            value={profile.keywords.join(', ')}
            onChange={(e) => setProfile({ ...profile, keywords: e.target.value.split(',').map(k => k.trim()) })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Search Criteria'}
        </button>
      </form>
    </div>
  );
}