import { test, expect } from '@playwright/test';

test.describe('Real-Time OPD Queue Event Stream (SSE) & Live Doctor Chamber Console', () => {
  test('Doctor advances OPD queue and patient dashboard receives real-time SSE stream updates without refresh', async ({ browser }) => {
    // 1. Reset Queue State via API before test
    const resetContext = await browser.newContext();
    const resetPage = await resetContext.newPage();
    await resetPage.request.post('http://localhost:3000/api/queue/action', {
      data: { action: 'RESET', demo: true },
    });
    await resetContext.close();

    // 2. Patient Context: Login as Patient
    const patientContext = await browser.newContext();
    const patientPage = await patientContext.newPage();
    await patientPage.goto('http://localhost:3000/login');
    await patientPage.fill('input[type="email"]', 'patient@example.com');
    await patientPage.fill('input[type="password"]', 'Patient123!');
    await patientPage.click('button[type="submit"]');
    await expect(patientPage).toHaveURL(/.*dashboard/, { timeout: 20000 });

    // Verify Patient sees initial Live OPD Queue state
    const patientNowServing = patientPage.getByTestId('now-serving-token');
    await expect(patientNowServing).toBeVisible({ timeout: 10000 });
    await expect(patientNowServing).toHaveText('Token #A-06');

    const patientsAhead = patientPage.getByTestId('patients-ahead-count');
    await expect(patientsAhead).toContainText('2');

    // Take screenshot of patient dashboard initial queue state
    await patientPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_live_queue_initial.png',
    });

    // 3. Doctor Context: Login as Doctor
    const doctorContext = await browser.newContext();
    const doctorPage = await doctorContext.newPage();
    await doctorPage.goto('http://localhost:3000/login');
    await doctorPage.fill('input[type="email"]', 'vikramaditya@example.com');
    await doctorPage.fill('input[type="password"]', 'Doctor123!');
    await doctorPage.click('button[type="submit"]');
    await expect(doctorPage).toHaveURL(/.*doctor/, { timeout: 20000 });

    // Verify Doctor sees the Chamber 304 Live OPD Console
    await expect(doctorPage.getByText('Chamber 304 Live OPD Console')).toBeVisible({ timeout: 10000 });
    const doctorNowServing = doctorPage.getByTestId('doctor-now-serving');
    await expect(doctorNowServing).toBeVisible({ timeout: 10000 });
    await expect(doctorNowServing).toHaveText('Token #A-06');

    // Take screenshot of Doctor's live OPD console
    await doctorPage.getByText('Chamber 304 Live OPD Console').scrollIntoViewIfNeeded();
    await doctorPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_opd_live_console.png',
    });

    // 4. Doctor clicks "Call Next Patient"
    const callNextBtn = doctorPage.getByTestId('doctor-call-next-btn');
    await expect(callNextBtn).toBeVisible();
    await callNextBtn.click();

    // Verify Doctor console advances to Token #A-07
    await expect(doctorNowServing).toHaveText('Token #A-07', { timeout: 10000 });

    // 5. Check Patient page: SSE stream should update Now Serving to Token #A-07 and Patients Ahead to 1 without refresh!
    await expect(patientNowServing).toHaveText('Token #A-07', { timeout: 10000 });
    await expect(patientsAhead).toContainText('1');

    // Take screenshot of patient dashboard live updated state
    await patientPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_live_queue_advanced.png',
    });

    // 6. Doctor clicks priority "Call Rahul Sharma (#A-08)"
    const callRahulBtn = doctorPage.getByTestId('doctor-call-rahul-btn');
    await expect(callRahulBtn).toBeVisible();
    await callRahulBtn.click();

    // Verify Doctor console now shows Token #A-08
    await expect(doctorNowServing).toHaveText('Token #A-08', { timeout: 10000 });

    // 7. Check Patient page: SSE stream pushes YOUR TOKEN IS NOW BEING CALLED!
    await expect(patientPage.getByText('YOUR TOKEN IS NOW BEING CALLED!')).toBeVisible({ timeout: 10000 });
    await expect(patientNowServing).toHaveText('Token #A-08');
    await expect(patientsAhead).toContainText('0');

    // Take screenshot of patient dashboard when called into chamber
    await patientPage.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_token_called_turn.png',
    });

    // Cleanup
    await patientContext.close();
    await doctorContext.close();
  });
});
