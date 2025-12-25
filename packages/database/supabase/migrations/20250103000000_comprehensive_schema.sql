-- Comprehensive Database Schema for Uprent Plus
-- This migration creates all tables, functions, triggers, and indexes

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Profile
  bio TEXT,
  occupation TEXT,
  company TEXT,
  monthly_income INTEGER,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  
  -- Preferences
  preferred_language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  
  -- Verification
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  
  -- Stats
  properties_viewed INTEGER DEFAULT 0,
  applications_sent INTEGER DEFAULT 0,
  matches_found INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'room', 'other')),
  
  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  neighborhood TEXT,
  country TEXT DEFAULT 'Netherlands',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Property Details
  price_monthly INTEGER NOT NULL,
  price_deposit INTEGER,
  size_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  
  -- Features
  furnished BOOLEAN DEFAULT FALSE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  smoking_allowed BOOLEAN DEFAULT FALSE,
  balcony BOOLEAN DEFAULT FALSE,
  garden BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  elevator BOOLEAN DEFAULT FALSE,
  
  -- Utilities
  utilities_included BOOLEAN DEFAULT FALSE,
  internet_included BOOLEAN DEFAULT FALSE,
  heating_type TEXT,
  energy_label TEXT CHECK (energy_label IN ('A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
  
  -- Availability
  available_from DATE,
  contract_type TEXT CHECK (contract_type IN ('indefinite', 'temporary', 'short_term')),
  contract_duration_months INTEGER,
  minimum_stay_months INTEGER,
  
  -- Landlord
  landlord_type TEXT CHECK (landlord_type IN ('private', 'agency', 'corporation')),
  landlord_name TEXT,
  landlord_email TEXT,
  landlord_phone TEXT,
  
  -- Images
  images JSONB DEFAULT '[]'::jsonb,
  main_image_url TEXT,
  
  -- Source
  source_platform TEXT NOT NULL,
  source_url TEXT UNIQUE NOT NULL,
  external_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'rented', 'removed', 'expired')),
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- SEO
  slug TEXT UNIQUE,
  
  -- Search
  search_vector TSVECTOR,
  
  CONSTRAINT valid_price CHECK (price_monthly > 0),
  CONSTRAINT valid_size CHECK (size_sqm > 0 OR size_sqm IS NULL)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_monthly);
CREATE INDEX IF NOT EXISTS idx_properties_available_from ON properties(available_from);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gist(point(longitude, latitude)) WHERE longitude IS NOT NULL AND latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_properties_source_url ON properties(source_url);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;

-- RLS Policies
CREATE POLICY "Anyone can view active properties" ON properties FOR SELECT USING (status = 'active');

-- ============================================================================
-- SEARCH PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Profile Info
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Search Criteria
  cities TEXT[] NOT NULL,
  neighborhoods TEXT[],
  property_types TEXT[] NOT NULL,
  
  -- Price Range
  min_price INTEGER,
  max_price INTEGER NOT NULL,
  
  -- Size & Rooms
  min_size_sqm INTEGER,
  max_size_sqm INTEGER,
  min_bedrooms INTEGER,
  max_bedrooms INTEGER,
  min_bathrooms INTEGER,
  
  -- Requirements
  furnished BOOLEAN,
  pets_allowed BOOLEAN,
  smoking_allowed BOOLEAN,
  balcony BOOLEAN,
  garden BOOLEAN,
  parking BOOLEAN,
  elevator BOOLEAN,
  
  -- Availability
  available_from DATE,
  contract_types TEXT[],
  max_contract_duration_months INTEGER,
  
  -- Notifications
  email_alerts BOOLEAN DEFAULT TRUE,
  push_alerts BOOLEAN DEFAULT TRUE,
  sms_alerts BOOLEAN DEFAULT FALSE,
  alert_frequency TEXT DEFAULT 'instant' CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
  
  -- Matching
  match_threshold INTEGER DEFAULT 70 CHECK (match_threshold BETWEEN 0 AND 100),
  
  -- Stats
  matches_found INTEGER DEFAULT 0,
  last_match_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_search_profiles_user ON search_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_search_profiles_active ON search_profiles(is_active) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE search_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own search profiles" ON search_profiles;

-- RLS Policies
CREATE POLICY "Users can manage own search profiles" ON search_profiles 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- MATCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  search_profile_id UUID REFERENCES search_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Match Info
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  match_reasons JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'saved', 'applied', 'dismissed')),
  viewed_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  
  -- Notifications
  notified_email BOOLEAN DEFAULT FALSE,
  notified_push BOOLEAN DEFAULT FALSE,
  notified_sms BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  
  UNIQUE(user_id, property_id, search_profile_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_property ON matches(property_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_search_profile ON matches(search_profile_id);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own matches" ON matches;

CREATE POLICY "Users can manage own matches" ON matches 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Application Details
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'viewed', 'accepted', 'rejected', 'withdrawn')),
  submitted_at TIMESTAMPTZ,
  
  -- Personal Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  nationality TEXT,
  
  -- Employment
  employment_status TEXT CHECK (employment_status IN ('employed', 'self_employed', 'student', 'unemployed', 'retired')),
  employer_name TEXT,
  monthly_income INTEGER,
  
  -- Current Situation
  current_address TEXT,
  reason_for_moving TEXT,
  move_in_date DATE,
  
  -- References
  references JSONB DEFAULT '[]'::jsonb,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- AI Generated Letter
  cover_letter TEXT,
  letter_language TEXT,
  letter_generated_at TIMESTAMPTZ,
  
  -- Communication
  messages JSONB DEFAULT '[]'::jsonb,
  last_message_at TIMESTAMPTZ,
  
  -- Viewing
  viewing_requested BOOLEAN DEFAULT FALSE,
  viewing_scheduled_at TIMESTAMPTZ,
  viewing_completed BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT valid_income CHECK (monthly_income > 0 OR monthly_income IS NULL),
  UNIQUE(user_id, property_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_property ON applications(property_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(submitted_at DESC) WHERE submitted_at IS NOT NULL;

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own applications" ON applications;

CREATE POLICY "Users can manage own applications" ON applications 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED PROPERTIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Organization
  folder TEXT DEFAULT 'default',
  notes TEXT,
  tags TEXT[],
  
  -- Reminders
  reminder_date DATE,
  reminded BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, property_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_folder ON saved_properties(folder);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property ON saved_properties(property_id);

-- Enable RLS
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own saved properties" ON saved_properties;

CREATE POLICY "Users can manage own saved properties" ON saved_properties 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  type TEXT NOT NULL CHECK (type IN ('match', 'application_update', 'message', 'system', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Links
  link_url TEXT,
  link_label TEXT,
  
  -- Related entities
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Channel
  channel TEXT CHECK (channel IN ('email', 'push', 'sms', 'in_app')),
  delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;

CREATE POLICY "Users can manage own notifications" ON notifications 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Details
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  device_type TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own activity" ON activity_log;

CREATE POLICY "Users can view own activity" ON activity_log 
  FOR SELECT USING (auth.uid() = user_id);

