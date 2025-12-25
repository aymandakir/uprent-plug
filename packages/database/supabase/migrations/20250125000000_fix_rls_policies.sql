-- Drop all existing policies (only if tables exist)
DO $$ 
BEGIN
  -- Drop policies from users table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
    DROP POLICY IF EXISTS "users_select_own" ON public.users;
    DROP POLICY IF EXISTS "users_insert_own" ON public.users;
    DROP POLICY IF EXISTS "users_update_own" ON public.users;
  END IF;

  -- Drop policies from properties table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.properties;
    DROP POLICY IF EXISTS "properties_select_authenticated" ON public.properties;
  END IF;

  -- Drop policies from applications table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.applications;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.applications;
    DROP POLICY IF EXISTS "applications_select_own" ON public.applications;
    DROP POLICY IF EXISTS "applications_insert_authenticated" ON public.applications;
    DROP POLICY IF EXISTS "applications_update_own" ON public.applications;
  END IF;

  -- Drop policies from saved_properties table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_properties') THEN
    DROP POLICY IF EXISTS "saved_properties_select_own" ON public.saved_properties;
    DROP POLICY IF EXISTS "saved_properties_insert_own" ON public.saved_properties;
    DROP POLICY IF EXISTS "saved_properties_delete_own" ON public.saved_properties;
  END IF;

  -- Drop policies from notifications table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
    DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
  END IF;

  -- Drop policies from settings table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settings') THEN
    DROP POLICY IF EXISTS "settings_select_own" ON public.settings;
    DROP POLICY IF EXISTS "settings_insert_own" ON public.settings;
    DROP POLICY IF EXISTS "settings_update_own" ON public.settings;
  END IF;
END $$;

-- USERS TABLE POLICIES (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- Allow users to read their own profile
    CREATE POLICY "users_select_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

    -- Allow users to insert their own profile (during signup)
    CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

    -- Allow users to update their own profile
    CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- PROPERTIES TABLE POLICIES (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
    -- Allow all authenticated users to read properties
    CREATE POLICY "properties_select_authenticated" ON public.properties
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- APPLICATIONS TABLE POLICIES (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
    -- Allow users to read their own applications
    CREATE POLICY "applications_select_own" ON public.applications
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

    -- Allow users to create applications
    CREATE POLICY "applications_insert_authenticated" ON public.applications
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

    -- Allow users to update their own applications
    CREATE POLICY "applications_update_own" ON public.applications
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- SAVED_PROPERTIES TABLE POLICIES (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_properties') THEN
    CREATE POLICY "saved_properties_select_own" ON public.saved_properties
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

    CREATE POLICY "saved_properties_insert_own" ON public.saved_properties
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "saved_properties_delete_own" ON public.saved_properties
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;

-- NOTIFICATIONS TABLE POLICIES (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

    CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- SETTINGS TABLE POLICIES (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settings') THEN
    CREATE POLICY "settings_select_own" ON public.settings
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

    CREATE POLICY "settings_insert_own" ON public.settings
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

    CREATE POLICY "settings_update_own" ON public.settings
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Grant necessary permissions (only for tables that exist)
DO $$
BEGIN
  -- Grant schema usage
  GRANT USAGE ON SCHEMA public TO authenticated;

  -- Grant permissions on users table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
  END IF;

  -- Grant permissions on properties table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
    GRANT SELECT ON public.properties TO authenticated;
  END IF;

  -- Grant permissions on applications table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
    GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
  END IF;

  -- Grant permissions on saved_properties table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_properties') THEN
    GRANT SELECT, INSERT, DELETE ON public.saved_properties TO authenticated;
  END IF;

  -- Grant permissions on notifications table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    GRANT SELECT, UPDATE ON public.notifications TO authenticated;
  END IF;

  -- Grant permissions on settings table (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settings') THEN
    GRANT SELECT, INSERT, UPDATE ON public.settings TO authenticated;
  END IF;
END $$;
