'use client';

import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

export function SearchPreferencesSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchProfiles, setSearchProfiles] = useState<any[]>([]);
  const [matchThreshold, setMatchThreshold] = useState(70);
  const [autoApply, setAutoApply] = useState(false);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);

  useEffect(() => {
    loadSearchProfiles();
    loadPreferences();
  }, []);

  const loadSearchProfiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profiles } = await supabase
        .from('search_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setSearchProfiles(profiles || []);
    } catch (error) {
      console.error('Failed to load search profiles');
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load match threshold from first active profile or default
      const { data: profile } = await supabase
        .from('search_profiles')
        .select('match_threshold')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (profile?.match_threshold) {
        setMatchThreshold(profile.match_threshold);
      }
    } catch (error) {
      // Use default
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this search profile?')) return;

    try {
      const { error } = await supabase
        .from('search_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      toast.success('Search profile deleted');
      loadSearchProfiles();
    } catch (error: any) {
      toast.error('Failed to delete search profile');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setSaving(false);
        return;
      }

      // Update match threshold for all active profiles
      const { error } = await supabase
        .from('search_profiles')
        .update({ match_threshold: matchThreshold })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      toast.success('Preferences saved');
    } catch (error: any) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Search Preferences</h2>

      <div className="space-y-8">
        {/* Match Threshold */}
        <section>
          <div className="mb-4">
            <h3 className="text-h3 font-heading font-semibold text-white mb-2">Match Threshold</h3>
            <p className="text-body-sm text-white/60">
              Only show properties with a match score above this threshold
            </p>
          </div>
          <div className="max-w-md">
            <input
              type="range"
              min="50"
              max="100"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              <span className="text-body-sm text-white/60">50%</span>
              <span className="text-h4 font-heading font-bold text-white">{matchThreshold}%</span>
              <span className="text-body-sm text-white/60">100%</span>
            </div>
          </div>
        </section>

        {/* Auto-apply (Premium) */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-h3 font-heading font-semibold text-white">Auto-Apply to Highly Matched Properties</h3>
              <p className="text-body-sm text-white/60 mt-1">Automatically apply to properties with 95%+ match score (Premium)</p>
            </div>
            <button
              type="button"
              onClick={() => {
                toast.info('Premium feature coming soon');
                // setAutoApply(!autoApply);
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                autoApply ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  autoApply ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </section>

        {/* Price Drop Alerts */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-h3 font-heading font-semibold text-white">Price Drop Alerts</h3>
              <p className="text-body-sm text-white/60 mt-1">Get notified when saved properties drop in price</p>
            </div>
            <button
              type="button"
              onClick={() => setPriceDropAlerts(!priceDropAlerts)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                priceDropAlerts ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  priceDropAlerts ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </section>

        {/* Saved Search Profiles */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-h3 font-heading font-semibold text-white">Saved Search Profiles</h3>
              <p className="text-body-sm text-white/60 mt-1">Manage your property search criteria</p>
            </div>
            <Link href="/dashboard/search" className="btn-secondary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Search
            </Link>
          </div>

          <div className="space-y-3">
            {searchProfiles.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
                <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-body text-white/60 mb-4">No search profiles yet</p>
                <Link href="/dashboard/search" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Search
                </Link>
              </div>
            ) : (
              searchProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-body font-medium text-white">{profile.name}</h4>
                      {profile.is_active && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-caption text-green-500">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-white/60 mt-1">
                      {profile.cities?.join(', ')} • €{profile.min_price} - €{profile.max_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/search?edit=${profile.id}`}
                      className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="rounded-lg p-2 text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Save Button */}
        <div className="sticky bottom-0 pt-6 border-t border-white/10 bg-neutral-900 -mx-8 -mb-8 px-8 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full md:w-auto md:ml-auto md:block"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

