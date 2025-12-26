-- Demo Data for Testing and Demo Account
-- Run this after creating your demo account

-- NOTE: Replace 'YOUR_DEMO_USER_ID' with the actual user ID from auth.users table
-- Get it from: SELECT id FROM auth.users WHERE email = 'demo@uprentplus.com';

-- ============================================
-- TEST PROPERTIES (15 realistic properties)
-- ============================================

INSERT INTO public.properties (
  external_id,
  source,
  source_url,
  title,
  description,
  city,
  neighborhood,
  street_address,
  postal_code,
  price,
  deposit,
  square_meters,
  bedrooms,
  bathrooms,
  property_type,
  furnished,
  pets_allowed,
  balcony,
  parking,
  photos,
  available_from,
  is_active
) VALUES
  -- Amsterdam Properties
  ('funda-001', 'funda', 'https://funda.nl/001', 'Modern Apartment in Amsterdam Centrum', 'Beautiful 2-bedroom apartment in the heart of Amsterdam. Close to public transport and shops.', 'Amsterdam', 'Centrum', 'Damrak 1', '1012 LG', 1800, 3600, 75, 2, 1, 'apartment', true, false, true, false, ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'], CURRENT_DATE + INTERVAL '30 days', true),
  ('funda-002', 'funda', 'https://funda.nl/002', 'Cozy Studio Near Vondelpark', 'Bright studio apartment with garden view. Perfect for students or young professionals.', 'Amsterdam', 'Oud-Zuid', 'Overtoom 45', '1054 HB', 1200, 2400, 35, 1, 1, 'studio', false, true, false, false, ARRAY['https://picsum.photos/800/600?random=3'], CURRENT_DATE + INTERVAL '14 days', true),
  ('funda-003', 'funda', 'https://funda.nl/003', 'Spacious Family Apartment', 'Large 3-bedroom apartment with balcony. Great for families. Pets allowed.', 'Amsterdam', 'De Pijp', 'Ferdinand Bolstraat 123', '1072 LH', 2200, 4400, 95, 3, 2, 'apartment', true, true, true, true, ARRAY['https://picsum.photos/800/600?random=4', 'https://picsum.photos/800/600?random=5', 'https://picsum.photos/800/600?random=6'], CURRENT_DATE + INTERVAL '45 days', true),
  ('funda-004', 'funda', 'https://funda.nl/004', 'Luxury Penthouse with Terrace', 'Stunning penthouse with rooftop terrace and city views. Recently renovated.', 'Amsterdam', 'Jordaan', 'Prinsengracht 456', '1016 GC', 3500, 7000, 120, 2, 2, 'apartment', true, false, true, true, ARRAY['https://picsum.photos/800/600?random=7', 'https://picsum.photos/800/600?random=8'], CURRENT_DATE + INTERVAL '60 days', true),
  ('pararius-001', 'pararius', 'https://pararius.nl/001', 'Affordable Apartment Amsterdam East', 'Nice 1-bedroom apartment in Amsterdam East. Close to metro and shops.', 'Amsterdam', 'Oost', 'Javastraat 78', '1094 HM', 1400, 2800, 50, 1, 1, 'apartment', false, false, false, false, ARRAY['https://picsum.photos/800/600?random=9'], CURRENT_DATE + INTERVAL '21 days', true),
  
  -- Rotterdam Properties
  ('funda-005', 'funda', 'https://funda.nl/005', 'Modern Loft in Rotterdam Center', 'Contemporary loft with high ceilings and large windows. Great location.', 'Rotterdam', 'Centrum', 'Witte de Withstraat 12', '3012 BN', 1600, 3200, 65, 2, 1, 'apartment', true, true, false, true, ARRAY['https://picsum.photos/800/600?random=10', 'https://picsum.photos/800/600?random=11'], CURRENT_DATE + INTERVAL '30 days', true),
  ('funda-006', 'funda', 'https://funda.nl/006', 'Cozy Family Home', 'Spacious 3-bedroom house with garden. Perfect for families with children.', 'Rotterdam', 'Kralingen', 'Oudedijk 234', '3061 AA', 2000, 4000, 110, 3, 2, 'house', false, true, false, true, ARRAY['https://picsum.photos/800/600?random=12', 'https://picsum.photos/800/600?random=13', 'https://picsum.photos/800/600?random=14'], CURRENT_DATE + INTERVAL '90 days', true),
  ('pararius-002', 'pararius', 'https://pararius.nl/002', 'Affordable Studio Rotterdam', 'Budget-friendly studio in Rotterdam South. Close to public transport.', 'Rotterdam', 'Zuid', 'Zuidplein 56', '3083 BM', 950, 1900, 28, 1, 1, 'studio', false, false, false, false, ARRAY['https://picsum.photos/800/600?random=15'], CURRENT_DATE + INTERVAL '7 days', true),
  
  -- Utrecht Properties
  ('funda-007', 'funda', 'https://funda.nl/007', 'Charming Apartment Utrecht Center', 'Beautiful 2-bedroom apartment in historic Utrecht center. Recently renovated.', 'Utrecht', 'Centrum', 'Oudegracht 789', '3511 AH', 1700, 3400, 70, 2, 1, 'apartment', true, false, true, false, ARRAY['https://picsum.photos/800/600?random=16', 'https://picsum.photos/800/600?random=17'], CURRENT_DATE + INTERVAL '30 days', true),
  ('funda-008', 'funda', 'https://funda.nl/008', 'Family-Friendly Apartment', 'Large 4-bedroom apartment with balcony. Great for families. Near schools.', 'Utrecht', 'Lombok', 'Kanaalstraat 345', '3531 CL', 2100, 4200, 115, 4, 2, 'apartment', false, true, true, true, ARRAY['https://picsum.photos/800/600?random=18', 'https://picsum.photos/800/600?random=19', 'https://picsum.photos/800/600?random=20'], CURRENT_DATE + INTERVAL '60 days', true),
  ('pararius-003', 'pararius', 'https://pararius.nl/003', 'Student Room Utrecht', 'Furnished room in shared house. Perfect for students. Bills included.', 'Utrecht', 'Wittevrouwen', 'Bilstraat 67', '3572 SR', 650, 1300, 18, 1, 0, 'room', true, false, false, false, ARRAY['https://picsum.photos/800/600?random=21'], CURRENT_DATE + INTERVAL '14 days', true),
  
  -- More Amsterdam Properties
  ('funda-009', 'funda', 'https://funda.nl/009', 'Modern Studio Amsterdam West', 'Bright and modern studio in Amsterdam West. Close to Westerpark.', 'Amsterdam', 'West', 'Westerpark 123', '1013 ZJ', 1350, 2700, 40, 1, 1, 'studio', true, false, true, false, ARRAY['https://picsum.photos/800/600?random=22'], CURRENT_DATE + INTERVAL '21 days', true),
  ('funda-010', 'funda', 'https://funda.nl/010', 'Luxury Apartment Amsterdam South', 'High-end 2-bedroom apartment with parking. Close to Zuid station.', 'Amsterdam', 'Zuid', 'De Boelelaan 456', '1083 HJ', 2800, 5600, 85, 2, 2, 'apartment', true, false, true, true, ARRAY['https://picsum.photos/800/600?random=23', 'https://picsum.photos/800/600?random=24'], CURRENT_DATE + INTERVAL '45 days', true),
  ('pararius-004', 'pararius', 'https://pararius.nl/004', 'Affordable 1-Bedroom', 'Nice 1-bedroom apartment in Amsterdam North. Great value for money.', 'Amsterdam', 'Noord', 'Nieuwendammerdijk 89', '1023 BG', 1300, 2600, 45, 1, 1, 'apartment', false, true, false, false, ARRAY['https://picsum.photos/800/600?random=25'], CURRENT_DATE + INTERVAL '30 days', true),
  
  -- Final properties
  ('funda-011', 'funda', 'https://funda.nl/011', 'Roomy Apartment with Garden', 'Spacious 2-bedroom apartment with private garden. Perfect for pet owners.', 'Amsterdam', 'Zuidoost', 'Bijlmerdreef 321', '1102 CT', 1650, 3300, 80, 2, 1, 'apartment', false, true, false, true, ARRAY['https://picsum.photos/800/600?random=26', 'https://picsum.photos/800/600?random=27'], CURRENT_DATE + INTERVAL '30 days', true),
  ('funda-012', 'funda', 'https://funda.nl/012', 'Historic Canal House Apartment', 'Beautiful apartment in historic canal house. Unique character and location.', 'Amsterdam', 'Centrum', 'Herengracht 567', '1017 BN', 2400, 4800, 90, 2, 2, 'apartment', true, false, true, false, ARRAY['https://picsum.photos/800/600?random=28', 'https://picsum.photos/800/600?random=29', 'https://picsum.photos/800/600?random=30'], CURRENT_DATE + INTERVAL '60 days', true)
ON CONFLICT (source_url) DO NOTHING;

-- ============================================
-- DEMO ACCOUNT SETUP
-- ============================================
-- Step 1: Create the demo user account in the app first
-- Step 2: Get the user ID from auth.users
-- Step 3: Update the SQL below with the actual user ID
-- Step 4: Run this SQL script

-- Uncomment and update after creating demo account:
/*
-- Get demo user ID (replace with actual email)
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@uprentplus.com';
  
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'Demo user not found. Please create the account first.';
  END IF;

  -- Create 3 active search profiles
  INSERT INTO public.search_profiles (user_id, name, cities, budget_min, budget_max, bedrooms_min, furnished, is_active)
  VALUES
    (demo_user_id, 'Amsterdam Centrum Search', ARRAY['Amsterdam'], 1200, 2000, 1, true, true),
    (demo_user_id, 'Rotterdam Family Home', ARRAY['Rotterdam'], 1800, 2500, 3, false, true),
    (demo_user_id, 'Utrecht Center Apartment', ARRAY['Utrecht'], 1500, 2200, 2, true, true)
  ON CONFLICT DO NOTHING;

  -- Create property matches (link properties to user with high match scores)
  INSERT INTO public.property_matches (property_id, search_profile_id, user_id, match_score, viewed, saved)
  SELECT 
    p.id,
    sp.id,
    demo_user_id,
    CASE 
      WHEN random() < 0.3 THEN 95
      WHEN random() < 0.6 THEN 90
      WHEN random() < 0.8 THEN 85
      ELSE 80
    END as match_score,
    CASE WHEN random() < 0.3 THEN true ELSE false END,
    CASE WHEN random() < 0.2 THEN true ELSE false END
  FROM properties p
  CROSS JOIN LATERAL (
    SELECT id FROM search_profiles 
    WHERE user_id = demo_user_id 
    LIMIT 1
  ) sp
  WHERE p.is_active = true
  LIMIT 15
  ON CONFLICT (property_id, search_profile_id) DO NOTHING;

  -- Mark 5 properties as saved
  INSERT INTO public.saved_properties (user_id, property_id)
  SELECT demo_user_id, id
  FROM properties
  WHERE is_active = true
  LIMIT 5
  ON CONFLICT DO NOTHING;

  -- Create 2 applications in progress
  INSERT INTO public.applications (user_id, property_id, letter_content, generated_by_ai, status, submitted_at)
  SELECT 
    demo_user_id,
    p.id,
    'Demo application letter for ' || p.title,
    true,
    CASE WHEN random() < 0.5 THEN 'sent' ELSE 'viewed' END,
    NOW() - (random() * INTERVAL '7 days')
  FROM properties p
  WHERE p.is_active = true
  LIMIT 2
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Demo account setup complete for user: %', demo_user_id;
END $$;
*/

