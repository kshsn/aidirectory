import { test, expect } from '@playwright/test';

// Critical user flow 3: Admin authentication and tool management
test.describe('Admin Panel', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('admin/tools redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/tools');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1', { hasText: 'Admin Login' })).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });
});
