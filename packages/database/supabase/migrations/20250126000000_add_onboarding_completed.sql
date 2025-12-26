-- Add onboarding_completed column to users table if it doesn't exist
-- This migration is safe to run multiple times (idempotent)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
    
    COMMENT ON COLUMN public.users.onboarding_completed IS 'Tracks whether user has completed the onboarding flow';
  END IF;
END $$;