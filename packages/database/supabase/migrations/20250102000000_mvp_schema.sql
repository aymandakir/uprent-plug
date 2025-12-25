-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
email TEXT NOT NULL,
full_name TEXT,
subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
stripe_customer_id TEXT UNIQUE,
stripe_subscription_id TEXT,
subscription_status TEXT DEFAULT 'inactive',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search profiles (one per user for MVP)
CREATE TABLE public.search_profiles (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
cities TEXT[] NOT NULL DEFAULT '{}',
budget_min INTEGER,
budget_max INTEGER,
bedrooms_min INTEGER,
bedrooms_max INTEGER,
furnished BOOLEAN,
keywords TEXT[] DEFAULT '{}',
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id) -- One search per user for MVP
);

-- Properties (scraped listings)
CREATE TABLE public.properties (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
source TEXT NOT NULL, -- 'funda', 'pararius', etc
external_id TEXT NOT NULL,
url TEXT NOT NULL,
title TEXT NOT NULL,
city TEXT NOT NULL,
price INTEGER NOT NULL,
bedrooms INTEGER,
area_sqm INTEGER,
furnished BOOLEAN,
description TEXT,
photos TEXT[] DEFAULT '{}',
available_from DATE,
landlord_name TEXT,
landlord_email TEXT,
scraped_at TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(source, external_id)
);

-- Property matches
CREATE TABLE public.property_matches (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
search_profile_id UUID NOT NULL REFERENCES public.search_profiles(id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
match_score INTEGER DEFAULT 100,
viewed BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(property_id, search_profile_id)
);

-- Notification targets (push tokens, emails)
CREATE TABLE public.notification_targets (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'sms', 'telegram')),
target TEXT NOT NULL, -- email address, expo push token, phone number, etc
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, channel, target)
);

-- Notifications sent log
CREATE TABLE public.notifications_sent (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
property_match_id UUID REFERENCES public.property_matches(id) ON DELETE CASCADE,
channel TEXT NOT NULL,
target TEXT NOT NULL,
status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
error TEXT,
sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI generated letters
CREATE TABLE public.generated_letters (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
content TEXT NOT NULL,
language TEXT DEFAULT 'en' CHECK (language IN ('en', 'nl')),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_scraped_at ON public.properties(scraped_at DESC);
CREATE INDEX idx_property_matches_user_id ON public.property_matches(user_id);
CREATE INDEX idx_property_matches_created_at ON public.property_matches(created_at DESC);
CREATE INDEX idx_search_profiles_user_id ON public.search_profiles(user_id);
CREATE INDEX idx_notifications_sent_user_id ON public.notifications_sent(user_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_letters ENABLE ROW LEVEL SECURITY;

-- Properties are public (read-only for users)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Properties are viewable by everyone" ON public.properties FOR SELECT USING (true);

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Search profiles: users can CRUD their own
CREATE POLICY "Users can view own search" ON public.search_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own search" ON public.search_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own search" ON public.search_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own search" ON public.search_profiles FOR DELETE USING (auth.uid() = user_id);

-- Property matches: users can view their own matches
CREATE POLICY "Users can view own matches" ON public.property_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own matches" ON public.property_matches FOR UPDATE USING (auth.uid() = user_id);

-- Notification targets: users manage their own
CREATE POLICY "Users can manage own notification targets" ON public.notification_targets FOR ALL USING (auth.uid() = user_id);

-- Notifications sent: users can view their own
CREATE POLICY "Users can view own notifications" ON public.notifications_sent FOR SELECT USING (auth.uid() = user_id);

-- Generated letters: users can view their own
CREATE POLICY "Users can view own letters" ON public.generated_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own letters" ON public.generated_letters FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to upsert property (called by scraper service role)
CREATE OR REPLACE FUNCTION upsert_property(
p_source TEXT,
p_external_id TEXT,
p_url TEXT,
p_title TEXT,
p_city TEXT,
p_price INTEGER,
p_bedrooms INTEGER DEFAULT NULL,
p_area_sqm INTEGER DEFAULT NULL,
p_furnished BOOLEAN DEFAULT NULL,
p_description TEXT DEFAULT NULL,
p_photos TEXT[] DEFAULT '{}',
p_available_from DATE DEFAULT NULL,
p_landlord_name TEXT DEFAULT NULL,
p_landlord_email TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
property_id UUID;
BEGIN
INSERT INTO public.properties (
source, external_id, url, title, city, price, bedrooms,
area_sqm, furnished, description, photos, available_from,
landlord_name, landlord_email, scraped_at
) VALUES (
p_source, p_external_id, p_url, p_title, p_city, p_price, p_bedrooms,
p_area_sqm, p_furnished, p_description, p_photos, p_available_from,
p_landlord_name, p_landlord_email, NOW()
)
ON CONFLICT (source, external_id)
DO UPDATE SET
title = EXCLUDED.title,
price = EXCLUDED.price,
description = EXCLUDED.description,
photos = EXCLUDED.photos,
scraped_at = NOW()
RETURNING id INTO property_id;

RETURN property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
