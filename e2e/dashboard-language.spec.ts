import { test, expect } from '@playwright/test';

test.describe('Dashboard Multi-Language Switcher (English / Hindi)', () => {
  test.describe.configure({ mode: 'serial' });

  test('Patient dashboard displays language switcher and translates all widgets between English and Hindi', async ({ page }) => {
    // 1. Log in as seeded patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 12000 });

    // Verify initial English text
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Live Hospital OPD Queue Tracker')).toBeVisible();
    await expect(page.getByText('My Consultations & Visits')).toBeVisible();

    // 2. Locate Language Switcher in the top bar
    const switcher = page.locator('[data-testid="language-select"]');
    await expect(switcher).toBeVisible();

    // 3. Switch language to Hindi ("hi")
    await switcher.selectOption('hi');

    // Verify dynamic Hindi translation across Dashboard components
    // - Welcome greeting
    await expect(page.getByRole('heading', { name: /नमस्ते/i })).toBeVisible({ timeout: 6000 });

    // - Live OPD Queue Tracker title
    await expect(page.getByText('लाइव अस्पताल ओपीडी कतार ट्रैकर')).toBeVisible();

    // - Patient Vitals card header
    await expect(page.getByText('मरीज के स्वास्थ्य आंकड़े')).toBeVisible();

    // - Daily Medication Tracker header
    await expect(page.getByText('दैनिक दवा और खुराक ट्रैकर')).toBeVisible();

    // - Consultations table header
    await expect(page.getByText('मेरे परामर्श और यात्राएं')).toBeVisible();

    // - Right panel calendar
    await expect(page.getByText('मेरा कैलेंडर')).toBeVisible();

    // - Top bar search placeholder
    const searchInput = page.getByPlaceholder('इवेंट, डॉक्टर, अपॉइंटमेंट खोजें...');
    await expect(searchInput).toBeVisible();

    // 4. Test LocalStorage Persistence across Page Refresh
    await page.reload();
    await expect(page.getByRole('heading', { name: /नमस्ते/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('लाइव अस्पताल ओपीडी कतार ट्रैकर')).toBeVisible();

    // 5. Switch back to English ("en")
    const switcherAfterReload = page.locator('[data-testid="language-select"]');
    await switcherAfterReload.selectOption('en');

    // Verify English text returns
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 6000 });
    await expect(page.getByText('Live Hospital OPD Queue Tracker')).toBeVisible();
    await expect(page.getByText('My Consultations & Visits')).toBeVisible();
    await expect(page.getByPlaceholder('Search for events, doctors, appointments...')).toBeVisible();
  });

  test('Doctor dashboard displays language switcher and translates portal headers', async ({ page }) => {
    // 1. Log in as seeded doctor
    await page.goto('/login');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    // Doctor redirected to /doctor/dashboard
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 12000 });

    // Verify initial Doctor portal header in English
    await expect(page.getByText('Doctor Practice Portal')).toBeVisible();

    // Locate Language Switcher in Doctor Top Bar
    const switcher = page.locator('[data-testid="language-select"]');
    await expect(switcher).toBeVisible();

    // Switch to Hindi ("hi")
    await switcher.selectOption('hi');

    // Verify Doctor Practice Portal badge in Hindi
    await expect(page.getByText('डॉक्टर प्रैक्टिस पोर्टल')).toBeVisible({ timeout: 6000 });
    await expect(page.getByPlaceholder('मरीज, नुस्खे, मेडिकल रिकॉर्ड खोजें...')).toBeVisible();

    // Switch back to English
    await switcher.selectOption('en');
    await expect(page.getByText('Doctor Practice Portal')).toBeVisible({ timeout: 6000 });
  });
});
