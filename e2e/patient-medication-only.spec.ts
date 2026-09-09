import { test, expect } from '@playwright/test';

test.describe('Patient Medication Logging & Clinical Vitals Strict Lock', () => {
  test('Patient dashboard strictly locks all health vitals to doctor-only and enables medication dose logging', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Locate Patient Clinical Health Vitals section
    await expect(page.getByText('Clinical Health Vitals')).toBeVisible({ timeout: 10000 });

    // 3. Verify that the "Log Vitals" button does NOT exist for patients
    const logVitalsBtn = page.getByTestId('log-vitals-btn');
    await expect(logVitalsBtn).toHaveCount(0);

    // 4. Verify "Clinical Vitals (Doctor Recorded Only)" badge is present in header
    const doctorRecordedBadge = page.getByTestId('vitals-doctor-recorded-badge');
    await expect(doctorRecordedBadge).toBeVisible();
    await expect(doctorRecordedBadge).toContainText(/Doctor Recorded Only/i);

    // 5. Verify Blood Pressure card has "Doctor Only" badge with lock icon
    const bpCard = page.getByTestId('vital-card-bp');
    await expect(bpCard).toBeVisible();
    await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();
    await expect(bpCard.getByText('Doctor Only')).toBeVisible();

    // 6. Click on the Blood Pressure tile -> displays clinical locked toast
    await bpCard.click();
    await expect(page.getByText(/Blood Pressure is a physician-verified clinical vital/i)).toBeVisible({ timeout: 8000 });

    // 7. Click on Heart Rate tile -> displays clinical record toast informing that vitals are doctor-recorded
    const pulseCard = page.getByTestId('vital-card-pulse');
    await expect(pulseCard).toBeVisible();
    await pulseCard.click();
    await expect(page.getByText(/Patients can only log their medications/i)).toBeVisible({ timeout: 8000 });

    // Take screenshot showing the locked clinical vitals section
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_vitals_locked_medication_only.png',
    });

    // 8. Locate Daily Medication Tracker section
    await expect(page.getByText(/Medications & Daily Adherence/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Patient Daily Medication Log/i)).toBeVisible();

    // 9. Verify Patient Log Medication Dose button exists and is clickable
    const logMedBtn = page.getByTestId('log-medication-dose-btn');
    await expect(logMedBtn).toBeVisible();
    await logMedBtn.click();

    // 10. Verify Log Medication Intake modal opens
    await expect(page.getByText('Log Medication Intake')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Record your daily dose for adherence tracking/i)).toBeVisible();

    // 11. Enter intake time and note
    const timeInput = page.getByTestId('log-med-time-input');
    await expect(timeInput).toBeVisible();
    await timeInput.clear();
    await timeInput.fill('09:15 PM');

    const noteInput = page.getByTestId('log-med-note-input');
    await expect(noteInput).toBeVisible();
    await noteInput.fill('Taken with water post dinner');

    // Take screenshot of the patient medication logging modal
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_log_medication_modal.png',
    });

    // 12. Submit the dose
    const submitDoseBtn = page.getByTestId('confirm-log-med-btn');
    await submitDoseBtn.click();

    // 13. Verify success toast appears and modal closes
    await expect(page.getByText(/Logged dose for/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Log Medication Intake')).not.toBeVisible();

    // Take screenshot of updated medication tracker with logged dose
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_medication_logged_success.png',
    });
  });

  test('API Security: Patient attempting to POST /api/patient/vitals is rejected with 403 Forbidden', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Attempt to POST vitals to /api/patient/vitals from patient session
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/patient/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heartRate: '80',
          bloodSugar: '95',
          spo2: '98',
        }),
      });
      return {
        status: res.status,
        data: await res.json(),
      };
    });

    // 3. Verify HTTP 403 Forbidden with strict access denied message
    expect(response.status).toBe(403);
    expect(response.data.error).toContain('Clinical health vitals cannot be modified by patients');
    expect(response.data.error).toContain('Patients are only permitted to log their daily medication adherence');
    expect(response.data.allowedForRole).toBe('DOCTOR');
  });
});
