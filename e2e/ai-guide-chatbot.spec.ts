import { test, expect } from '@playwright/test';

test.describe('MediGuide AI Conversational Health & Hospital Guide', () => {
  test('Patient interacts with MediGuide AI for emergency triage, doctor matching, and OPD queue guidance', async ({ page }) => {
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

    // 2. Verify MediGuide floating launcher button is visible on dashboard
    const openChatBtn = page.getByTestId('open-ai-chat-btn');
    await expect(openChatBtn).toBeVisible({ timeout: 10000 });
    await expect(openChatBtn).toContainText('MediGuide AI');

    // 3. Open MediGuide Chat Window
    await openChatBtn.click({ force: true });
    const chatWindow = page.getByTestId('ai-chat-window');
    await expect(chatWindow).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Live Clinical Assistant & OPD Guide')).toBeVisible();

    // Verify initial welcoming message and quick suggestion chips
    await expect(page.getByText(/Hello.*MediGuide AI/i)).toBeVisible();
    await expect(page.getByTestId('suggested-reply-0')).toBeVisible();

    // Capture initial chat state screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_initial.png',
    });

    // 4. Test Emergency Red-Flag Intent
    const chatInput = page.getByTestId('ai-chat-input');
    const sendBtn = page.getByTestId('ai-chat-send-btn');
    await chatInput.fill('I have severe chest pain and cannot breathe');
    await sendBtn.click();

    // Verify emergency clinical alert response
    await expect(page.getByText('EMERGENCY CLINICAL TRIAGE RED FLAG')).toBeVisible({ timeout: 12000 });
    await expect(page.getByText(/CRITICAL CLINICAL ALERT/i)).toBeVisible();
    
    // Verify emergency action card
    const emergencyActionBtn = page.getByTestId('chat-action-emergency-btn').last();
    await expect(emergencyActionBtn).toBeVisible();

    // Capture emergency response screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_emergency_response.png',
    });

    // Click emergency action button to verify it launches Emergency Fast-Track Admission Modal
    await emergencyActionBtn.click();
    await expect(page.getByText('Emergency Priority Admission')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('EMERGENCY FAST-TRACK', { exact: true })).toBeVisible();

    // Close emergency modal
    const emergencyCloseBtn = page.getByTestId('emergency-cancel-btn');
    await emergencyCloseBtn.click();

    // 5. Re-open chat if needed and test Specialist Doctor Matching
    if (await openChatBtn.isVisible()) {
      await openChatBtn.click({ force: true });
    }
    await expect(chatWindow).toBeVisible({ timeout: 5000 });

    await chatInput.fill('I have frequent chronic migraine and brain headache');
    await sendBtn.click();

    // Verify specialist recommendation
    await expect(page.getByText(/Specialist Recommendation: Neurology/i)).toBeVisible({ timeout: 12000 });
    const bookDocActionBtn = page.getByTestId('chat-action-book-doctor-btn').last();
    await expect(bookDocActionBtn).toBeVisible();

    // Capture doctor matching screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_specialist_match.png',
    });

    // Click book consultation action to verify it launches Doctor Booking Modal
    await bookDocActionBtn.click();
    await expect(page.getByText(/Schedule Consultation/i)).toBeVisible({ timeout: 8000 });

    // Close booking modal
    const closeBookingBtn = page.getByRole('button', { name: 'Close modal' });
    if (await closeBookingBtn.isVisible()) {
      await closeBookingBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // 6. Test OPD Live Queue Status Guidance
    if (await openChatBtn.isVisible()) {
      await openChatBtn.click({ force: true });
    }
    await expect(chatWindow).toBeVisible({ timeout: 5000 });

    await chatInput.fill('How does the live OPD queue work?');
    await sendBtn.click();

    // Verify OPD live queue status response
    await expect(page.getByText(/Hospital Live OPD Queue Status/i)).toBeVisible({ timeout: 12000 });
    await expect(page.getByText(/Server-Sent Events/i)).toBeVisible();

    // Capture live queue guidance screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_queue_guidance.png',
    });

    // 7. Verify Sidebar and Banner AI Guide triggers work
    const closeChatBtn = page.getByTestId('close-ai-chat-btn');
    await closeChatBtn.click();
    await expect(chatWindow).not.toBeVisible();

    // Click sidebar AI button
    const sidebarAiBtn = page.getByTestId('sidebar-ai-chat-btn');
    await expect(sidebarAiBtn).toBeVisible();
    await sidebarAiBtn.click();
    await expect(chatWindow).toBeVisible();
  });
});
