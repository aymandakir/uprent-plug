import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should register new user successfully', async ({ page }) => {
    await page.goto('/');

    // Navigate to registration
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/\/register/);

    // Fill registration form
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="fullName"]', 'Test User');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10000 });
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/register');

    // Try to submit without filling form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/email/i')).toBeVisible();
    await expect(page.locator('text=/password/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="fullName"]', 'Test User');

    await page.click('button[type="submit"]');

    // Should show email validation error
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });
});

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/invalid/i')).toBeVisible({ timeout: 5000 });
  });
});

