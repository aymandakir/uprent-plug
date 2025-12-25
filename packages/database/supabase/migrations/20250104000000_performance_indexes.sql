-- Performance optimization indexes
-- Create indexes for common query patterns

-- Properties table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_search_params 
  ON properties(city, status, price_monthly, available_from) 
  WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_location 
  ON properties USING gist(point(longitude, latitude))
  WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_created_at 
  ON properties(created_at DESC) 
  WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_city_status 
  ON properties(city, status, created_at DESC);

-- Partial index for new properties (last 7 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_new_properties 
  ON properties(created_at DESC) 
  WHERE status = 'active' AND created_at > NOW() - INTERVAL '7 days';

-- Matches table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_user_status 
  ON matches(user_id, status, match_score DESC) 
  WHERE status != 'dismissed';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_property_user 
  ON matches(property_id, user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_created_at 
  ON matches(created_at DESC)
  WHERE status = 'new';

-- Applications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_user_status 
  ON applications(user_id, status, submitted_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_property 
  ON applications(property_id, status, submitted_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status_created 
  ON applications(status, created_at DESC);

-- Notifications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_read 
  ON notifications(user_id, read, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_channel 
  ON notifications(user_id, channel, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_user 
  ON notifications(type, user_id, created_at DESC);

-- Search profiles table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_profiles_user_active 
  ON search_profiles(user_id, is_active, updated_at DESC);

-- Saved properties table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_saved_properties_user 
  ON saved_properties(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_saved_properties_property 
  ON saved_properties(property_id, user_id);

-- Composite index for property search with filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_full_search 
  ON properties(city, property_type, price_monthly, bedrooms, status)
  WHERE status = 'active';

-- Index for text search (using GIN for full-text search)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_search_vector 
  ON properties USING gin(search_vector)
  WHERE search_vector IS NOT NULL;

-- Materialized view for property statistics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS property_statistics AS
SELECT 
  city,
  property_type,
  AVG(price_monthly) as avg_price,
  COUNT(*) as property_count,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_monthly) as median_price,
  MIN(price_monthly) as min_price,
  MAX(price_monthly) as max_price,
  NOW() as last_updated
FROM properties
WHERE status = 'active'
GROUP BY city, property_type;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_statistics_unique 
  ON property_statistics(city, property_type);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_property_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY property_statistics;
END;
$$ LANGUAGE plpgsql;

-- Note: Schedule refresh with pg_cron (if available)
-- SELECT cron.schedule('refresh-stats', '0 * * * *', 'SELECT refresh_property_stats()');

