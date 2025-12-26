# Demo Data Setup Guide

Quick reference for adding demo data to the mobile app.

## Option 1: Use SQL Script (Recommended)

The easiest way is to use the SQL migration script:

1. **File:** `packages/database/supabase/migrations/20250125000002_demo_data.sql`
2. **See:** `DEMO_SETUP.md` for detailed instructions

## Option 2: Manual Insert via Supabase Dashboard

### Add Properties

1. Go to Supabase Dashboard → Table Editor → `properties`
2. Click "Insert row" and fill in:

**Required Fields:**
- `external_id`: `test-001` (unique for each property)
- `source`: `funda` or `pararius`
- `source_url`: `https://funda.nl/test-001` (must be unique)
- `title`: `Modern Apartment Amsterdam`
- `city`: `Amsterdam` (or Rotterdam, Utrecht)
- `price`: `1500` (monthly rent in EUR)
- `is_active`: `true` (checkbox)

**Recommended Fields:**
- `neighborhood`: `Centrum`
- `street_address`: `Damrak 1`
- `postal_code`: `1012 LG`
- `square_meters`: `75`
- `bedrooms`: `2`
- `bathrooms`: `1`
- `property_type`: `apartment` (or `studio`, `house`, `room`)
- `photos`: `["https://picsum.photos/800/600?random=1", "https://picsum.photos/800/600?random=2"]`
- `available_from`: Select a date (30 days from now)
- `furnished`: `true` or `false`
- `pets_allowed`: `true` or `false`
- `balcony`: `true` or `false`
- `parking`: `true` or `false`

3. Click "Save"
4. Repeat for 10-15 properties

### Create Property Matches

1. Go to Table Editor → `property_matches`
2. Click "Insert row":
   - `property_id`: Select a property from dropdown
   - `search_profile_id`: Select a search profile (create one first if needed)
   - `user_id`: Your user ID
   - `match_score`: `85` (between 0-100)
   - `viewed`: `false` (for new matches)
   - `saved`: `false` (optional)

3. Repeat to link properties to user

### Create Search Profiles

1. Go to Table Editor → `search_profiles`
2. Click "Insert row":
   - `user_id`: Your user ID
   - `name`: `My Amsterdam Search`
   - `cities`: `["Amsterdam"]` (array format)
   - `budget_min`: `1200`
   - `budget_max`: `2000`
   - `bedrooms_min`: `1`
   - `furnished`: `true` (optional)
   - `is_active`: `true`

## Option 3: Run Scraper (Real Data)

If you want real properties from Funda:

```bash
cd apps/scraper
pnpm install
pnpm run scrape:funda
```

**Note:** This requires:
- Environment variables configured
- Supabase connection set up
- May take 10-30 minutes
- May hit rate limits (use sparingly)

---

**For full demo account setup, see:** `DEMO_SETUP.md`

