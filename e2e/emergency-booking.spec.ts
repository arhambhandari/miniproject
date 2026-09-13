import { test, expect } from '@playwright/test';

test.describe('Emergency Fast-Track Booking & Priority Queue Handoff', () => {
  test('Patient books emergency admission from Dashboard SOS, receives Priority Token #EM-01, and doctor chamber console alerts', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await Promise.all([
      page.waitForURL(/.*dashboard/, { timeout: 30000 }),
      page.click('button[type="submit"]'),
    ]);

    // 2. Locate the Emergency SOS button on the Triage Banner
    const openEmergencyBtn = page.getByTestId('open-emergency-modal-btn');
    await expect(openEmergencyBtn).toBeVisible({ timeout: 10000 });
    await openEmergencyBtn.click();

    // 3. Verify Emergency Booking Modal opens with EHR alert and hotlines
    await expect(page.getByText('Emergency Priority Admission')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('EMERGENCY FAST-TRACK')).toBeVisible();
    await expect(page.getByText(/Patient EHR Synced Alerts/i)).toBeVisible();
    await expect(page.getByRole('strong').filter({ hasText: 'Penicillin, Sulfa' })).toBeVisible();

    // Verify emergency reason input is populated
    const reasonInput = page.getByTestId('emergency-reason-input');
    await expect(reasonInput).toBeVisible();

    // 4. Confirm Fast-Track Emergency Admission
    const confirmBtn = page.getByTestId('confirm-emergency-booking-btn');
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // 5. Verify Success Screen with Priority Token
    await expect(page.getByText('Emergency Admission Confirmed!')).toBeVisible({ timeout: 15000 });
    const tokenBadge = page.getByTestId('emergency-confirmed-token-badge');
    await expect(tokenBadge).toBeVisible();
    await expect(tokenBadge).toContainText('Token #EM-');

    // Capture screenshot of confirmed emergency admission modal
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_emergency_booking_confirmed.png',
    });

    // Close modal to return to dashboard
    const closeBtn = page.getByTestId('emergency-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // 6. Test Doctor Chamber Console Live Emergency Alert in an isolated context
    const doctorContext = await page.context().browser()!.newContext();
    const doctorPage = await doctorContext.newPage();
    await doctorPage.goto('/login');
    await doctorPage.waitForLoadState('networkidle');
    await doctorPage.fill('input[type="email"]', 'vikramaditya@example.com');
    await doctorPage.fill('input[type="password"]', 'Doctor123!');
    await Promise.all([
      doctorPage.waitForURL(/.*doctor.*dashboard/, { timeout: 30000 }),
      doctorPage.click('button[type="submit"]'),
    ]);

    // Locate the emergency alert banner on Doctor Console
    const docEmergencyBanner = doctorPage.getByTestId('doctor-emergency-alert-banner');
    await expect(docEmergencyBanner).toBeVisible({ timeout: 10000 });
    await expect(docEmergencyBanner).toContainText(/Emergency Fast-Track Patient Waiting/i);
    await expect(docEmergencyBanner).toContainText('Token #EM-');

    // Verify "Call Emergency Now" button exists on Doctor console
    const callEmergencyBtn = doctorPage.getByTestId('doctor-call-emergency-btn');
    await expect(callEmergencyBtn).toBeVisible();

    // Scroll banner into view and capture screenshot of Doctor Chamber Console displaying emergency alert
    await docEmergencyBanner.scrollIntoViewIfNeeded();
    await doctorPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_emergency_alert_console.png',
    });

    await doctorContext.close();
  });

  test('Pre-Triage acute red-flag evaluation directly triggers pre-filled Emergency Booking Modal', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await Promise.all([
      page.waitForURL(/.*dashboard/, { timeout: 30000 }),
      page.click('button[type="submit"]'),
    ]);

    // 2. Open Symptom Pre-Triage
    const openTriageBtn = page.getByTestId('open-triage-modal-btn');
    await expect(openTriageBtn).toBeVisible({ timeout: 10000 });
    await openTriageBtn.click();

    // 3. Select acute cardiac red flags
    await page.getByTestId('symptom-chip-chest_pain').click();
    await page.getByTestId('symptom-chip-breathlessness_exertion').click();
    await page.getByTestId('triage-next-step-btn').click();

    // 4. Select Severe Acute Impact
    await page.getByTestId('duration-btn-<24h').click();
    await page.getByTestId('severity-btn-SEVERE').click();
    await page.getByTestId('analyze-symptoms-btn').click();

    // 5. Verify Step 3 displays the Emergency Booking button in the warning banner
    await expect(page.getByText('Emergency Clinical Warning')).toBeVisible({ timeout: 15000 });
    const triageEmergencyBtn = page.getByTestId('triage-emergency-booking-btn');
    await expect(triageEmergencyBtn).toBeVisible();
    await triageEmergencyBtn.click();

    // 6. Verify Emergency Booking Modal opens with pre-filled clinical summary
    await expect(page.getByText('Emergency Priority Admission')).toBeVisible({ timeout: 8000 });
    const reasonInput = page.getByTestId('emergency-reason-input');
    await expect(reasonInput).toBeVisible();
    const reasonVal = await reasonInput.inputValue();
    expect(reasonVal).toContain('Cardiology & Emergency Medicine');

    // Capture screenshot of pre-filled emergency booking from triage
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_triage_emergency_modal_prefilled.png',
    });
  });
});
