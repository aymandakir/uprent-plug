# 🔑 Environment Variables Checklist

Complete list of all environment variables needed for production deployment.

## 📍 Where to Set These

- **Vercel** (Web App): Settings → Environment Variables
- **Railway** (Scraper): Service → Variables
- **Local Development**: `.env.local` files in respective apps

---

## 🌐 Web App (Vercel) - Required

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # For admin operations
```

**Where to find:**
- Supabase Dashboard → Project Settings → API
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

### Stripe
```bash
STRIPE_SECRET_KEY=sk_live_xxx  # or sk_test_xxx for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # or pk_test_xxx
NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=price_xxx  # Optional
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxx  # Optional
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Where to find:**
- [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
- [Stripe Dashboard → Products](https://dashboard.stripe.com/products) → Copy Price IDs
- [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) → Copy Signing Secret

### OpenAI
```bash
OPENAI_API_KEY=sk-xxx
```

**Where to find:**
- [OpenAI Platform → API Keys](https://platform.openai.com/api-keys)

### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
# Or with custom domain:
# NEXT_PUBLIC_APP_URL=https://uprent.nl
```

### Email (Resend) - Optional but Recommended
```bash
RESEND_API_KEY=re_xxx
```

**Where to find:**
- [Resend Dashboard → API Keys](https://resend.com/api-keys)

### Monitoring (Optional)
```bash
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 🕷️ Scraper (Railway) - Required

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Same as web app** - use the same Supabase project.

### Redis
```bash
REDIS_URL=redis://default:password@redis.railway.internal:6379
```

**Where to find:**
- Railway Dashboard → Redis Service → Variables
- Railway auto-generates this when you add Redis service

### Alternative Redis Config (if not using Railway Redis)
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password  # Optional
```

---

## 📱 Mobile App (EAS Build) - Required

### Supabase
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Same as web app** - use the same Supabase project.

### App Configuration
```bash
EXPO_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## ✅ Verification Checklist

### Web App (Vercel)
- [ ] All Supabase variables set
- [ ] All Stripe variables set
- [ ] `OPENAI_API_KEY` set
- [ ] `NEXT_PUBLIC_APP_URL` matches your Vercel domain
- [ ] Health endpoint returns `"status": "healthy"`

### Scraper (Railway)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (⚠️ service role, not anon key!)
- [ ] `REDIS_URL` set (or `REDIS_HOST` + `REDIS_PORT`)
- [ ] Scraper service is running (check logs)

### Test Locally First
```bash
# Web app
cd apps/web
cp .env.example .env.local
# Fill in values, then:
pnpm dev
# Visit http://localhost:3000/api/health

# Scraper
cd apps/scraper
# Create .env file with variables above
pnpm scrape:funda
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Service Role Key** is powerful - Only use in server-side code (scraper, API routes)
3. **Anon Key** is safe for client-side (Next.js public env vars)
4. **Stripe Keys** - Use test keys (`sk_test_`, `pk_test_`) for development
5. **Rotate keys** if accidentally exposed

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is the `service_role` key, not `anon`
- Check Supabase project is active (not paused)

### "Stripe webhook signature invalid"
- Verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret
- For local testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### "OpenAI API error"
- Check `OPENAI_API_KEY` is valid
- Verify you have credits in your OpenAI account
- Check rate limits

### "Redis connection failed" (Scraper)
- Verify `REDIS_URL` is correct format
- Check Railway Redis service is running
- For local testing, ensure Redis is running: `redis-server`

---

## 📝 Quick Reference

**Minimum required for MVP:**
- Web: Supabase (URL + Anon Key), Stripe (Secret + Publishable), OpenAI, App URL
- Scraper: Supabase (URL + Service Role), Redis URL

**Nice to have:**
- Email notifications (Resend)
- Monitoring (Sentry, PostHog)
- Yearly subscription prices (Stripe)

