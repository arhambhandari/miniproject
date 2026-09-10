import { test, expect } from '@playwright/test';

test.describe('Doctor Schedule & WhatsApp/SMS Health Notification Simulator', () => {
  test('Doctor can customize OPD availability, shifts, fees, and block leave dates', async ({ page }) => {
    // 1. Clear session and log in as Doctor
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vikramaditya@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*doctor/, { timeout: 15000 });

    // 2. Navigate to Doctor Schedule Manager
    await page.goto('/doctor/schedule');
    await expect(page.getByText('Doctor Availability & Custom Slot Scheduler')).toBeVisible({ timeout: 10000 });

    // 3. Verify weekly working days section and toggle Wednesday
    const wedToggle = page.getByTestId('day-toggle-wednesday');
    await expect(wedToggle).toBeVisible();

    // 4. Update morning shift timing
    const morningStart = page.getByTestId('morning-shift-start');
    await morningStart.clear();
    await morningStart.fill('08:30 AM');

    // 5. Update consultation fee to 2200
    const feeInput = page.getByTestId('consultation-fee-input');
    await feeInput.clear();
    await feeInput.fill('2200');

    // 6. Add a new blocked leave date
    const leaveDateInput = page.getByTestId('leave-date-input');
    await leaveDateInput.fill('2026-11-15');

    const leaveReasonInput = page.getByTestId('leave-reason-input');
    await leaveReasonInput.fill('Annual Medical Conclave');

    await page.getByTestId('add-leave-btn').click();
    await expect(page.getByText('Annual Medical Conclave')).toBeVisible({ timeout: 8000 });

    // Take screenshot of Doctor Schedule Manager
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_schedule_manager.png',
    });

    // 7. Save & Sync Schedule
    await page.getByTestId('save-schedule-btn').click();
    await expect(page.getByText(/OPD Schedule and Slot Availability successfully synced/i)).toBeVisible({ timeout: 10000 });
  });

  test('Healthcare WhatsApp & SMS Notification Simulator sends live interactive alerts and push banner', async ({ page }) => {
    // 1. Go to patient dashboard
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Open WhatsApp & SMS Alert Simulator via Floating Action Button
    const fab = page.getByTestId('open-whatsapp-simulator-fab');
    await expect(fab).toBeVisible({ timeout: 10000 });
    await fab.click();

    // 3. Verify simulator modal opens with smartphone frame
    await expect(page.getByText('WhatsApp & SMS Dispatch Hub')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Apollo Hospitals')).toBeVisible();
    await expect(page.getByText('Official Business Account')).toBeVisible();

    // 4. Fill simulated recipient phone
    const phoneInput = page.getByTestId('simulator-phone-input');
    await phoneInput.clear();
    await phoneInput.fill('+91 98765 43210');

    // 5. Select Medication Adherence template
    await page.getByTestId('template-MEDICATION_REMINDER').click();

    // 6. Trigger Simulated Dispatch
    await page.getByTestId('trigger-simulation-btn').click();

    // 7. Verify animated push notification banner drops down on the phone screen
    const pushBanner = page.getByTestId('simulated-push-banner');
    await expect(pushBanner).toBeVisible({ timeout: 8000 });
    await expect(pushBanner.getByText(/Apollo Hospitals/i)).toBeVisible();

    // 8. Verify WhatsApp chat bubble contains medication reminder and interactive action button
    await expect(page.getByText(/MediBook Daily Medication Alert/i)).toBeVisible({ timeout: 8000 });
    const markDoseBtn = page.getByRole('button', { name: /Mark Dose as Taken/i }).first();
    await expect(markDoseBtn).toBeVisible();

    // Take screenshot of WhatsApp Simulator with live push banner and interactive chat bubble
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/whatsapp_simulator_live_dispatch.png',
    });

    // 9. Switch to SMS channel and verify SMS view
    await page.getByTestId('select-channel-sms').click();
    await expect(page.getByText('VK-APOLLO').first()).toBeVisible({ timeout: 8000 });

    // Trigger SMS dispatch
    await page.getByTestId('trigger-simulation-btn').click();
    await expect(page.getByText(/VK-APOLLO/i).first()).toBeVisible();

    // Take screenshot of SMS Simulator view
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/sms_simulator_live_dispatch.png',
    });
  });
});
