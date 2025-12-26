# Demo Account Setup Guide

This guide helps you create a demo account with pre-filled data for presentations and testing.

## Step 1: Create Demo Account

### Option A: Via Mobile App

1. **Start the mobile app:**
   ```bash
   cd apps/mobile
   npx expo start
   ```

2. **In the app:**
   - Tap "Get Started"
   - Sign up with:
     - Email: `demo@uprentplus.com`
     - Password: `Demo123456!`
   - Complete onboarding

### Option B: Via Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `demo@uprentplus.com`
   - Password: `Demo123456!`
   - Auto Confirm User: ✓ (checked)

## Step 2: Get Demo User ID

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user with email `demo@uprentplus.com`
3. Copy the User UUID (click on the user to see details)

OR run this SQL query:
```sql
SELECT id, email FROM auth.users WHERE email = 'demo@uprentplus.com';
```

## Step 3: Add Test Properties

Run the demo data migration:

1. **Go to Supabase Dashboard → SQL Editor → New Query**

2. **Copy and paste the properties INSERT statement:**
   - File: `packages/database/supabase/migrations/20250125000002_demo_data.sql`
   - Copy lines 12-42 (the INSERT INTO properties statement)
   - Paste and run in SQL Editor

   This creates 15 realistic properties in Amsterdam, Rotterdam, and Utrecht.

## Step 4: Link Data to Demo Account

1. **In SQL Editor, run this SQL (replace `YOUR_DEMO_USER_ID` with the actual UUID):**

```sql
DO $$
DECLARE
  demo_user_id UUID := 'YOUR_DEMO_USER_ID'; -- Replace with actual user ID
  profile_ids UUID[];
  property_ids UUID[];
BEGIN
  -- Create 3 active search profiles
  INSERT INTO public.search_profiles (user_id, name, cities, budget_min, budget_max, bedrooms_min, furnished, is_active)
  VALUES
    (demo_user_id, 'Amsterdam Centrum Search', ARRAY['Amsterdam'], 1200, 2000, 1, true, true),
    (demo_user_id, 'Rotterdam Family Home', ARRAY['Rotterdam'], 1800, 2500, 3, false, true),
    (demo_user_id, 'Utrecht Center Apartment', ARRAY['Utrecht'], 1500, 2200, 2, true, true)
  RETURNING id INTO profile_ids;

  -- Get property IDs
  SELECT ARRAY_AGG(id) INTO property_ids
  FROM properties
  WHERE is_active = true
  LIMIT 15;

  -- Create property matches (link properties to user with high match scores)
  INSERT INTO public.property_matches (property_id, search_profile_id, user_id, match_score, viewed, saved)
  SELECT 
    p.id,
    sp.id,
    demo_user_id,
    CASE 
      WHEN row_number() OVER () <= 5 THEN 95
      WHEN row_number() OVER () <= 10 THEN 90
      WHEN row_number() OVER () <= 13 THEN 85
      ELSE 80
    END as match_score,
    CASE WHEN row_number() OVER () <= 5 THEN true ELSE false END,
    CASE WHEN row_number() OVER () <= 3 THEN true ELSE false END
  FROM unnest(property_ids) p(id)
  CROSS JOIN LATERAL (
    SELECT id FROM unnest(profile_ids) sp(id) LIMIT 1
  ) sp;

  -- Mark 5 properties as saved
  INSERT INTO public.saved_properties (user_id, property_id)
  SELECT demo_user_id, id
  FROM unnest(property_ids) p(id)
  LIMIT 5
  ON CONFLICT DO NOTHING;

  -- Create 2 applications in progress
  INSERT INTO public.applications (user_id, property_id, letter_content, generated_by_ai, status, submitted_at)
  SELECT 
    demo_user_id,
    p.id,
    'Demo application letter for property ' || p.id::text,
    true,
    CASE WHEN row_number() OVER () = 1 THEN 'sent' ELSE 'viewed' END,
    NOW() - (row_number() OVER () * INTERVAL '2 days')
  FROM unnest(property_ids) p(id)
  LIMIT 2
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Demo account setup complete for user: %', demo_user_id;
END $$;
```

**Important:** Replace `'YOUR_DEMO_USER_ID'` with the actual UUID from Step 2.

## Step 5: Verify Setup

Check that data was created:

```sql
-- Check search profiles
SELECT COUNT(*) FROM search_profiles WHERE user_id = 'YOUR_DEMO_USER_ID';
-- Should return 3

-- Check property matches
SELECT COUNT(*) FROM property_matches WHERE user_id = 'YOUR_DEMO_USER_ID';
-- Should return 15

-- Check saved properties
SELECT COUNT(*) FROM saved_properties WHERE user_id = 'YOUR_DEMO_USER_ID';
-- Should return 5

-- Check applications
SELECT COUNT(*) FROM applications WHERE user_id = 'YOUR_DEMO_USER_ID';
-- Should return 2
```

## Quick Setup Script

Save this as a file and update the user ID:

```sql
-- Quick Demo Setup Script
-- Update the user_id variable below

\set demo_user_id 'YOUR_DEMO_USER_ID_HERE'

-- Then run all the SQL from Step 4 above
```

## Demo Account Credentials

```
Email: demo@uprentplus.com
Password: Demo123456!
```

**⚠️ Security Note:** Change the password after your demo or use a different email for production demos.

## What the Demo Account Has

- ✅ **3 Active Search Profiles:**
  - Amsterdam Centrum Search (€1,200 - €2,000, 1+ bedroom, furnished)
  - Rotterdam Family Home (€1,800 - €2,500, 3+ bedrooms, unfurnished)
  - Utrecht Center Apartment (€1,500 - €2,200, 2+ bedrooms, furnished)

- ✅ **15 Property Matches:**
  - High match scores (80-95%)
  - Mix of viewed/unviewed
  - Mix of saved/unsaved

- ✅ **5 Saved Properties:**
  - Ready to show in "Saved" tab

- ✅ **2 Applications in Progress:**
  - 1 "sent" status
  - 1 "viewed" status

- ✅ **15 Test Properties:**
  - Amsterdam (8 properties)
  - Rotterdam (3 properties)
  - Utrecht (3 properties)
  - Mix of studios, apartments, and houses
  - Realistic prices (€950 - €3,500/month)
  - All with images (Picsum placeholders)

## Testing the Demo

1. **Login with demo credentials**
2. **Dashboard:**
   - Should show: 3 active searches, 15 new matches, 5 saved properties, 2 applications
3. **Matches Tab:**
   - Should show 15 properties with match scores
   - Some marked as saved (heart icon filled)
4. **Saved Tab:**
   - Should show 5 saved properties
5. **Applications:**
   - Should show 2 applications in different states

## Troubleshooting

### Properties not showing?
- Check that properties were inserted: `SELECT COUNT(*) FROM properties;`
- Check that property_matches were created: `SELECT COUNT(*) FROM property_matches;`

### Matches not appearing?
- Verify search profiles exist: `SELECT * FROM search_profiles WHERE user_id = 'YOUR_USER_ID';`
- Check property_matches: `SELECT * FROM property_matches WHERE user_id = 'YOUR_USER_ID' LIMIT 5;`

### User not found?
- Make sure you created the account first (Step 1)
- Check auth.users table: `SELECT id, email FROM auth.users WHERE email = 'demo@uprentplus.com';`

---

**Last Updated:** January 25, 2025

