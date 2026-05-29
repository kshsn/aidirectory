import { test, expect } from '@playwright/test';

// Critical user flow 2: Tool discovery → detail page → affiliate click
test.describe('Tool Detail Page', () => {
  test('search returns results', async ({ page }) => {
    await page.goto('/en/search?q=chatgpt');
    await expect(page.locator('text=ChatGPT')).toBeVisible({ timeout: 10000 });
  });

  test('tool detail page loads with required elements', async ({ page }) => {
    await page.goto('/en/tools/chatgpt');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href*="/api/redirect/"]')).toBeVisible();
    await expect(page.locator('text=Visit ChatGPT')).toBeVisible();
  });

  test('tool page renders in Arabic with RTL', async ({ page }) => {
    await page.goto('/ar/tools/chatgpt');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('invalid tool slug returns 404', async ({ page }) => {
    const response = await page.goto('/en/tools/this-tool-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
  });

  test('affiliate CTA opens in new tab via redirect API', async ({ page }) => {
    await page.goto('/en/tools/chatgpt');
    const ctaLinks = page.locator('a[href*="/api/redirect/"]');
    await expect(ctaLinks.first()).toHaveAttribute('target', '_blank');
  });
});
