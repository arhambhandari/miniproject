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

test('Dr. Meenakshi Mohanish Das profile and image render correctly', async ({ page }) => {
  await page.goto('/doctors');
  const docName = page.getByText('meenakshi mohanish das');
  await expect(docName).toBeVisible({ timeout: 15000 });
  const docImg = page.locator('img[src="/images/doctors/dr-meenakshi-mohanish-das.jpg"]');
  await expect(docImg).toBeVisible({ timeout: 10000 });
  await docName.scrollIntoViewIfNeeded();

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/dr_meenakshi_directory_card.png',
  });

  // Navigate to doctor profile
  await page.goto('/doctors/cmu72gphx0003k4s1a52x8twq');
  await expect(page.getByRole('heading', { name: 'meenakshi mohanish das', exact: true })).toBeVisible({ timeout: 15000 });
  const profileImg = page.locator('img[src="/images/doctors/dr-meenakshi-mohanish-das.jpg"]');
  await expect(profileImg).toBeVisible({ timeout: 10000 });

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/dr_meenakshi_profile_verified.png',
  });
});

