import { supabase } from './lib/supabase';

interface SearchProfile {
  id: string;
  user_id: string;
  cities: string[];
  budget_min?: number;
  budget_max?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  furnished?: boolean;
  keywords: string[];
}

interface Property {
  id: string;
  city: string;
  price: number;
  bedrooms?: number;
  furnished?: boolean;
  title: string;
  description?: string;
}

export async function findMatches(propertyId: string) {
  console.log(`[Matcher] Finding matches for property ${propertyId}`);

  // Get the property
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propError || !property) {
    console.error('[Matcher] Property not found:', propError);
    return [];
  }

  // Get all active search profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('search_profiles')
    .select('*')
    .eq('is_active', true);

  if (profilesError || !profiles) {
    console.error('[Matcher] Error fetching profiles:', profilesError);
    return [];
  }

  const matches = [];

  for (const profile of profiles) {
    if (isMatch(property, profile)) {
      // Insert match
      const { data: match, error: matchError } = await supabase
        .from('property_matches')
        .insert({
          property_id: propertyId,
          search_profile_id: profile.id,
          user_id: profile.user_id,
          match_score: calculateScore(property, profile),
        })
        .select()
        .single();

      if (!matchError && match) {
        matches.push(match);
        console.log(`[Matcher] Created match for user ${profile.user_id}`);
      }
    }
  }

  return matches;
}

function isMatch(property: Property, profile: SearchProfile): boolean {
  // City match
  if (profile.cities.length > 0 && !profile.cities.includes(property.city)) {
    return false;
  }

  // Price match
  if (profile.budget_min && property.price < profile.budget_min) {
    return false;
  }
  if (profile.budget_max && property.price > profile.budget_max) {
    return false;
  }

  // Bedrooms match
  if (profile.bedrooms_min && property.bedrooms && property.bedrooms < profile.bedrooms_min) {
    return false;
  }
  if (profile.bedrooms_max && property.bedrooms && property.bedrooms > profile.bedrooms_max) {
    return false;
  }

  // Furnished match
  if (profile.furnished !== undefined && profile.furnished !== null && property.furnished !== profile.furnished) {
    return false;
  }

  // Keywords match (optional bonus)
  if (profile.keywords.length > 0) {
    const text = `${property.title} ${property.description || ''}`.toLowerCase();
    const hasKeyword = profile.keywords.some(kw => text.includes(kw.toLowerCase()));
    // For MVP, don't require keywords, just boost score if present
  }

  return true;
}

function calculateScore(property: Property, profile: SearchProfile): number {
  let score = 100;

  // Bonus for keywords
  if (profile.keywords.length > 0) {
    const text = `${property.title} ${property.description || ''}`.toLowerCase();
    const matchedKeywords = profile.keywords.filter(kw => text.includes(kw.toLowerCase()));
    score += matchedKeywords.length * 10;
  }

  return Math.min(score, 150); // Cap at 150
}
