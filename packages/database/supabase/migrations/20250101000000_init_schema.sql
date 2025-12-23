-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'nl')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEARCH PROFILES (users can have multiple)
-- ============================================
CREATE TABLE public.search_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "My Amsterdam Search"
  cities TEXT[] NOT NULL, -- ['Amsterdam', 'Utrecht', 'Rotterdam']
  neighborhoods TEXT[], -- ['Centrum', 'De Pijp']
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  bedrooms_min INTEGER DEFAULT 1,
  bedrooms_max INTEGER,
  square_meters_min INTEGER,
  furnished BOOLEAN,
  pets_allowed BOOLEAN,
  students_allowed BOOLEAN,
  travel_time_max INTEGER, -- minutes from coordinates
  travel_coordinates GEOGRAPHY(POINT), -- PostGIS point for travel distance
  keywords TEXT[], -- ['balcony', 'parking']
  exclude_keywords TEXT[], -- ['basement', 'shared']
  active BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  notification_channels TEXT[] DEFAULT ARRAY['email'], -- ['email', 'push', 'sms', 'telegram']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT max_profiles_per_tier CHECK (
    (SELECT COUNT(*) FROM search_profiles WHERE user_id = search_profiles.user_id) <=
    CASE
      WHEN (SELECT subscription_tier FROM users WHERE id = search_profiles.user_id) = 'free' THEN 1
      WHEN (SELECT subscription_tier FROM users WHERE id = search_profiles.user_id) = 'basic' THEN 3
      ELSE 5
    END
  )
);

CREATE INDEX idx_search_profiles_user ON search_profiles(user_id);
CREATE INDEX idx_search_profiles_active ON search_profiles(active) WHERE active = true;

-- ============================================
-- PROPERTIES (scraped from all sources)
-- ============================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT NOT NULL, -- Original listing ID from source
  source TEXT NOT NULL, -- 'funda', 'pararius', 'kamernet', etc.
  source_url TEXT NOT NULL UNIQUE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  street_address TEXT,
  postal_code TEXT,
  coordinates GEOGRAPHY(POINT), -- For geo queries

  -- Property details
  price INTEGER NOT NULL,
  deposit INTEGER,
  utilities_included BOOLEAN DEFAULT false,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_meters INTEGER,
  floor_number INTEGER,
  property_type TEXT CHECK (property_type IN ('apartment', 'studio', 'house', 'room', 'other')),

  -- Features (booleans)
  furnished BOOLEAN,
  pets_allowed BOOLEAN,
  students_allowed BOOLEAN,
  balcony BOOLEAN,
  garden BOOLEAN,
  parking BOOLEAN,
  elevator BOOLEAN,

  -- Media
  photos TEXT[], -- Array of image URLs
  virtual_tour_url TEXT,

  -- Metadata
  available_from DATE,
  rental_period TEXT, -- '12 months', 'indefinite'
  landlord_type TEXT, -- 'private', 'agency', 'corporation'
  landlord_name TEXT,
  landlord_email TEXT,
  landlord_phone TEXT,
  application_url TEXT, -- Direct application link

  -- Scraping metadata
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  is_duplicate BOOLEAN DEFAULT false,
  duplicate_of UUID REFERENCES public.properties(id),

  -- AI analysis
  ai_summary TEXT, -- GPT-generated summary
  ai_red_flags TEXT[], -- ['overpriced', 'scam_risk']
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_active ON properties(is_active) WHERE is_active = true;
CREATE INDEX idx_properties_scraped ON properties(scraped_at DESC);
CREATE INDEX idx_properties_coordinates ON properties USING GIST(coordinates);
CREATE INDEX idx_properties_search ON properties USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================
-- PROPERTY MATCHES (properties matched to user searches)
-- ============================================
CREATE TABLE public.property_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  search_profile_id UUID NOT NULL REFERENCES public.search_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
  matched_at TIMESTAMPTZ DEFAULT NOW(),

  -- User actions
  viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMPTZ,
  saved BOOLEAN DEFAULT false,
  saved_at TIMESTAMPTZ,
  hidden BOOLEAN DEFAULT false,
  hidden_reason TEXT,

  UNIQUE(property_id, search_profile_id)
);

CREATE INDEX idx_matches_user ON property_matches(user_id, matched_at DESC);
CREATE INDEX idx_matches_profile ON property_matches(search_profile_id, matched_at DESC);
CREATE INDEX idx_matches_viewed ON property_matches(viewed, matched_at DESC);

-- ============================================
-- NOTIFICATIONS (sent to users)
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_match_id UUID REFERENCES public.property_matches(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN ('new_match', 'price_drop', 'viewing_reminder', 'system')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'sms', 'telegram')),

  subject TEXT,
  body TEXT NOT NULL,

  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered BOOLEAN DEFAULT false,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,

  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_notifications_user ON notifications(user_id, sent_at DESC);
CREATE INDEX idx_notifications_opened ON notifications(opened) WHERE opened = false;

