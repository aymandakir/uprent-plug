/**
 * Search filter types
 */

export interface SearchFilters {
  // Location
  cities?: string[];
  neighborhoods?: string[];
  latitude?: number;
  longitude?: number;
  distance?: number; // km

  // Price
  priceMin?: number | null;
  priceMax?: number | null;
  depositMax?: number | null;
  lowDepositOnly?: boolean;
  noDepositOnly?: boolean;

  // Property Type
  propertyTypes?: string[];
  entirePlace?: boolean;
  sharedAccommodation?: boolean;
  studentHousing?: boolean;

  // Size & Rooms
  sizeMin?: number | null;
  sizeMax?: number | null;
  bedroomsMin?: number | null;
  bedroomsMax?: number | null;
  bathroomsMin?: number | null;

  // Features
  features?: string[]; // 'furnished', 'pets_allowed', 'balcony', etc.

  // Utilities
  utilities?: string[];
  heatingType?: string;
  energyLabels?: string[];

  // Availability
  availableFrom?: string | null; // ISO date string
  contractTypes?: string[];
  maxContractDuration?: number | null;

  // Landlord
  landlordTypes?: string[];
  registrationRequired?: boolean;

  // Special (Premium)
  suitableForStudents?: boolean;
  suitableForFamilies?: boolean;
  disabilityAccessible?: boolean;
  groundFloorOnly?: boolean;
  washingMachine?: boolean;
  dishwasher?: boolean;
  terrace?: boolean;
}

export interface SearchSort {
  field: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'size_desc' | 'available_from' | 'match_score';
  direction?: 'asc' | 'desc';
}

export interface SearchQuery {
  q?: string;
  filters?: SearchFilters;
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

