export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  neighborhood?: string;
  price_monthly: number;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  property_type: string;
  images?: string[];
  photos?: string[];
  description?: string;
  available_from?: string;
  source: string;
  external_id?: string;
  furnished?: boolean;
  pets_allowed?: boolean;
  balcony?: boolean;
  elevator?: boolean;
  parking?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyMatch {
  id: string;
  property_id: string;
  search_profile_id: string;
  user_id: string;
  match_score: number;
  status: 'new' | 'viewed' | 'saved' | 'dismissed';
  matched_at: string;
  property?: Property;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  saved_at: string;
  tags?: string[];
  notes?: string;
  property?: Property;
}

