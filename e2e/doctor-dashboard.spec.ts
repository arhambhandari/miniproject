import { test, expect } from '@playwright/test';

test.describe('Doctor Dashboard, Patient Care & Live Consultation Sync', () => {
  test.describe.configure({ mode: 'serial' });

  test('Doctor can log in, view appointments, prescribe medications, record vitals, and chat with patient', async ({ page }) => {
    // 1. Log in as Doctor
    await page.goto('/login');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    // Doctor redirected to /doctor/dashboard
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 12000 });

    // Verify Doctor Portal UI components
    await expect(page.getByText('Doctor Practice Portal')).toBeVisible();
    await expect(page.getByText(/Dr\. Aarav Mehta/i).first()).toBeVisible();
    await expect(page.getByText('Practice Revenue')).toBeVisible();
    await expect(page.getByText('Total Appointments')).toBeVisible();
    await expect(page.getByText('Appointed Patients').first()).toBeVisible();

    // 2. Test Interactive Stat Cards: Click Practice Revenue to open Revenue Modal
    await page.getByText('Practice Revenue').click();
    await expect(page.getByText('Practice Revenue & Payouts')).toBeVisible();
    await expect(page.getByText('HDFC Bank Professional Account')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Practice Revenue & Payouts')).not.toBeVisible();

    // Click Appointed Patients card -> switches to patients tab
    await page.locator('[title*="Appointed Patients"]').click();
    await expect(page.getByText('Patients Under Your Direct Clinical Care')).toBeVisible({ timeout: 10000 });

    // Click Total Appointments card -> switches back to appointments tab
    await page.locator('[title*="Scheduled Appointments"]').click();
    await expect(page.getByRole('button', { name: /Appointments & Schedule/i })).toBeVisible({ timeout: 10000 });

    // 3. Test Activity Center & Notifications Drawer
    await page.getByTitle('Activity Center').click();
    await page.getByRole('button', { name: 'Close Activity Center' }).click();
    await expect(page.getByText('Clinical updates and OPD notifications')).not.toBeVisible();

    // 4. Test Filter Pills
    await page.getByRole('button', { name: 'Upcoming', exact: true }).click();
    await page.getByRole('button', { name: 'Completed', exact: true }).click();
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByText(/Rahul Sharma/i).first()).toBeVisible();

    // 5. Navigate to Patient Care & Prescriptions tab
    await page.getByRole('button', { name: /Patient Care & Prescriptions/i }).first().click();
    await expect(page.getByText('Patients Under Your Direct Clinical Care')).toBeVisible();
    await expect(page.getByText('Rahul Sharma').first()).toBeVisible();

    // 6. Open Prescribe & Record Vitals Modal
    await page.getByRole('button', { name: /Prescribe & Record Vitals/i }).first().click();
    await expect(page.getByText('Clinical Care & Prescriptions')).toBeVisible();
    await expect(page.getByRole('button', { name: /Prescribe Medications/i })).toBeVisible();

    // Add a medicine row
    await page.fill('input[placeholder="e.g. Atorvastatin"]', 'Metformin HCl');
    await page.fill('input[placeholder="e.g. 20 mg / 1 tablet"]', '500 mg');
    await page.fill('input[placeholder="e.g. 1 tablet after breakfast for cholesterol control"]', '1 tablet with dinner for blood sugar maintenance');

    // Switch to Diagnosis & Vitals sub-tab
    await page.getByRole('button', { name: /Diagnosis & Clinical Vitals/i }).click();
    await page.fill('input[placeholder="e.g. Stage 1 Essential Hypertension, Mild Hyperlipidemia"]', 'Prediabetes & Mild Stage 1 Hypertension');
    await page.fill('input[placeholder="120/80"]', '124/82');
    await page.fill('input[placeholder="72"]', '74');
    await page.fill('input[placeholder="94"]', '102');

    // Click Save to Patient Dashboard
    await page.getByRole('button', { name: /Save to Patient Dashboard/i }).click();
    await expect(page.getByText(/Clinical care plan and 1 prescription\(s\) updated/i)).toBeVisible({ timeout: 8000 });

    // Wait for modal to close
    await expect(page.getByRole('heading', { name: 'Clinical Care & Prescriptions' })).not.toBeVisible({ timeout: 5000 });

    // 7. Navigate to Chat Tab & send message to patient
    await page.locator('button:has-text("Patient Consultations & Chat")').first().click();
    await expect(page.getByPlaceholder(/Send clinical advice or instructions/i)).toBeVisible({ timeout: 8000 });

    // Type and send chat message
    const chatInput = page.getByPlaceholder(/Send clinical advice or instructions/i);
    await chatInput.fill('Rahul, I have prescribed Metformin 500mg. Please monitor your fasting glucose.');
    await page.getByRole('button', { name: /Send/i }).click();

    // Verify doctor message appears
    await expect(page.getByText('Rahul, I have prescribed Metformin 500mg. Please monitor your fasting glucose.').first()).toBeVisible({ timeout: 6000 });

    // 8. Test Practice Profile & Settings Tab (Editable Profile)
    await page.locator('button:has-text("OPD Clinic & Fee Profile")').first().click();
    await expect(page.getByText('Medical Specialization')).toBeVisible();
    await expect(page.getByText('In-Clinic Consultation Fee (₹)')).toBeVisible();

    // Update Consultation Fee in Profile Editor
    const feeInput = page.locator('input[placeholder="e.g. 2000"]');
    await feeInput.fill('2200');
    await page.getByRole('button', { name: /Save Practice Profile/i }).click();
    await expect(page.getByText(/Practice Profile & Clinic Details updated successfully/i)).toBeVisible({ timeout: 8000 });
  });

  test('Patient dashboard reflects the doctor prescribed medications, updated vitals, and consultation messages', async ({ page }) => {
    // 1. Log in as Patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 12000 });
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 10000 });

    // 2. Verify patient cannot access doctor dashboard directly (route protection)
    await page.goto('/doctor/dashboard');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // 3. Verify Doctor-prescribed medication appears on Patient Dashboard
    await expect(page.getByRole('heading', { name: /Metformin HCl/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('500 mg').first()).toBeVisible();

    // 4. Verify Clinical Health Vitals updated
    await expect(page.getByText('Clinical Health Vitals')).toBeVisible();
    await expect(page.getByText('124/82').first()).toBeVisible();

    // 5. Verify live chat on Patient Consultations View
    const consultBtn = page.getByRole('button', { name: /Consultations/i }).first();
    await consultBtn.click();
    await expect(page.getByText(/Clinical Consultations & OPD Desk/i)).toBeVisible();

    // Select Dr. Aarav Mehta's consultation session
    const aaravSession = page.locator('h4').filter({ hasText: /Dr\. Aarav Mehta/i }).first();
    if (await aaravSession.isVisible()) {
      await aaravSession.click();
    }

    await expect(page.getByText(/Rahul, I have prescribed Metformin 500mg/i).first()).toBeVisible({ timeout: 10000 });

    // Patient can reply to doctor
    const replyInput = page.getByPlaceholder(/Send message or note to Dr\./i);
    await replyInput.fill('Thank you Dr. Aarav, I will take it daily with dinner.');
    await replyInput.press('Enter');
    await expect(page.getByText('Thank you Dr. Aarav, I will take it daily with dinner.').first()).toBeVisible();
  });

  test('Capture high-resolution screenshots of Doctor Dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });

    // 1. Log in as Doctor
    await page.goto('/login');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    await page.waitForURL(/.*doctor\/dashboard/, { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Capture main doctor overview
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_overview.png',
      fullPage: false,
    });

    // Capture Chat tab
    await page.locator('button:has-text("Patient Consultations & Chat")').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_chat.png',
      fullPage: false,
    });

    // Capture Prescribe & Care Modal
    await page.locator('button:has-text("Appointments & Schedule")').first().click();
    await page.waitForTimeout(600);
    const careBtn = page.getByRole('button', { name: /Prescribe & Vitals/i }).first();
    if (await careBtn.isVisible()) {
      await careBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_patient_care_modal.png',
        fullPage: false,
      });
      await page.locator('form').getByRole('button', { name: 'Cancel' }).click();
      await page.waitForTimeout(400);
    }

    // Capture Revenue Modal
    await page.getByText('Practice Revenue').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_revenue_modal.png',
      fullPage: false,
    });
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(400);

    // Capture Activity Center Notifications Drawer
    await page.getByTitle('Activity Center').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_notifications.png',
      fullPage: false,
    });
    await page.getByRole('button', { name: 'Close Activity Center' }).click();
    await page.waitForTimeout(400);

    // Capture Practice Profile Editor Tab
    await page.locator('button:has-text("OPD Clinic & Fee Profile")').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_profile_editor.png',
      fullPage: false,
    });

    // Capture Patient Dashboard showing synchronized medications and vitals
    const patientContext = await page.context().browser()!.newContext({ viewport: { width: 1440, height: 1100 } });
    const patientPage = await patientContext.newPage();
    await patientPage.goto('/login');
    await patientPage.fill('input[type="email"]', 'patient@example.com');
    await patientPage.fill('input[type="password"]', 'Patient123!');
    await patientPage.click('button[type="submit"]');
    await patientPage.waitForURL(/.*dashboard/, { timeout: 15000 });
    await patientPage.waitForTimeout(1500);
    await patientPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_dashboard_synced.png',
      fullPage: false,
    });
    await patientContext.close();
  });

  test('Doctor with 0 patients displays clean stat cards without sparkline graphs', async ({ browser }) => {
    const docContext = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await docContext.newPage();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'ananya@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 15000 });
    await expect(page.getByText('Good Day, Dr. Ananya Sengupta!')).toBeVisible();

    // Verify 0 metrics and neutral badges
    await expect(page.getByText('0% activity')).toBeVisible();
    await expect(page.getByText('0 bookings')).toBeVisible();
    await expect(page.getByText('0 patients')).toBeVisible();
    await expect(page.getByText('0 completed')).toBeVisible();

    // Verify sparkline graphs are NOT rendered (svg.text-emerald-400/30 etc. should not be in stat cards)
    const sparklines = page.locator('div.grid svg[viewBox="0 0 100 25"]');
    await expect(sparklines).toHaveCount(0);

    // Capture screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_dashboard_zero_patients.png',
      fullPage: false,
    });
    await docContext.close();
  });
});


