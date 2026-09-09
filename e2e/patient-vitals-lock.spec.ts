import { test, expect } from '@playwright/test';

test.describe('Patient Dashboard Blood Pressure Restriction & Doctor-Only Control', () => {
  test('Verify Blood Pressure is locked to Doctor Only in Patient Dashboard, while other vitals can be logged', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Locate Patient Clinical Health Vitals section
    await expect(page.getByText('Clinical Health Vitals')).toBeVisible({ timeout: 10000 });

    // 3. Verify Blood Pressure card has "Doctor Only" badge and Lock icon
    const bpCard = page.getByTestId('vital-card-bp');
    await expect(bpCard).toBeVisible();
    await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();
    await expect(bpCard.getByText('Doctor Only')).toBeVisible();

    // 4. Click on the Blood Pressure tile directly -> should show info toast
    await bpCard.click();
    await expect(page.getByText(/Blood Pressure is a physician-verified clinical vital/i)).toBeVisible();

    // Take screenshot of Patient Vitals Card with Doctor Only badge
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_vitals_doctor_only_badge.png',
    });

    // 5. Click "Log Vitals" button to open Patient Log Daily Wellness Vitals modal
    await page.getByTestId('log-vitals-btn').click();
    await expect(page.getByText('Log Daily Wellness Vitals')).toBeVisible({ timeout: 10000 });

    // 6. Verify the Doctor-Controlled Notice Callout is displayed
    await expect(page.getByText('Blood Pressure is Doctor-Controlled Only')).toBeVisible();
    await expect(page.getByText(/blood pressure must be measured and entered exclusively by your certified doctor/i)).toBeVisible();

    // 7. Verify Blood Pressure input is strictly DISABLED / LOCKED
    const lockedBpInput = page.getByTestId('patient-bp-input-locked');
    await expect(lockedBpInput).toBeVisible();
    await expect(lockedBpInput).toBeDisabled();
    await expect(page.getByText('Locked (Doctor Only)')).toBeVisible();

    // Take screenshot of Log Vitals Modal showing locked BP
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_log_vitals_locked_bp_modal.png',
    });

    // 8. Update editable patient parameters (Heart Rate and Blood Sugar)
    const hrInput = page.getByTestId('patient-hr-input');
    await hrInput.clear();
    await hrInput.fill('78');

    const sugarInput = page.getByTestId('patient-glucose-input');
    await sugarInput.clear();
    await sugarInput.fill('96');

    // 9. Click "Save Daily Vitals"
    await page.getByTestId('patient-save-vitals-btn').click();

    // 10. Verify success toast stating Blood Pressure remains certified by doctor
    await expect(page.getByText(/Daily vitals recorded successfully! Blood pressure remains certified by your doctor/i)).toBeVisible({ timeout: 10000 });

    // 11. Verify updated values on dashboard: Heart Rate is 78, Glucose is 96, BP remains doctor-controlled
    await expect(page.getByTestId('vital-card-pulse').getByText('78')).toBeVisible();
    await expect(page.getByTestId('vital-card-glucose').getByText('96')).toBeVisible();
    await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();

    // Take screenshot after saving home vitals
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_vitals_after_self_log.png',
    });
  });

  test('Doctor can update Blood Pressure in Doctor Dashboard and syncs to Patient Dashboard', async ({ page }) => {
    // 1. Log in as Doctor
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vikramaditya@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 15000 });

    // 2. Click "Patient Care & Prescriptions" tab in doctor dashboard
    await page.getByRole('button', { name: /Patient Care & Prescriptions/i }).first().click();

    // 3. Open Clinical Care modal for Rahul Sharma
    const rahulCard = page.locator('div:has-text("Rahul Sharma")').first();
    await expect(rahulCard).toBeVisible({ timeout: 10000 });
    const careBtn = page.getByRole('button', { name: /Prescribe & Record Vitals/i }).first();
    await careBtn.click();

    // 4. Verify DoctorPatientCareModal opens
    await expect(page.getByText('Clinical Care & Prescriptions')).toBeVisible({ timeout: 10000 });

    // 5. Switch to "Diagnosis & Clinical Vitals" tab
    await page.getByRole('button', { name: /Diagnosis & Clinical Vitals/i }).click();

    // Verify Doctor Only badge is on the Doctor's BP input
    await expect(page.getByTestId('doctor-bp-input')).toBeVisible();

    // Update Blood Pressure to 126/82
    await page.getByTestId('doctor-bp-input').clear();
    await page.getByTestId('doctor-bp-input').fill('126/82');

    // Take screenshot of Doctor modifying Blood Pressure
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_updating_blood_pressure.png',
    });

    // Save to Patient Dashboard
    await page.getByRole('button', { name: /Save to Patient Dashboard/i }).click();
    await expect(page.getByText(/Clinical care plan/i)).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // 6. Clear session cookies and log back in as Patient to verify synced Doctor BP
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 7. Verify Patient sees the newly updated 126/82 from the Doctor
    const bpCard = page.getByTestId('vital-card-bp');
    await expect(bpCard.getByText('126/82')).toBeVisible({ timeout: 10000 });
    await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();

    // Take screenshot of Patient Dashboard showing Doctor-synced 126/82 BP
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_dashboard_synced_doctor_bp.png',
    });
  });

  test('API Security: Patient attempting to POST /api/patient/vitals with bloodPressure is rejected with 403 Forbidden', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Perform API fetch from page context attempting to tamper with bloodPressure
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/patient/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodPressure: '140/90',
          heartRate: '75',
        }),
      });
      return {
        status: res.status,
        data: await res.json(),
      };
    });

    // 3. Verify HTTP 403 Forbidden and Access Denied message
    expect(response.status).toBe(403);
    expect(response.data.error).toContain('Blood pressure is a controlled clinical vital');
    expect(response.data.allowedForRole).toBe('DOCTOR');
  });
});
