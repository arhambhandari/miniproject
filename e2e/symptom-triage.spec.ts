import { test, expect } from '@playwright/test';

test.describe('Smart Symptom Pre-Triage & Department Recommender', () => {
  test('Patient navigates through 3-step triage wizard, receives Cardiology recommendation, and opens pre-filled booking modal', async ({ page }) => {
    // 1. Clear session and log in as patient
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Locate the AI Clinical Pre-Triage floating banner
    const openTriageBtn = page.getByTestId('open-triage-modal-btn');
    await expect(openTriageBtn).toBeVisible({ timeout: 10000 });

    // 3. Open the Triage Modal
    await openTriageBtn.click();
    await expect(page.getByText('AI Clinical Symptom Pre-Triage')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Step 1 of 3')).toBeVisible();

    // 4. Select Cardiac symptoms in Step 1
    const chestPainChip = page.getByTestId('symptom-chip-chest_pain');
    await expect(chestPainChip).toBeVisible();
    await chestPainChip.click();

    const breathlessnessChip = page.getByTestId('symptom-chip-breathlessness_exertion');
    await expect(breathlessnessChip).toBeVisible();
    await breathlessnessChip.click();

    // 5. Click Next to go to Step 2
    const nextStepBtn = page.getByTestId('triage-next-step-btn');
    await expect(nextStepBtn).toBeEnabled();
    await nextStepBtn.click();

    // 6. Verify Step 2 (Duration & Severity)
    await expect(page.getByText('Step 2 of 3')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/How long have these symptoms persisted/i)).toBeVisible();

    // Select Duration: 1 to 3 Days
    const durationBtn = page.getByTestId('duration-btn-1-3days');
    await expect(durationBtn).toBeVisible();
    await durationBtn.click();

    // Select Severity: Moderate Impact
    const severityBtn = page.getByTestId('severity-btn-MODERATE');
    await expect(severityBtn).toBeVisible();
    await severityBtn.click();

    // 7. Click Analyze Clinical Symptoms
    const analyzeBtn = page.getByTestId('analyze-symptoms-btn');
    await expect(analyzeBtn).toBeVisible();
    await analyzeBtn.click();

    // 8. Verify Step 3: Clinical Triage Report
    await expect(page.getByText('Step 3 of 3')).toBeVisible({ timeout: 15000 });
    const recommendedDept = page.getByTestId('triage-recommended-department');
    await expect(recommendedDept).toBeVisible();
    await expect(recommendedDept).toHaveText('Cardiology');

    // Verify suggested questions and available specialists
    await expect(page.getByText(/Suggested Questions for your Doctor/i)).toBeVisible();
    await expect(page.getByText(/Available Specialists in Cardiology/i)).toBeVisible();

    // Capture screenshot of clinical triage result report
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_symptom_triage_result.png',
    });

    // 9. Click "Book with Pre-Filled Triage" on the first specialist card
    const bookDoctorBtns = page.getByTestId('triage-book-doctor-btn');
    await expect(bookDoctorBtns.first()).toBeVisible();
    await bookDoctorBtns.first().click();

    // 10. Verify Booking Modal opens with pre-filled chief complaint
    const reasonInput = page.getByTestId('booking-reason-input');
    await expect(reasonInput).toBeVisible({ timeout: 8000 });
    const reasonValue = await reasonInput.inputValue();
    expect(reasonValue).toContain('Cardiology');
    expect(reasonValue).toContain('Chest Pain / Tightness');

    // Capture screenshot of pre-filled booking modal
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_triage_booking_modal_prefilled.png',
    });
  });
});
