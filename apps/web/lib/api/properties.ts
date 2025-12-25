import { createClient } from '@/lib/supabase/server';
import type { Property, PropertyFilters } from '@/types';

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('properties')
    .select('*')
    .order('scraped_at', { ascending: false });

  // Apply filters
  if (filters?.city && filters.city.length > 0) {
    query = query.in('location->>city', filters.city);
  }

  if (filters?.price_min) {
    query = query.gte('price', filters.price_min);
  }

  if (filters?.price_max) {
    query = query.lte('price', filters.price_max);
  }

  if (filters?.property_type && filters.property_type.length > 0) {
    query = query.in('property_type', filters.property_type);
  }

  if (filters?.bedrooms_min) {
    query = query.gte('bedrooms', filters.bedrooms_min);
  }

  if (filters?.bedrooms_max) {
    query = query.lte('bedrooms', filters.bedrooms_max);
  }

  if (filters?.size_sqm_min) {
    query = query.gte('size_sqm', filters.size_sqm_min);
  }

  if (filters?.size_sqm_max) {
    query = query.lte('size_sqm', filters.size_sqm_max);
  }

  if (filters?.furnished !== undefined && filters.furnished !== null) {
    query = query.eq('furnished', filters.furnished);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }

  return (data as any[]).map(mapPropertyFromDb) || [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch property: ${error.message}`);
  }

  return mapPropertyFromDb(data);
}

export async function saveProperty(userId: string, propertyId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('saved_properties')
    .insert({
      user_id: userId,
      property_id: propertyId,
    });

  if (error) {
    throw new Error(`Failed to save property: ${error.message}`);
  }
}

export async function unsaveProperty(userId: string, propertyId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  if (error) {
    throw new Error(`Failed to unsave property: ${error.message}`);
  }
}

function mapPropertyFromDb(data: any): Property {
  return {
    id: data.id,
    external_id: data.external_id,
    source: data.source,
    url: data.url,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency || 'EUR',
    location: typeof data.location === 'string' ? JSON.parse(data.location) : data.location,
    property_type: data.property_type,
    size_sqm: data.size_sqm,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    furnished: data.furnished,
    available_from: data.available_from,
    images: data.images || [],
    features: data.features || [],
    landlord: typeof data.landlord === 'string' ? JSON.parse(data.landlord) : data.landlord,
    created_at: data.created_at,
    updated_at: data.updated_at,
    scraped_at: data.scraped_at,
  };
}

