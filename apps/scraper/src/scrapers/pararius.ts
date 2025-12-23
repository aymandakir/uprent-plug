import { BaseScraper, ScrapedListing } from "../utils/base-scraper";
import * as cheerio from "cheerio";

export class ParariusScraper extends BaseScraper {
  constructor() {
    super({
      source: "pararius",
      baseUrl: "https://www.pararius.com",
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
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    try {
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const url = `${this.config.baseUrl}/apartments/${city}/page-${pageNum}`;
        console.log(`[Pararius] Scraping: ${url}`);

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        await this.randomDelay(1500, 3000);

        const html = await page.content();
        const $ = cheerio.load(html);

        const propertyCards = $(".search-list__item");

        if (propertyCards.length === 0) break;

        for (const card of propertyCards.toArray()) {
          const $card = $(card);

          try {
            const title = $card.find(".listing-search-item__title").text().trim();
            const priceText = $card.find(".listing-search-item__price").text().trim();
            const price = parseInt(priceText.replace(/[^\d]/g, ""), 10);
            const link = $card.find(".listing-search-item__link").attr("href");
            const fullUrl = link?.startsWith("http") ? link : `${this.config.baseUrl}${link}`;
            const externalId = link?.split("/").pop() || "";

            const location = $card.find(".listing-search-item__location").text().trim();
            const [neighborhood, cityName] = location.split(",").map((s) => s.trim());

            const specs = $card.find(".illustrated-features__item").text();
            const bedroomsMatch = specs.match(/(\d+)\s*bedroom/);
            const areaMatch = specs.match(/(\d+)\s*m²/);

            const imageUrl = $card.find(".listing-search-item__image img").attr("src");

            listings.push({
              externalId,
              sourceUrl: fullUrl || "",
              title,
              city: cityName || city,
              neighborhood,
              price,
              bedrooms: bedroomsMatch ? parseInt(bedroomsMatch[1], 10) : undefined,
              squareMeters: areaMatch ? parseInt(areaMatch[1], 10) : undefined,
              photos: imageUrl ? [imageUrl] : [],
              landlordType: "agency"
            });
          } catch (error) {
            console.error("[Pararius] Error parsing card:", error);
          }
        }

        console.log(`[Pararius] Found ${propertyCards.length} listings`);
      }
    } finally {
      await page.close();
    }

    return listings;
  }
}

