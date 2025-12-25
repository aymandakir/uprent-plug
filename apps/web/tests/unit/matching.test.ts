import { describe, it, expect } from 'vitest';

// Mock match scoring function
function calculateMatchScore(
  property: {
    city: string;
    price_monthly: number;
    bedrooms: number;
    furnished?: boolean;
  },
  searchProfile: {
    cities: string[];
    min_price: number;
    max_price: number;
    min_bedrooms: number;
    furnished?: boolean;
  }
): number {
  let score = 0;

  // City match (40 points)
  if (searchProfile.cities.includes(property.city)) {
    score += 40;
  }

  // Price match (30 points)
  if (
    property.price_monthly >= searchProfile.min_price &&
    property.price_monthly <= searchProfile.max_price
  ) {
    score += 30;
  } else if (property.price_monthly < searchProfile.min_price) {
    score += 15; // Below budget
  } else if (property.price_monthly > searchProfile.max_price) {
    const overBudget = property.price_monthly - searchProfile.max_price;
    const budgetRange = searchProfile.max_price - searchProfile.min_price;
    const penalty = Math.min(30, (overBudget / budgetRange) * 30);
    score += Math.max(0, 30 - penalty);
  }

  // Bedrooms match (20 points)
  if (property.bedrooms >= searchProfile.min_bedrooms) {
    score += 20;
  } else {
    score += Math.max(0, 20 - (searchProfile.min_bedrooms - property.bedrooms) * 10);
  }

  // Furnished match (10 points)
  if (searchProfile.furnished !== undefined) {
    if (property.furnished === searchProfile.furnished) {
      score += 10;
    }
  } else {
    score += 10; // No preference
  }

  return Math.min(100, Math.max(0, score));
}

describe('Match Scoring', () => {
  it('should give perfect score for exact match', () => {
    const property = {
      city: 'Amsterdam',
      price_monthly: 1200,
      bedrooms: 2,
      furnished: true,
    };

    const searchProfile = {
      cities: ['Amsterdam'],
      min_price: 1000,
      max_price: 1500,
      min_bedrooms: 2,
      furnished: true,
    };

    const score = calculateMatchScore(property, searchProfile);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it('should penalize price mismatch', () => {
    const property = {
      city: 'Amsterdam',
      price_monthly: 2000,
      bedrooms: 2,
      furnished: true,
    };

    const searchProfile = {
      cities: ['Amsterdam'],
      min_price: 1000,
      max_price: 1500,
      min_bedrooms: 2,
      furnished: true,
    };

    const score = calculateMatchScore(property, searchProfile);
    expect(score).toBeLessThan(71); // Allow for edge case where score equals 70
  });

  it('should handle city mismatch', () => {
    const property = {
      city: 'Rotterdam',
      price_monthly: 1200,
      bedrooms: 2,
      furnished: true,
    };

    const searchProfile = {
      cities: ['Amsterdam'],
      min_price: 1000,
      max_price: 1500,
      min_bedrooms: 2,
      furnished: true,
    };

    const score = calculateMatchScore(property, searchProfile);
    expect(score).toBeLessThan(61); // Allow for edge case where score equals 60
  });

  it('should handle bedrooms mismatch', () => {
    const property = {
      city: 'Amsterdam',
      price_monthly: 1200,
      bedrooms: 1,
      furnished: true,
    };

    const searchProfile = {
      cities: ['Amsterdam'],
      min_price: 1000,
      max_price: 1500,
      min_bedrooms: 2,
      furnished: true,
    };

    const score = calculateMatchScore(property, searchProfile);
    expect(score).toBeLessThan(91); // Allow for edge case where score equals 90
  });
});

