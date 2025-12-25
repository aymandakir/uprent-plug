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
      // Set user agent to avoid bot detection
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Funda URL format: https://www.funda.nl/huur/amsterdam/
      const url = `https://www.funda.nl/huur/${city.toLowerCase()}/`;
      this.log(`Navigating to: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for dynamic content (waitForTimeout was removed in newer Puppeteer)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if page loaded successfully
      const pageTitle = await page.title();
      this.log(`Page title: ${pageTitle}`);

      // Try multiple selector strategies
      let listings: any[] = [];
      
      // Strategy 1: Try data-test-id selectors
      try {
        const cards = await page.$$('[data-test-id="search-result-item"]');
        this.log(`Found ${cards.length} cards with data-test-id selector`);
        
        if (cards.length > 0) {
          listings = await page.$$eval('[data-test-id="search-result-item"]', (cards: any[]) => {
            return cards.slice(0, 10).map((card: any) => {
              const link = card.querySelector('a[data-test-id="object-image-link"]');
              const priceEl = card.querySelector('[data-test-id="price-rent"]');
              const addressEl = card.querySelector('[data-test-id="street-name"]');
              const cityEl = card.querySelector('[data-test-id="city"]');

              return {
                url: link ? 'https://www.funda.nl' + link.getAttribute('href') : '',
                externalId: link ? link.getAttribute('href').split('/').filter(Boolean).pop() : '',
                title: addressEl?.textContent?.trim() || '',
                city: cityEl?.textContent?.trim() || '',
                price: priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, '')) : 0,
              };
            });
          });
        }
      } catch (error) {
        this.log(`Strategy 1 failed: ${error}`);
      }

      // Strategy 2: Try alternative selectors if first failed
      if (listings.length === 0) {
        try {
          const altCards = await page.$$('.search-result');
          this.log(`Found ${altCards.length} cards with .search-result selector`);
          
          if (altCards.length > 0) {
            listings = await page.$$eval('.search-result', (cards: any[]) => {
              return cards.slice(0, 10).map((card: any) => {
                const link = card.querySelector('a[href*="/huur/"]');
                const priceEl = card.querySelector('.search-result-price, [class*="price"]');
                const addressEl = card.querySelector('.search-result-header, h2, h3');

                return {
                  url: link ? (link.getAttribute('href').startsWith('http') ? link.getAttribute('href') : 'https://www.funda.nl' + link.getAttribute('href')) : '',
                  externalId: link ? link.getAttribute('href').split('/').filter(Boolean).pop() : '',
                  title: addressEl?.textContent?.trim() || '',
                  city: '',
                  price: priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, '')) : 0,
                };
              });
            });
          }
        } catch (error) {
          this.log(`Strategy 2 failed: ${error}`);
        }
      }

      // Strategy 3: Try generic property links
      if (listings.length === 0) {
        try {
          const links = await page.$$eval('a[href*="/huur/"]', (links: any[]) => {
            return links.slice(0, 20).map((link: any) => {
              const href = link.getAttribute('href');
              const parent = link.closest('article, div[class*="result"], div[class*="card"]');
              const priceEl = parent?.querySelector('[class*="price"], [class*="rent"]');
              const addressEl = parent?.querySelector('h2, h3, [class*="address"], [class*="title"]');

              return {
                url: href.startsWith('http') ? href : 'https://www.funda.nl' + href,
                externalId: href.split('/').filter(Boolean).pop() || '',
                title: addressEl?.textContent?.trim() || '',
                city: '',
                price: priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, '')) : 0,
              };
            }).filter((item: any) => item.externalId && item.externalId.length > 5);
          });
          
          // Deduplicate by externalId
          const seen = new Set();
          listings = links.filter((item: any) => {
            if (seen.has(item.externalId)) return false;
            seen.add(item.externalId);
            return true;
          });
          
          this.log(`Found ${listings.length} properties with generic selector`);
        } catch (error) {
          this.log(`Strategy 3 failed: ${error}`);
        }
      }

      // Process listings
      for (const listing of listings) {
        if (listing.url && listing.externalId && listing.price > 0) {
          properties.push({
            source: this.source,
            externalId: listing.externalId,
            url: listing.url,
            title: listing.title || `Property in ${city}`,
            city: listing.city || city,
            price: listing.price,
          });
        }
      }

      this.log(`Extracted ${properties.length} valid properties from ${listings.length} listings`);
    } catch (error: any) {
      this.log(`Error scraping ${city}:`, error.message || error);
      // Log full error for debugging
      console.error(`[${this.source}] Full error:`, error);
    } finally {
      await page.close();
    }

    return properties;
  }
}
