'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Archive, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/search/property-card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

type MatchTab = 'active' | 'new' | 'saved' | 'dismissed';

export default function MatchesPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<MatchTab>('active');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSearchProfile, setSelectedSearchProfile] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'newest' | 'price'>('score');

  useEffect(() => {
    loadMatches();
  }, [activeTab, selectedSearchProfile, sortBy]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('matches')
        .select(`
          *,
          properties (*),
          search_profiles (name)
        `)
        .eq('user_id', user.id);

      // Filter by tab
      switch (activeTab) {
        case 'new':
          query = query.eq('status', 'new');
          break;
        case 'saved':
          query = query.eq('status', 'saved');
          break;
        case 'dismissed':
          query = query.eq('status', 'dismissed');
          break;
        default:
          query = query.neq('status', 'dismissed');
      }

      // Filter by search profile
      if (selectedSearchProfile !== 'all') {
        query = query.eq('search_profile_id', selectedSearchProfile);
      }

      // Sort
      switch (sortBy) {
        case 'score':
          query = query.order('match_score', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price':
          query = query.order('properties(price_monthly)', { ascending: true });
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast.error('Failed to load matches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'dismissed' })
        .eq('id', matchId);

      if (error) throw error;
      toast.success('Match dismissed');
      loadMatches();
    } catch (error: any) {
      toast.error('Failed to dismiss match');
    }
  };

  const handleRestore = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'new' })
        .eq('id', matchId);

      if (error) throw error;
      toast.success('Match restored');
      loadMatches();
    } catch (error: any) {
      toast.error('Failed to restore match');
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const tabs: { id: MatchTab; label: string; count?: number }[] = [
    { id: 'active', label: 'Active' },
    { id: 'new', label: 'New', count: matches.filter((m) => m.status === 'new').length },
    { id: 'saved', label: 'Saved' },
    { id: 'dismissed', label: 'Dismissed' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-heading font-bold text-white mb-2">Your Matches</h1>
          <p className="text-body text-white/60">Properties matching your saved searches</p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedSearchProfile}
              onChange={(e) => setSelectedSearchProfile(e.target.value)}
              className="input"
            >
              <option value="all">All searches</option>
              {/* TODO: Load search profiles */}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input"
            >
              <option value="score">Match score</option>
              <option value="newest">Newest</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-4 py-3 text-body font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 rounded-full bg-electric-blue px-2 py-0.5 text-caption text-white">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue" />
              )}
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-white/10 rounded-lg mb-4" />
                <div className="h-4 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="card text-center py-24">
            <Star className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-h3 font-heading font-bold text-white mb-2">No matches found</h3>
            <p className="text-body text-white/60 mb-6">
              {activeTab === 'dismissed'
                ? 'No dismissed matches'
                : 'New matches will appear here when properties match your search criteria'}
            </p>
            {activeTab === 'dismissed' ? (
              <Link href="/dashboard/search" className="btn-primary">
                Start searching
              </Link>
            ) : (
              <Link href="/dashboard/search" className="btn-primary">
                Create a search profile
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const property = match.properties;
              const score = match.match_score || 0;

              return (
                <div key={match.id} className="card group">
                  {/* Match Score Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={cn(
                      'rounded-full px-3 py-1.5 text-caption font-bold text-white flex items-center gap-1',
                      getMatchScoreColor(score)
                    )}>
                      <Star className="h-3 w-3 fill-current" />
                      {score}% Match
                    </div>
                  </div>

                  {/* Property Card */}
                  <PropertyCard
                    property={property}
                    variant="grid"
                    matchScore={score}
                  />

                  {/* Match Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <Link
                      href={`/dashboard/applications/new?property=${property.id}`}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {activeTab === 'dismissed' ? (
                      <button
                        onClick={() => handleRestore(match.id)}
                        className="btn-secondary p-2"
                        title="Restore"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDismiss(match.id)}
                        className="btn-secondary p-2"
                        title="Dismiss"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
