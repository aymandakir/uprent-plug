'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('property_matches')
      .select(`
        *,
        property:properties(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setMatches(data);
    }
    setLoading(false);
  }

  async function generateLetter(propertyId: string) {
    const res = await fetch('/api/ai/generate-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        language: 'en',
      }),
    });

    const result = await res.json();
    alert('Letter generated!\n\n' + result.letter);
  }

  if (loading) {
    return <div className="p-6">Loading matches...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Matches</h1>
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No matches yet. The scraper will find properties soon!</p>
          <Link href="/dashboard/search" className="text-blue-600 hover:underline">
            Update your search criteria →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{match.property.title}</h3>
                  <p className="text-gray-600 mb-2">{match.property.city}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">€{match.property.price}/month</p>
                  <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    {match.property.bedrooms && <span>🛏️ {match.property.bedrooms} bedrooms</span>}
                    {match.property.area_sqm && <span>📐 {match.property.area_sqm}m²</span>}
                    {match.property.furnished !== null && (
                      <span>{match.property.furnished ? '✅' : '❌'} Furnished</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={match.property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View Property →
                    </a>
                    <button
                      onClick={() => generateLetter(match.property.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      🤖 Generate AI Letter
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(match.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
