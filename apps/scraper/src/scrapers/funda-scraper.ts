import { BaseScraper, Property } from './base-scraper';
import puppeteer from 'puppeteer';

export class FundaScraper extends BaseScraper {
  source = 'funda';

  async scrape(cities: string[]): Promise<Property[]> {
    const allProperties: Property[] = [];
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (const city of cities) {
        this.log(`Scraping ${city}...`);
        const cityProperties = await this.scrapeCity(browser, city);
        allProperties.push(...cityProperties);
        this.log(`Found ${cityProperties.length} properties in ${city}`);
      }
    } finally {
      await browser.close();
    }

    return allProperties;
  }

  private async scrapeCity(browser: any, city: string): Promise<Property[]> {
    const page = await browser.newPage();
    const properties: Property[] = [];

    try {
      // Funda URL format: https://www.funda.nl/huur/amsterdam/
      const url = `https://www.funda.nl/huur/${city.toLowerCase()}/`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract property cards
      const listings = await page.$$eval('[data-test-id="search-result-item"]', (cards: any[]) => {
        return cards.slice(0, 10).map((card: any) => {
          // Limit to 10 for MVP
          const link = card.querySelector('a[data-test-id="object-image-link"]');
          const priceEl = card.querySelector('[data-test-id="price-rent"]');
          const addressEl = card.querySelector('[data-test-id="street-name"]');
          const cityEl = card.querySelector('[data-test-id="city"]');

          return {
            url: link ? 'https://www.funda.nl' + link.getAttribute('href') : '',
            externalId: link ? link.getAttribute('href').split('/').pop() : '',
            title: addressEl?.textContent?.trim() || '',
            city: cityEl?.textContent?.trim() || '',
            price: priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, '')) : 0,
          };
        });
      });

      for (const listing of listings) {
        if (listing.url && listing.externalId) {
          properties.push({
            source: this.source,
            externalId: listing.externalId,
            url: listing.url,
            title: listing.title,
            city: listing.city || city,
            price: listing.price,
          });
        }
      }
    } catch (error) {
      this.log(`Error scraping ${city}:`, error);
    } finally {
      await page.close();
    }

    return properties;
  }
}
