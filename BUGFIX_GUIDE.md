# Critical Bug Fixes Guide - Phase 2

This guide helps you test and fix critical bugs in the mobile app.

## Step 2.1: Test Authentication Flow

### Test Steps

1. **Start the mobile app:**
   ```bash
   cd apps/mobile
   npx expo start
   ```

2. **In simulator, test:**
   - Tap "Get Started" → Sign Up
   - Enter email: `test@example.com`
   - Enter password: `Test123456!`
   - Submit form

3. **Watch terminal for errors**

### Common Issues & Fixes

#### Issue: "Cannot connect to Supabase"

**Symptoms:**
- Error: "Failed to connect to Supabase"
- Network error when signing up

**Fix:**
```bash
# Check environment variables
cd apps/mobile
cat .env.local

# Verify:
# - EXPO_PUBLIC_SUPABASE_URL starts with https://
# - EXPO_PUBLIC_SUPABASE_ANON_KEY is correct (not empty)

# Restart dev server after .env changes
npx expo start --clear
```

**To get Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - anon/public key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

#### Issue: "Sign up fails with 400 error"

**Symptoms:**
- Sign up returns 400 Bad Request
- Error mentions "relation does not exist" or "table not found"

**Fix: Run database migrations**

1. **Go to Supabase Dashboard:**
   - Navigate to SQL Editor → New Query

2. **Run migrations in order:**
   ```bash
   # Migration 1: Initial schema
   # Copy content from: packages/database/supabase/migrations/20250101000000_init_schema.sql
   # Paste and run in SQL Editor

   # Migration 2: Auto profile creation
   # Copy content from: packages/database/supabase/migrations/20250125000001_auto_create_profile.sql
   # Paste and run in SQL Editor
   ```

3. **Verify tables exist:**
   - Go to Table Editor
   - Check that these tables exist:
     - `users`
     - `search_profiles`
     - `properties`
     - `property_matches`
     - `saved_properties`
     - `applications`

#### Issue: "After sign up, app crashes"

**Symptoms:**
- Sign up succeeds but app crashes immediately after
- Error about user profile not found

**Fix: Check auto profile creation trigger**

1. **Go to Supabase Dashboard:**
   - Database → Functions
   - Look for function: `handle_new_user`

2. **If function doesn't exist, run migration:**
   ```bash
   # Run this migration:
   packages/database/supabase/migrations/20250125000001_auto_create_profile.sql
   ```

3. **Verify trigger exists:**
   - Go to Database → Triggers
   - Look for trigger: `on_auth_user_created`
   - Should be triggered on: `auth.users` → `AFTER INSERT`

4. **Test trigger:**
   - Create a new user via Supabase Auth
   - Check `users` table - should auto-create profile

---

## Step 2.2: Test Dashboard Flow

### Test Steps

After successful login:
1. Check dashboard loads (stats cards, quick actions)
2. Navigate to Matches tab
3. Navigate to Saved tab
4. Navigate to Profile tab
5. Watch terminal for API errors

### Common Issues & Fixes

#### Issue: "Stats cards show 0 or loading forever"

**Symptoms:**
- Dashboard stats always show 0
- Stats cards never finish loading
- API error in terminal: 404 Not Found for `/api/dashboard/stats`

**Fix: Create dashboard stats API endpoint**

✅ **Already created!** The endpoint is at `apps/web/app/api/dashboard/stats/route.ts`

**Verify it exists:**
```bash
cd apps/web
ls -la app/api/dashboard/stats/route.ts
```

**If missing, it should contain:**
- See `apps/web/app/api/dashboard/stats/route.ts` for the implementation
- Returns: `{ activeSearches, newMatches, savedProperties, applications }`

**Deploy to Vercel:**
```bash
# Commit and push changes
git add apps/web/app/api/dashboard/stats/route.ts
git commit -m "Add dashboard stats API endpoint"
git push origin main

# Wait 2-3 minutes for Vercel deployment
# Check deployment status at: https://vercel.com/dashboard
```

