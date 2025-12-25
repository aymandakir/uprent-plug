export interface Property {
  id: string;
  external_id: string;
  source: string;
  url: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  location: {
    city: string;
    neighborhood: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    postal_code: string | null;
  };
  property_type: 'apartment' | 'house' | 'studio' | 'room' | 'other';
  size_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: boolean | null;
  available_from: string | null;
  images: string[];
  features: string[];
  landlord: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  created_at: string;
  updated_at: string;
  scraped_at: string;
}

export interface PropertyFilters {
  city?: string[];
  neighborhood?: string[];
  price_min?: number;
  price_max?: number;
  property_type?: string[];
  bedrooms_min?: number;
  bedrooms_max?: number;
  size_sqm_min?: number;
  size_sqm_max?: number;
  furnished?: boolean;
  available_from?: string;
  features?: string[];
  search_query?: string;
}

export interface PropertyMatch {
  property_id: string;
  search_profile_id: string;
  match_score: number;
  match_reasons: string[];
  created_at: string;
  property: Property;
}

export type PropertyCardVariant = 'grid' | 'list' | 'compact';

