# Supabase Migration Required

Run these SQL commands in Supabase SQL Editor:

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';
```

This will add the missing columns that the app expects.
