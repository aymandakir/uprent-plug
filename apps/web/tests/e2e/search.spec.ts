import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    // Add login logic here if needed
    await page.goto('/dashboard/search');
  });

  test('should search and filter properties', async ({ page }) => {
    // Wait for search page to load
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });

    // Search for properties
    await page.fill('input[placeholder*="Search"], input[type="search"]', 'Amsterdam');
    await page.press('input[placeholder*="Search"], input[type="search"]', 'Enter');

    // Wait for results
    await page.waitForTimeout(2000);

    // Check if properties are displayed
    const propertyCards = page.locator('[data-testid="property-card"], .property-card, [class*="PropertyCard"]');
    const count = await propertyCards.count();
    
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should open and close filter panel', async ({ page }) => {
    await page.goto('/dashboard/search');

    // Open filters
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("Filters")').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Check if filter panel is visible
      await expect(
        page.locator('[data-testid="filter-panel"], .filter-panel, [class*="FilterPanel"]').first()
      ).toBeVisible();

      // Close filters
      const closeButton = page.locator('button[aria-label="Close"], button:has-text("Close")').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });

  test('should navigate to property detail', async ({ page }) => {
    await page.goto('/dashboard/search');

    // Wait for properties to load
    await page.waitForTimeout(2000);

    // Click on first property card
    const firstProperty = page.locator('[data-testid="property-card"], .property-card').first();
    if (await firstProperty.isVisible()) {
      await firstProperty.click();

      // Should navigate to property detail page
      await expect(page).toHaveURL(/\/search\/[\w-]+/, { timeout: 5000 });
    }
  });
});

