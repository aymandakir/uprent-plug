export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  preferred_language: string;
  subscription_tier: 'free' | 'basic' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface SearchProfile {
  id: string;
  user_id: string;
  name: string;
  city: string[];
  neighborhood: string[] | null;
  price_min: number | null;
  price_max: number | null;
  property_type: string[] | null;
  bedrooms_min: number | null;
  bedrooms_max: number | null;
  size_sqm_min: number | null;
  size_sqm_max: number | null;
  furnished: boolean | null;
  available_from: string | null;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

