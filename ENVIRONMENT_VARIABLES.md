# Environment Variables Documentation

This document describes all environment variables used across the Uprent Plus application.

## Required Variables

### Supabase
```bash
# Public Supabase URL (required for all environments)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Public anonymous key (required for all environments)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role key (server-side only, required for scraper and admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Application
```bash
# Public app URL (required for all environments)
NEXT_PUBLIC_APP_URL=https://uprent-plug-web.vercel.app

# Node environment
NODE_ENV=production
```

## Optional Variables

### OpenAI (Required for AI features)
```bash
# OpenAI API key for letter generation and contract analysis
OPENAI_API_KEY=sk-your-openai-key
```

### Stripe (Required for payments)
```bash
# Stripe secret key (server-side only)
STRIPE_SECRET_KEY=sk_live_your-stripe-key

# Stripe publishable key (public, client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key

# Stripe webhook secret (for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Email (Required for notifications)
```bash
# Resend API key for sending emails
RESEND_API_KEY=re_your-resend-key

# Email from address
EMAIL_FROM=noreply@uprent.nl
```

### SMS (Premium feature, optional)
```bash
# Twilio account SID
TWILIO_ACCOUNT_SID=your-account-sid

# Twilio auth token
TWILIO_AUTH_TOKEN=your-auth-token

# Twilio phone number
TWILIO_PHONE_NUMBER=+1234567890
```

### Redis (Optional, for caching and rate limiting)
```bash
# Redis connection URL
REDIS_URL=redis://localhost:6379
# Or for production:
REDIS_URL=rediss://user:password@host:port
```

### Monitoring (Optional)
```bash
# Sentry DSN for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Vercel Analytics (automatic on Vercel)
# No configuration needed if deployed on Vercel
```

### Analytics (Optional)
```bash
# Enable analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Custom analytics endpoint
ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com/track
```

## Environment-Specific Configurations

### Development
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=sk-test-key
STRIPE_SECRET_KEY=sk_test_key
STRIPE_WEBHOOK_SECRET=whsec_test
```

### Staging
```bash
# Set in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=staging-service-key
NEXT_PUBLIC_APP_URL=https://staging.uprent-plus.com
OPENAI_API_KEY=sk-prod-key
STRIPE_SECRET_KEY=sk_test_key  # Use test mode
STRIPE_WEBHOOK_SECRET=whsec_staging
```

### Production
```bash
# Set in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-key  # Keep secure!
NEXT_PUBLIC_APP_URL=https://uprent-plug-web.vercel.app
OPENAI_API_KEY=sk-prod-key
STRIPE_SECRET_KEY=sk_live_prod-key  # Use live mode
STRIPE_WEBHOOK_SECRET=whsec_prod
REDIS_URL=rediss://prod-redis-url
SENTRY_DSN=https://prod-sentry-dsn
```

## Setting Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for the appropriate environments:
   - **Production**: Production environment only
   - **Preview**: Preview deployments (PRs)
   - **Development**: Local development (optional)

## Security Best Practices

1. **Never commit secrets to git**
   - Add `.env.local` to `.gitignore`
   - Use `.env.example` for documentation

2. **Use different keys per environment**
   - Separate Supabase projects for dev/staging/prod
   - Use Stripe test mode for staging
   - Use different OpenAI organizations if possible

3. **Rotate keys regularly**
   - Rotate service role keys every 90 days
   - Rotate API keys if compromised
   - Monitor key usage

4. **Limit key permissions**
   - Service role key should only be used server-side
   - Anon key should have RLS policies enabled
   - Use least privilege principle

5. **Monitor key usage**
   - Set up alerts for unusual API usage
   - Monitor Supabase dashboard for anomalies
   - Track OpenAI usage and costs

## Verification

After setting environment variables, verify they're loaded correctly:

```bash
# Check Next.js build
pnpm build

# Check Vercel deployment logs
# Look for environment variable errors

# Test API endpoints
curl https://your-app.vercel.app/api/health
```

## Troubleshooting

### Variables not loading
- Ensure variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Restart Vercel deployment after adding variables
- Clear Next.js cache: `.next` folder

### Client-side variables
- Variables prefixed with `NEXT_PUBLIC_` are exposed to client
- Never put secrets in `NEXT_PUBLIC_` variables
- Client-side variables are visible in browser

### Server-side variables
- Access via `process.env.VARIABLE_NAME`
- Available in API routes, Server Components, and middleware
- Not accessible in Client Components

