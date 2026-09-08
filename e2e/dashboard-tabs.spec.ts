import { test, expect } from '@playwright/test';

test.describe('Dashboard Tabs & Settings', () => {
  test('Notifications and Settings tabs work properly in Dashboard', async ({ page }) => {
    // 1. Log in with seeded patient account
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Wait for Dashboard welcome greeting to render
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 10000 });

    // 2. Test Notifications button in sidebar
    const notifBtn = page.getByRole('button', { name: 'Notifications' }).first();
    await notifBtn.click();

    // Verify Notifications view loaded
    await expect(page.getByText('Notifications & Activity Center')).toBeVisible();
    await expect(page.getByText(/Upcoming In-Clinic Consultation/i)).toBeVisible();

    // 3. Test Settings button in sidebar
    const settingsBtn = page.getByRole('button', { name: 'Settings' }).first();
    await settingsBtn.click();

    // Verify Settings view loaded with rich patient details
    await expect(page.getByText('Account Settings')).toBeVisible();
    await expect(page.getByText('Patient Profile')).toBeVisible();

    // Switch to Payments & Billing tab inside Settings
    await page.getByRole('button', { name: /Payments & Billing/i }).click();
    await expect(page.getByText('Payment Methods & Invoices')).toBeVisible();
    await expect(page.getByText(/Razorpay Instant UPI & Cards/i)).toBeVisible();

    // 4. Return back to dashboard overview
    await page.getByRole('button', { name: /Back to Dashboard/i }).click();
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible();
  });

  test('Clinical Hospital features (Live Queue, Medication Tracker, OPD E-Pass) work properly', async ({ page }) => {
    // 1. Log in with seeded patient account
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 10000 });

    // 2. Verify Live OPD Queue Tracker is visible
    await expect(page.getByText('Live Hospital OPD Queue Tracker')).toBeVisible();
    await expect(page.getByText('Chamber 304').first()).toBeVisible();

    // 3. Verify Patient Vitals Card & Daily Medication Tracker
    await expect(page.getByText('Clinical Health Vitals')).toBeVisible();
    await expect(page.getByText('Medications & Daily Adherence')).toBeVisible();

    // 4. Test Medication Dose interaction
    const takeDoseButton = page.getByRole('button', { name: /Take Now/i }).first();
    await expect(takeDoseButton).toBeVisible();
    await takeDoseButton.click();
    await expect(page.getByText(/Marked .* as taken/i).first()).toBeVisible();

    // 5. Test Digital OPD E-Pass modal
    const epassButton = page.getByRole('button', { name: /Digital E-Pass/i }).first();
    await expect(epassButton).toBeVisible();
    await epassButton.click();

    // Verify modal is open
    await expect(page.getByText('Hospital OPD Entry & Token Pass')).toBeVisible();
    await expect(page.getByText('Official E-Pass')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Close pass' }).click();
    await expect(page.getByText('Hospital OPD Entry & Token Pass')).not.toBeVisible();
  });
});

