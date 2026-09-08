import { test, expect } from '@playwright/test';

test('Doctors API returns seeded doctors from database', async ({ request }) => {
  const response = await request.get('/api/doctors');
  expect(response.ok()).toBeTruthy();
  const doctors = await response.json();
  expect(Array.isArray(doctors)).toBeTruthy();
  expect(doctors.length).toBeGreaterThanOrEqual(6);

  const aarav = doctors.find((d: any) => d.user.name.includes("Aarav Mehta"));
  expect(aarav).toBeDefined();
  expect(aarav.specialization).toBe("NEURO-ONCOLOGY");
  expect(aarav.fee).toBeGreaterThanOrEqual(2000);
});

test('Homepage renders doctor cards from database', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Dr. Aarav Mehta')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Dr. Vikramaditya Rathore')).toBeVisible({ timeout: 15000 });
});

test('Clicking View All in doctors section navigates to /doctors directory', async ({ page }) => {
  await page.goto('/');
  const viewAllBtn = page.getByRole('link', { name: /View All/i }).first();
  await expect(viewAllBtn).toBeVisible({ timeout: 15000 });
  await viewAllBtn.click();
  await page.waitForURL('**/doctors');
  await expect(page.getByText('Browse All Doctors')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Dr. Aarav Mehta')).toBeVisible({ timeout: 15000 });
});

