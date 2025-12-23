import { BaseScraper, ScrapedListing } from "../utils/base-scraper";
import * as cheerio from "cheerio";

export class FundaScraper extends BaseScraper {
  constructor() {
    super({
      source: "funda",
      baseUrl: "https://www.funda.nl",
      rateLimit: 2000,
      useProxy: false,
      retryAttempts: 3
    });
  }

  async scrapeListings(searchParams?: { city?: string; maxPages?: number }): Promise<ScrapedListing[]> {
    const city = searchParams?.city || "amsterdam";
    const maxPages = searchParams?.maxPages || 5;
    const listings: ScrapedListing[] = [];

    if (!this.browser) await this.initialize();
    const page = await this.browser!.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    try {
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const url = `${this.config.baseUrl}/huur/${city}/p${pageNum}/`;
        console.log(`[Funda] Scraping page ${pageNum}: ${url}`);

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        await this.randomDelay(1500, 3000);

        const html = await page.content();
        const $ = cheerio.load(html);

        const propertyCards = $('[data-test-id="search-result-item"]');

        if (propertyCards.length === 0) {
          console.log(`[Funda] No listings found on page ${pageNum}`);
          break;
        }

        for (const card of propertyCards.toArray()) {
          const $card = $(card);
          try {
            const title = $card.find("h2").text().trim();
            const priceText = $card.find('[data-test-id="price-rent"]').text().trim();
            const price = parseInt(priceText.replace(/[^\d]/g, ""), 10);
            const link = $card.find("a").attr("href");
            const fullUrl = link?.startsWith("http") ? link : `${this.config.baseUrl}${link}`;
            const externalId = link?.split("/").filter(Boolean).pop() || "";

            const locationMatch = link?.match(/\/huur\/([^/]+)\//);
            const location = locationMatch?.[1] || city;

            const imageUrl = $card.find("img").attr("src");

            listings.push({
              externalId,
              sourceUrl: fullUrl || "",
              title,
              city: location,
              price,
              photos: imageUrl ? [imageUrl] : [],
              propertyType: this.detectPropertyType(title)
            });
          } catch (error) {
            console.error("[Funda] Error parsing card:", error);
          }
        }

        console.log(`[Funda] Found ${propertyCards.length} listings on page ${pageNum}`);
      }
    } finally {
      await page.close();
    }

    return listings;
  }

  private detectPropertyType(title: string): "apartment" | "studio" | "house" | "room" {
    const lower = title.toLowerCase();
    if (lower.includes("studio")) return "studio";
    if (lower.includes("kamer") || lower.includes("room")) return "room";
    if (lower.includes("huis") || lower.includes("house")) return "house";
    return "apartment";
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new FundaScraper();

  (async () => {
    try {
      console.log("Starting Funda scraper...");
      const listings = await scraper.scrapeListings({ city: "amsterdam", maxPages: 3 });
      console.log(`Found ${listings.length} listings`);

      for (const listing of listings) {
        await scraper.saveListing(listing);
      }

      console.log("Scraping complete!");
    } catch (error) {
      console.error("Scraping failed:", error);
    } finally {
      await scraper.cleanup();
      process.exit(0);
    }
  })();
}