-- ============================================
-- APPLICATIONS (user applications to properties)
-- ============================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Application content
  letter_content TEXT NOT NULL, -- AI-generated or custom
  generated_by_ai BOOLEAN DEFAULT false,
  ai_prompt TEXT, -- What user told AI to include

  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb, -- [{name: 'CV.pdf', url: '...'}]

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'viewing_scheduled', 'accepted', 'rejected', 'withdrawn')),
  submitted_at TIMESTAMPTZ,
  response_received_at TIMESTAMPTZ,
  response_time_seconds INTEGER, -- How long landlord took to respond

  -- Viewing details
  viewing_date TIMESTAMPTZ,
  viewing_address TEXT,
  viewing_notes TEXT,

  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_user ON applications(user_id, submitted_at DESC);
CREATE INDEX idx_applications_property ON applications(property_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- CONTRACTS (rental contracts for AI review)
-- ============================================
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,

  -- Contract file
  pdf_url TEXT NOT NULL,
  pdf_filename TEXT,

  -- Extracted data
  rent_amount INTEGER,
  deposit_amount INTEGER,
  utilities_cost INTEGER,
  start_date DATE,
  end_date DATE,
  contract_type TEXT, -- 'fixed_term', 'indefinite', 'temporary'

  -- AI analysis
  ai_analysis JSONB, -- {red_flags: [], risk_score: 75, recommendations: []}
  ai_reviewed_at TIMESTAMPTZ,

  -- Human review (Premium tier)
  human_reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES public.users(id), -- Lawyer/expert
  review_notes TEXT,
  review_status TEXT CHECK (review_status IN ('pending', 'safe', 'caution', 'risky')),
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contracts_user ON contracts(user_id, created_at DESC);

-- ============================================
-- ACTIVITY FEED (for social proof)
-- ============================================
CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (event_type IN ('search_created', 'viewing_booked', 'contract_signed', 'match_found')),

  -- Anonymized user data (GDPR compliant)
  user_display_name TEXT NOT NULL, -- "Sophie from Utrecht"
  city TEXT NOT NULL,

  -- Event details
  property_city TEXT,
  event_metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_recent ON activity_feed(created_at DESC);

-- Auto-delete old activity (keep last 7 days)
CREATE OR REPLACE FUNCTION delete_old_activity()
RETURNS void AS $$
BEGIN
  DELETE FROM activity_feed WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SCRAPING JOBS (track scraper performance)
-- ============================================
CREATE TABLE public.scraping_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  job_type TEXT CHECK (job_type IN ('full_scrape', 'incremental', 'single_property')),
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- Metrics
  properties_found INTEGER DEFAULT 0,
  properties_new INTEGER DEFAULT 0,
  properties_updated INTEGER DEFAULT 0,
  duplicates_detected INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_scraping_jobs_source ON scraping_jobs(source, started_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Properties are public (everyone can search)
CREATE POLICY "Properties are viewable by everyone" ON public.properties FOR SELECT USING (is_active = true);

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Search profiles
CREATE POLICY "Users can view own search profiles" ON public.search_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own search profiles" ON public.search_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own search profiles" ON public.search_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own search profiles" ON public.search_profiles FOR DELETE USING (auth.uid() = user_id);

-- Matches, notifications, applications, contracts
CREATE POLICY "Users can view own matches" ON public.property_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);

-- Activity feed is public (for social proof)
CREATE POLICY "Activity feed is viewable by everyone" ON public.activity_feed FOR SELECT USING (true);

-- Scraping jobs readable to admins only (example policy - adjust)
CREATE POLICY "Scraping jobs admin view" ON public.scraping_jobs FOR SELECT USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_search_profiles_updated_at BEFORE UPDATE ON public.search_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create activity feed event when application is sent
CREATE OR REPLACE FUNCTION create_activity_on_application()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status = 'draft' THEN
    INSERT INTO activity_feed (event_type, user_display_name, city, property_city, event_metadata)
    SELECT
      'viewing_booked',
      (SELECT SPLIT_PART(full_name, ' ', 1) || ' from ' || COALESCE((SELECT city FROM search_profiles WHERE user_id = NEW.user_id LIMIT 1), 'Netherlands') FROM users WHERE id = NEW.user_id),
      COALESCE((SELECT city FROM search_profiles WHERE user_id = NEW.user_id LIMIT 1), 'Netherlands'),
      (SELECT city FROM properties WHERE id = NEW.property_id),
      jsonb_build_object('application_id', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_activity_on_application AFTER UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION create_activity_on_application();

-- ============================================
-- INITIAL SEED DATA (for testing)
-- ============================================
INSERT INTO activity_feed (event_type, user_display_name, city, property_city)
VALUES
  ('viewing_booked', 'Sophie from Amsterdam', 'Amsterdam', 'Amsterdam'),
  ('contract_signed', 'Lars from Utrecht', 'Utrecht', 'Utrecht'),
  ('match_found', 'Emma from Rotterdam', 'Rotterdam', 'Rotterdam'),
  ('viewing_booked', 'Daan from Den Haag', 'Den Haag', 'Den Haag');

