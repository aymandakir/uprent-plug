import "dotenv/config";
import { FundaScraper } from "./scrapers/funda";
import { ParariusScraper } from "./scrapers/pararius";
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null
});

const scrapingQueue = new Queue("scraping-jobs", { connection });

const scrapers = {
  funda: new FundaScraper(),
  pararius: new ParariusScraper()
};

const worker = new Worker(
  "scraping-jobs",
  async (job) => {
    const { scraper, city, maxPages } = job.data;

    console.log(`[Worker] Processing ${scraper} for ${city}`);

    const scraperInstance = scrapers[scraper as keyof typeof scrapers];
    if (!scraperInstance) {
      throw new Error(`Unknown scraper: ${scraper}`);
    }

    const listings = await scraperInstance.scrapeListings({ city, maxPages });

    let savedCount = 0;
    for (const listing of listings) {
      const id = await scraperInstance.saveListing(listing);
      if (id) savedCount++;
    }

    console.log(`[Worker] ${scraper}: Found ${listings.length}, saved ${savedCount}`);

    return { found: listings.length, saved: savedCount };
  },
  { connection, concurrency: 2 }
);

worker.on("completed", (job) => {
  console.log(`[Queue] Job ${job.id} completed:`, job.returnvalue);
});

worker.on("failed", (job, err) => {
  console.error(`[Queue] Job ${job?.id} failed:`, err);
});

async function scheduleJobs() {
  const cities = ["amsterdam", "rotterdam", "utrecht", "den-haag", "eindhoven"];

  for (const scraper of Object.keys(scrapers)) {
    for (const city of cities) {
      await scrapingQueue.add(
        `${scraper}-${city}`,
        { scraper, city, maxPages: 3 },
        {
          repeat: {
            every: 15 * 60 * 1000
          },
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000
          }
        }
      );
    }
  }

  console.log("[Scheduler] Jobs scheduled for all cities");
}

scheduleJobs().catch(console.error);

console.log("[Scraper] Service started. Listening for jobs...");

