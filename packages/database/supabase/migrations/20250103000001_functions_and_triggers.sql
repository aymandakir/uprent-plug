-- Database Functions and Triggers
-- Auto-update updated_at timestamp, search vector, and match scoring

-- ============================================================================
-- UPDATE UPDATED_AT TIMESTAMP FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_search_profiles_updated_at ON search_profiles;
CREATE TRIGGER update_search_profiles_updated_at 
  BEFORE UPDATE ON search_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FULL-TEXT SEARCH VECTOR FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_property_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.neighborhood, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_search ON properties;
CREATE TRIGGER update_properties_search 
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW 
  EXECUTE FUNCTION update_property_search_vector();

-- Initialize search vector for existing properties
UPDATE properties SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(address, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(city, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(neighborhood, '')), 'B')
WHERE search_vector IS NULL;

-- ============================================================================
-- MATCH SCORING FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_match_score(
  property_data properties,
  search_data search_profiles
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  max_score INTEGER := 100;
  price_diff INTEGER;
BEGIN
  -- Price match (25 points)
  IF property_data.price_monthly BETWEEN COALESCE(search_data.min_price, 0) AND search_data.max_price THEN
    score := score + 25;
  ELSIF property_data.price_monthly < COALESCE(search_data.min_price, 0) THEN
    price_diff := COALESCE(search_data.min_price, 0) - property_data.price_monthly;
    score := score + GREATEST(0, 25 - (price_diff / 50));
  ELSE
    price_diff := property_data.price_monthly - search_data.max_price;
    score := score + GREATEST(0, 25 - (price_diff / 50));
  END IF;
  
  -- Location match (20 points)
  IF property_data.city = ANY(search_data.cities) THEN
    score := score + 15;
    IF search_data.neighborhoods IS NOT NULL AND property_data.neighborhood = ANY(search_data.neighborhoods) THEN
      score := score + 5;
    END IF;
  END IF;
  
  -- Property type (15 points)
  IF property_data.property_type = ANY(search_data.property_types) THEN
    score := score + 15;
  END IF;
  
  -- Size match (10 points)
  IF search_data.min_size_sqm IS NOT NULL AND search_data.max_size_sqm IS NOT NULL THEN
    IF property_data.size_sqm BETWEEN search_data.min_size_sqm AND search_data.max_size_sqm THEN
      score := score + 10;
    END IF;
  ELSIF search_data.min_size_sqm IS NOT NULL THEN
    IF property_data.size_sqm >= search_data.min_size_sqm THEN
      score := score + 10;
    END IF;
  END IF;
  
  -- Bedrooms match (10 points)
  IF search_data.min_bedrooms IS NOT NULL AND property_data.bedrooms IS NOT NULL AND property_data.bedrooms >= search_data.min_bedrooms THEN
    IF search_data.max_bedrooms IS NULL OR property_data.bedrooms <= search_data.max_bedrooms THEN
      score := score + 10;
    END IF;
  END IF;
  
  -- Features match (20 points total, 4 points each)
  IF search_data.furnished IS TRUE AND property_data.furnished IS TRUE THEN score := score + 4; END IF;
  IF search_data.pets_allowed IS TRUE AND property_data.pets_allowed IS TRUE THEN score := score + 4; END IF;
  IF search_data.parking IS TRUE AND property_data.parking IS TRUE THEN score := score + 4; END IF;
  IF search_data.balcony IS TRUE AND property_data.balcony IS TRUE THEN score := score + 4; END IF;
  IF search_data.garden IS TRUE AND property_data.garden IS TRUE THEN score := score + 4; END IF;
  
  RETURN LEAST(score, max_score);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UPDATE MATCH SCORE FUNCTION (for recalculating matches)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_match_scores()
RETURNS void AS $$
DECLARE
  match_record RECORD;
  property_record properties%ROWTYPE;
  search_record search_profiles%ROWTYPE;
  new_score INTEGER;
BEGIN
  FOR match_record IN SELECT id, property_id, search_profile_id FROM matches LOOP
    SELECT * INTO property_record FROM properties WHERE id = match_record.property_id;
    SELECT * INTO search_record FROM search_profiles WHERE id = match_record.search_profile_id;
    
    new_score := calculate_match_score(property_record, search_record);
    
    UPDATE matches 
    SET match_score = new_score 
    WHERE id = match_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTO-INCREMENT VIEWS COUNT FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1 
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTO-INCREMENT APPLICATIONS COUNT FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_property_applications()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    UPDATE properties 
    SET applications_count = applications_count + 1 
    WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_property_views_trigger ON activity_log;
CREATE TRIGGER increment_property_views_trigger
  AFTER INSERT ON activity_log
  FOR EACH ROW
  WHEN (NEW.action = 'view_property' AND NEW.entity_type = 'property')
  EXECUTE FUNCTION increment_property_views();

DROP TRIGGER IF EXISTS increment_property_applications_trigger ON applications;
CREATE TRIGGER increment_property_applications_trigger
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_applications();

