# 🎯 Critical Tasks - Week 1 Action Plan

## ✅ Task 1: Verify Deployments Are Live

### Check Vercel Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check if latest commit (with Next.js 14.2.35) deployed successfully
3. Visit your app URL: `https://your-app.vercel.app`
4. Verify landing page loads

### Check Railway Scraper
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Check scraper service logs
3. Verify service is running (not crashed)

### Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "timestamp": "2025-01-XX...",
  "status": "healthy",
  "checks": {
    "database": true,
    "stripe": true,
    "openai": true
  }
}
```

**If health check fails:**
- Database: Check Supabase connection (see Task 2)
- Stripe: Add `STRIPE_SECRET_KEY` in Vercel env vars
- OpenAI: Add `OPENAI_API_KEY` in Vercel env vars

---

## 🗄️ Task 2: Configure Production Database

### Step 1: Run Database Migration in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Go to **SQL Editor**
4. Open the migration file: `packages/database/supabase/migrations/20250101000000_init_schema.sql`
5. Copy the entire contents
6. Paste into SQL Editor
7. Click **Run**

**Verify tables were created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `users`
- `search_profiles`
- `properties`
- `property_matches`
- `notifications`
- `applications`
- `contracts`
- `activity_feed`
- `scraping_jobs`

### Step 2: Verify Row Level Security (RLS)

The migration already enables RLS, but verify:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

### Step 3: Test Database Connection

From your local machine:
```bash
cd apps/web
pnpm dev
```

Then visit: `http://localhost:3000/api/health`

The database check should pass if:
- `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly

---

## 🕷️ Task 3: Get ONE Scraper Working End-to-End

### Step 1: Set Up Environment Variables

**In Railway (scraper service):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://default:password@redis.railway.internal:6379
```

**Get Supabase keys:**
1. Supabase Dashboard → Project Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### Step 2: Add Redis Service in Railway

1. Railway Dashboard → Your Project
2. Click **+ New** → **Database** → **Redis**
3. Railway will auto-generate `REDIS_URL`
4. Copy the `REDIS_URL` to scraper service env vars

### Step 3: Test Funda Scraper Locally First

```bash
cd apps/scraper

# Create .env file
cat > .env << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379  # or Railway Redis URL
EOF

# Install dependencies (if not done)
pnpm install

# Run scraper
pnpm scrape:funda
```

**Expected output:**
```
[Funda] Browser initialized
[Funda] Scraping page 1: https://www.funda.nl/huur/amsterdam/p1/
[Funda] Found 15 listings on page 1
[Funda] New listing: 2-bedroom apartment in Amsterdam
[Funda] Scraping page 2: ...
...
Scraping complete!
```

### Step 4: Verify Data in Supabase

1. Supabase Dashboard → **Table Editor**
2. Open `properties` table
3. You should see new rows with `source = 'funda'`

### Step 5: Test End-to-End Flow

**Create a test user and search profile:**

```sql
-- Insert test user (replace with actual auth.users UUID if using Supabase Auth)
INSERT INTO public.users (id, email, subscription_tier)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@example.com',
  'free'
);

-- Create search profile
INSERT INTO public.search_profiles (
  user_id,
  name,
  cities,
  budget_min,
  budget_max,
  bedrooms_min,
  active,
  notifications_enabled
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test Amsterdam Search',
  ARRAY['amsterdam'],
  800,
  1500,
  1,
  true,
  true
);
```

**Run scraper again:**
```bash
pnpm scrape:funda
```

**Check for matches:**
```sql
SELECT 
  pm.match_score,
  p.title,
  p.price,
  p.city,
  sp.name as search_profile_name
FROM property_matches pm
JOIN properties p ON pm.property_id = p.id
JOIN search_profiles sp ON pm.search_profile_id = sp.id
ORDER BY pm.matched_at DESC
LIMIT 10;
```

**Check notifications:**
```sql
SELECT * FROM notifications 
ORDER BY sent_at DESC 
LIMIT 10;
```

### Step 6: Deploy Scraper to Railway

1. Railway Dashboard → Your Project
2. Add service → **GitHub Repo** → Select your repo
3. Set **Root Directory**: `apps/scraper`
4. Set **Start Command**: `pnpm start` (or `pnpm scrape:all` for one-time runs)
5. Add environment variables (from Step 1)
6. Deploy

**For scheduled scraping, add a cron job:**
- Railway → Your scraper service → **Settings** → **Cron Jobs**
- Add: `0 */6 * * *` (every 6 hours) → Command: `pnpm scrape:all`

---

## 🔍 Troubleshooting

### Scraper Issues

**"No listings found"**
- Funda may have changed their HTML structure
- Check browser console for errors
- Try updating selectors in `apps/scraper/src/scrapers/funda.ts`

**"Database connection failed"**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase project is active
- Verify network access from Railway

**"Property matching not working"**
- Check `search_profiles` table has active profiles
- Verify `property_matches` table exists
- Check logs for matcher errors

### Database Issues

**"RLS policy violation"**
- The migration sets up basic policies
- For admin operations, use `supabaseAdmin` (service role key)
- For user operations, ensure user is authenticated

**"Table doesn't exist"**
- Re-run migration in Supabase SQL Editor
- Check for errors in migration output

---

## ✅ Success Criteria

You'll know everything works when:

1. ✅ Health endpoint returns `"status": "healthy"`
2. ✅ Scraper runs without errors
3. ✅ Properties appear in `properties` table
4. ✅ Property matches appear in `property_matches` table
5. ✅ Notifications appear in `notifications` table

---

## 🚀 Next Steps After This Week

Once these 3 critical tasks are done:

1. **Week 2**: User authentication flow
2. **Week 2**: Payment flow end-to-end
3. **Week 2**: AI letter generator polish
4. **Week 3**: Custom domain setup
5. **Week 4**: Mobile app deployment

See the full roadmap in your original message for details.

