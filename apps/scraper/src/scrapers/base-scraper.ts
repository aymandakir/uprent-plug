export interface Property {
  source: string;
  externalId: string;
  url: string;
  title: string;
  city: string;
  price: number;
  bedrooms?: number;
  areaSqm?: number;
  furnished?: boolean;
  description?: string;
  photos?: string[];
  availableFrom?: string;
  landlordName?: string;
  landlordEmail?: string;
}

export abstract class BaseScraper {
  abstract source: string;
  abstract scrape(cities: string[]): Promise<Property[]>;
  
  log(message: string, data?: any) {
    console.log(`[${this.source}] ${message}`, data || '');
  }
}
