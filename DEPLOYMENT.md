# 🚀 Production Deployment Guide

## Prerequisites
- Domain: rentfusion.nl configured
- GitHub repo with access
- Vercel account
- Railway account
- Supabase project
- All API keys obtained (see `.env.example`)

## Step 1: Database (Supabase)
- Use existing Supabase project
- Copy production URL and keys

## Step 2: Deploy Web App (Vercel)
1. Connect GitHub repo to Vercel
2. Import `apps/web` project
3. Add environment variables from `.env.example`
4. Deploy `main` branch
5. Configure custom domain: `rentfusion.nl`

## Step 3: Deploy Scraper (Railway)
1. Create new Railway project
2. Add Redis service
3. Add `apps/scraper` service
4. Set environment variables
5. Deploy from GitHub `main` branch

## Step 4: Configure Webhooks
- Stripe webhook: `https://rentfusion.nl/api/stripe/webhook`
- Events: `checkout.*`, `customer.subscription.*`, `invoice.*`
- Local test: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Step 5: Setup Monitoring
- Sentry: create project, add DSN
- PostHog: create project, add API key
- Vercel Analytics: enable in project settings

## Step 6: Mobile App Deployment
```bash
# iOS
cd apps/mobile
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

## Step 7: DNS
- A Record: `rentfusion.nl` → Vercel IP
- CNAME: `www.rentfusion.nl` → `cname.vercel-dns.com`
- TXT: verification + email (Resend)

## Post-Deployment Checklist
- Health check passes: `https://rentfusion.nl/api/health`
- Scraper running on Railway
- Stripe webhooks receiving events
- Email/SMS/Push/Telegram notifications working
- Analytics tracking (PostHog/Vercel)
- SSL active, custom domain live
- Backups scheduled and tested

## Monitoring Links
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- Supabase: https://app.supabase.io
- Sentry: https://sentry.io
- PostHog: https://app.posthog.com

