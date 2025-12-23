import puppeteer, { Browser } from "puppeteer";
import { supabaseAdmin } from "@rentfusion/database";
import { propertyMatcher } from "@rentfusion/notifications";

export interface ScraperConfig {
  source: string;
  baseUrl: string;
  rateLimit: number; // ms between requests
  useProxy: boolean;
  retryAttempts: number;
}

export interface ScrapedListing {
  externalId: string;
  sourceUrl: string;
  title: string;
  description?: string;
  city: string;
  neighborhood?: string;
  price: number;
  bedrooms?: number;
  squareMeters?: number;
  photos?: string[];
  coordinates?: { lat: number; lng: number };
  availableFrom?: Date;
  landlordType?: "private" | "agency" | "corporation";
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;
  applicationUrl?: string;
  furnished?: boolean;
  petsAllowed?: boolean;
  studentsAllowed?: boolean;
  propertyType?: "apartment" | "studio" | "house" | "room";
}

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu"
      ]
    });
    console.log(`[${this.config.source}] Browser initialized`);
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  abstract scrapeListings(searchParams?: Record<string, any>): Promise<ScrapedListing[]>;

  async saveListing(listing: ScrapedListing): Promise<string | null> {
    try {
      const { data: existing } = await supabaseAdmin
        .from("properties")
        .select("id, price, photos, is_active")
        .eq("source", this.config.source)
        .eq("external_id", listing.externalId)
        .single();

      if (existing) {
        const priceChanged = existing.price !== listing.price;
        const photosChanged = JSON.stringify(existing.photos) !== JSON.stringify(listing.photos);

        if (priceChanged || photosChanged || !existing.is_active) {
          await supabaseAdmin
            .from("properties")
            .update({
              price: listing.price,
              photos: listing.photos,
              is_active: true,
              last_checked_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);

          console.log(`[${this.config.source}] Updated: ${listing.title}`);
          return existing.id as string;
        }

        return existing.id as string;
      }

      const { data: newProperty, error } = await supabaseAdmin
        .from("properties")
        .insert({
          external_id: listing.externalId,
          source: this.config.source,
          source_url: listing.sourceUrl,
          title: listing.title,
          description: listing.description,
          city: listing.city,
          neighborhood: listing.neighborhood,
          price: listing.price,
          bedrooms: listing.bedrooms,
          square_meters: listing.squareMeters,
          photos: listing.photos,
          coordinates: listing.coordinates
            ? `POINT(${listing.coordinates.lng} ${listing.coordinates.lat})`
            : null,
          available_from: listing.availableFrom,
          landlord_type: listing.landlordType,
          landlord_name: listing.landlordName,
          landlord_email: listing.landlordEmail,
          landlord_phone: listing.landlordPhone,
          application_url: listing.applicationUrl,
          furnished: listing.furnished,
          pets_allowed: listing.petsAllowed,
          students_allowed: listing.studentsAllowed,
          property_type: listing.propertyType,
          is_active: true,
          scraped_at: new Date().toISOString()
        })
        .select("*")
        .single();

      if (error) throw error;

      console.log(`[${this.config.source}] New listing: ${listing.title}`);

      // Fire-and-forget property matching to keep ingestion fast
      if (newProperty?.id) {
        propertyMatcher
          .matchProperty(newProperty as any)
          .catch((err) => console.error("[Matcher] error:", err));
      }

      return newProperty.id as string;
    } catch (error) {
      console.error(`[${this.config.source}] Save error:`, error);
      return null;
    }
  }

  protected async randomDelay(min = 1000, max = 3000): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  protected async retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T | null> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < maxRetries - 1) {
          await this.randomDelay(2000, 5000);
        }
      }
    }
    return null;
  }
}

