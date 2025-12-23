import "dotenv/config";
import { FundaScraper } from "./scrapers/funda";
import { ParariusScraper } from "./scrapers/pararius";

const CITIES = ["amsterdam", "rotterdam", "utrecht"];

async function runAllScrapers() {
  const scrapers = [new FundaScraper(), new ParariusScraper()];

  for (const scraper of scrapers) {
    for (const city of CITIES) {
      console.log(`\n=== Running ${scraper.constructor.name} for ${city} ===`);

      try {
        const listings = await scraper.scrapeListings({ city, maxPages: 2 });

        let saved = 0;
        for (const listing of listings) {
          const id = await scraper.saveListing(listing);
          if (id) saved++;
        }

        console.log(`✓ Found: ${listings.length}, Saved: ${saved}`);
      } catch (error) {
        console.error("✗ Error:", error);
      } finally {
        await scraper.cleanup();
      }
    }
  }

  console.log("\n=== All scrapers complete ===");
  process.exit(0);
}

runAllScrapers();

