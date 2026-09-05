import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MediBook/);
  await expect(page.getByText('Find & Book the')).toBeVisible();
});

test('Navigation works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByText('Welcome back')).toBeVisible();
});