**Test the endpoint:**
```bash
# Get your auth token from mobile app (check console logs)
# Or test via web app while logged in
curl https://your-app.vercel.app/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Mobile app should use this endpoint:**
- The mobile app's `use-dashboard.ts` hook should call `/api/dashboard/stats`
- Check `apps/mobile/hooks/use-dashboard.ts` - it currently uses direct Supabase calls
- For now, this should work, but consider updating to use API endpoint for consistency

#### Issue: "Matches/Saved tabs empty"

**Symptoms:**
- Matches tab shows "No matches yet"
- Saved tab shows "No saved properties"
- This is **EXPECTED** if no data exists yet

**Fix: Add test data**

**Option 1: Via Supabase Dashboard**

1. **Add test properties:**
   - Go to Supabase Dashboard → Table Editor → `properties`
   - Click "Insert" → "Insert row"
   - Fill in:
     ```json
     {
       "title": "Test Apartment Amsterdam",
       "city": "Amsterdam",
       "neighborhood": "Centrum",
       "street_address": "Test Street 123",
       "postal_code": "1012 AB",
       "price": 1500,
       "square_meters": 75,
       "bedrooms": 2,
       "property_type": "apartment",
       "source": "funda",
       "source_url": "https://funda.nl/test123",
       "external_id": "test-123",
       "is_active": true
     }
     ```
   - Click "Save"

2. **Repeat for 3-5 test properties:**
   - Vary city, price, bedrooms
   - Set different neighborhoods

3. **Create a search profile (optional):**
   - Table Editor → `search_profiles`
   - Insert row:
     ```json
     {
       "user_id": "YOUR_USER_ID",
       "city": "Amsterdam",
       "max_price": 2000,
       "min_bedrooms": 1,
       "is_active": true
     }
     ```

**Option 2: Via SQL (faster for multiple properties)**

1. Go to SQL Editor → New Query
2. Run:
   ```sql
   INSERT INTO properties (title, city, neighborhood, street_address, postal_code, price, square_meters, bedrooms, property_type, source, source_url, external_id, is_active)
   VALUES
     ('Modern Apartment Amsterdam', 'Amsterdam', 'Centrum', 'Damrak 1', '1012 LG', 1500, 75, 2, 'apartment', 'funda', 'https://funda.nl/1', 'funda-1', true),
     ('Cozy Studio Rotterdam', 'Rotterdam', 'Centrum', 'Coolsingel 2', '3011 AD', 1200, 45, 1, 'studio', 'funda', 'https://funda.nl/2', 'funda-2', true),
     ('Family Home Utrecht', 'Utrecht', 'Centrum', 'Oudegracht 3', '3511 AH', 1800, 100, 3, 'apartment', 'pararius', 'https://pararius.nl/1', 'pararius-1', true);
   ```

---

## Step 2.3: Test AI Letter Generator

### Test Steps

1. **In app:**
   - Dashboard → "AI Letter Generator" quick action
   - OR: Navigate to a property detail → "Generate Letter"

2. **Fill form:**
   - Language: Dutch
   - Tone: Professional
   - Length: Medium
   - Key points: "I am a reliable tenant"

3. **Tap "Generate"**

4. **Watch for API call in terminal**

### Common Issues & Fixes

#### Issue: "Generation fails with 500 error"

**Symptoms:**
- Error: "Failed to generate letter"
- 500 Internal Server Error
- Console shows OpenAI API error

**Fix: Check OpenAI API key in Vercel**

1. **Go to Vercel Dashboard:**
   - Select your project
   - Settings → Environment Variables

2. **Add/Verify:**
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...your-key-here`
   - Environment: Production, Preview, Development (check all)

3. **Get OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Copy and add to Vercel

4. **Verify endpoint exists:**
   ```bash
   cd apps/web
   ls -la app/api/ai/generate-letter/route.ts
   ```

5. **Redeploy (if key was just added):**
   ```bash
   # Trigger redeploy by pushing a commit or via Vercel dashboard
   git commit --allow-empty -m "Trigger redeploy for OpenAI key"
   git push origin main
   ```

#### Issue: "Loading forever, no response"

**Symptoms:**
- Generate button shows loading forever
- No error message
- No response from API

**Fix: Check OpenAI API key has credits**

1. **Check OpenAI usage:**
   - Visit https://platform.openai.com/usage
   - Check if you have credits/usage available

2. **Add payment method (if needed):**
   - Go to https://platform.openai.com/account/billing
   - Add payment method
   - Usually get $5 free credit initially

3. **Check API key permissions:**
   - Ensure API key has access to GPT-4 models
   - Free tier might only have GPT-3.5 access
   - Check at https://platform.openai.com/api-keys

4. **Test API key manually:**
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

5. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for OpenAI API errors
   - Check for rate limiting or quota exceeded

---

## Quick Testing Checklist

- [ ] Sign up works (creates user + profile)
- [ ] Sign in works (persists session)
- [ ] Dashboard loads (stats show, even if 0)
- [ ] Navigation works (all tabs load)
- [ ] AI letter generator endpoint exists
- [ ] OpenAI API key configured in Vercel
- [ ] Test data added (properties in database)

---

## Getting Help

If you encounter other errors:

1. **Check terminal logs** - Expo dev server shows errors
2. **Check Vercel logs** - API errors appear in deployment logs
3. **Check Supabase logs** - Database errors in Supabase Dashboard → Logs
4. **Check browser console** - If testing on web, check browser DevTools

Common error patterns:
- `401 Unauthorized` → Auth token missing/expired
- `404 Not Found` → API endpoint doesn't exist
- `500 Internal Server Error` → Check server logs
- `relation does not exist` → Run database migrations
- `network error` → Check environment variables (API URL)

---

**Last Updated:** January 25, 2025
