import { test, expect } from '@playwright/test';

// Critical user flow 1: Homepage loads and language detection works
test.describe('Homepage', () => {
  test('loads homepage with hero section', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test('shows categories grid', async ({ page }) => {
    await page.goto('/en');
    const categories = page.locator('a[href*="/en/category/"]');
    await expect(categories.first()).toBeVisible();
  });

  test('Arabic locale renders RTL layout', async ({ page }) => {
    await page.goto('/ar');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('language switcher toggles locale', async ({ page }) => {
    await page.goto('/en');
    const switcher = page.locator('button', { hasText: 'English' });
    await switcher.click();
    await page.locator('button', { hasText: 'العربية' }).click();
    await expect(page).toHaveURL(/\/ar/);
  });

  test('search bar navigates to search page', async ({ page }) => {
    await page.goto('/en');
    await page.fill('input[type="search"]', 'writing');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/search\?q=writing/);
  });
});
