-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.properties;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.applications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.applications;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "properties_select_authenticated" ON public.properties;
DROP POLICY IF EXISTS "applications_select_own" ON public.applications;
DROP POLICY IF EXISTS "applications_insert_authenticated" ON public.applications;
DROP POLICY IF EXISTS "applications_update_own" ON public.applications;
DROP POLICY IF EXISTS "saved_properties_select_own" ON public.saved_properties;
DROP POLICY IF EXISTS "saved_properties_insert_own" ON public.saved_properties;
DROP POLICY IF EXISTS "saved_properties_delete_own" ON public.saved_properties;
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "settings_select_own" ON public.settings;
DROP POLICY IF EXISTS "settings_insert_own" ON public.settings;
DROP POLICY IF EXISTS "settings_update_own" ON public.settings;

-- USERS TABLE POLICIES
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

-- PROPERTIES TABLE POLICIES
-- Allow all authenticated users to read properties
CREATE POLICY "properties_select_authenticated" ON public.properties
FOR SELECT
TO authenticated
USING (true);

-- APPLICATIONS TABLE POLICIES
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

-- SAVED_PROPERTIES TABLE POLICIES
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

-- NOTIFICATIONS TABLE POLICIES
CREATE POLICY "notifications_select_own" ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.properties TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_properties TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;

-- Grant settings permissions if table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'settings') THEN
    GRANT SELECT, INSERT, UPDATE ON public.settings TO authenticated;
  END IF;
END $$;

