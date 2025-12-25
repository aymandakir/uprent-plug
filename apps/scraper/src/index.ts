// Load environment variables FIRST before any other imports
import 'dotenv/config';

import { supabase } from './lib/supabase';
import { FundaScraper } from './scrapers/funda-scraper';
import { findMatches } from './matcher';
import { sendNotifications } from './notifier';

async function main() {
  console.log('[Scraper] Starting...');
  
  const scraper = new FundaScraper();
  
  // For MVP, scrape these cities
  const cities = ['amsterdam', 'rotterdam', 'utrecht', 'den-haag'];
  
  try {
    // Scrape properties
    const properties = await scraper.scrape(cities);
    console.log(`[Scraper] Found ${properties.length} properties`);
    
    let newCount = 0;
    let updatedCount = 0;
    
    // Insert into database
    for (const prop of properties) {
      const { data, error } = await supabase.rpc('upsert_property', {
        p_source: prop.source,
        p_external_id: prop.externalId,
        p_url: prop.url,
        p_title: prop.title,
        p_city: prop.city,
        p_price: prop.price,
        p_bedrooms: prop.bedrooms,
        p_area_sqm: prop.areaSqm,
        p_furnished: prop.furnished,
        p_description: prop.description,
        p_photos: prop.photos,
        p_available_from: prop.availableFrom,
        p_landlord_name: prop.landlordName,
        p_landlord_email: prop.landlordEmail,
      });

      if (error) {
        console.error('[Scraper] Error upserting property:', error);
        continue;
      }

      const propertyId = data;
      
      // Find matches for this property
      const matches = await findMatches(propertyId);
      
      // Send notifications for each match
      for (const match of matches) {
        await sendNotifications(match.id);
      }
      
      newCount++;
    }
    
    console.log(`[Scraper] Finished. New: ${newCount}, Updated: ${updatedCount}`);
  } catch (error) {
    console.error('[Scraper] Fatal error:', error);
    throw error;
  }
}

// Execute main function (tsx will run this file directly)
main().catch((error) => {
  console.error('[Scraper] Unhandled error:', error);
  process.exit(1);
});

export { main };