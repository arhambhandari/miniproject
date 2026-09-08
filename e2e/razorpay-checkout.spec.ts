import { test, expect } from '@playwright/test';

test.describe('Razorpay Standard Checkout Test Mode Flow', () => {
  test('Complete end-to-end booking using authentic Razorpay Test Mode with Bank 3D-Secure OTP', async ({ page }) => {
    // 1. Log in as patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 2. Go to Homepage to open Booking Modal from Doctor Grid
    await page.goto('/');
    await expect(page.getByText('Dr. Vikramaditya Rathore')).toBeVisible({ timeout: 15000 });

    // Click Book button on doctor card
    const bookBtn = page.locator('button:has-text("Book Appointment")').first();
    await bookBtn.click();

    // 3. Verify MediBook Booking Modal opens
    await expect(page.getByText('Schedule Consultation')).toBeVisible({ timeout: 10000 });

    // Select Day+4 and 05:00 PM slot to prevent slot collision
    await page.locator('div.grid-cols-5 button').nth(4).click();
    await page.getByRole('button', { name: '05:00 PM' }).click();

    // Enter chief complaint
    await page.fill('input[placeholder*="Reason for visit"]', 'Preventive oncology consultation');

    // Take screenshot of Booking Modal with real payment option images
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/booking_modal_payment_options.png',
    });

    // Click "Pay & Confirm" button to initiate Razorpay checkout
    const payCta = page.getByRole('button', { name: /Pay ₹.*Confirm/i });
    await payCta.click();

    // 4. Verify the Authentic Razorpay Test Mode Checkout Modal pops up
    await expect(page.getByTestId('rzp-test-mode-badge')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Consultation OPD Fee')).toBeVisible();

    // Verify UPI tab has QR Code and Simulated Scan
    await expect(page.getByText('Scan with any UPI App: GPay, PhonePe, Paytm')).toBeVisible();
    await expect(page.getByText('medibook.pay@razorpay')).toBeVisible();

    // Take screenshot of Razorpay Modal: UPI QR Code stage
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_checkout_upi_qr.png',
    });

    // Click "UPI Apps / ID" to show authentic logos for GPay, PhonePe, Paytm, BHIM
    await page.getByRole('button', { name: 'UPI Apps / ID' }).click();
    await expect(page.getByText('Or enter your UPI ID (VPA)')).toBeVisible();
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_checkout_upi_apps.png',
    });

    // 5. Switch to Netbanking Tab to showcase real bank logos (HDFC, SBI, ICICI, Axis, Kotak, PNB)
    await page.getByRole('button', { name: 'Netbanking' }).click();
    await expect(page.getByText('HDFC Bank').first()).toBeVisible();
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_checkout_netbanking.png',
    });

    // 6. Switch to Cards tab
    await page.getByTestId('rzp-tab-card').click();
    await expect(page.getByText('Card Number')).toBeVisible();

    // Click quick test pill "Visa Test Card"
    await page.getByTestId('rzp-visa-pill').click();
    await expect(page.locator('input[placeholder="4111 1111 1111 1111"]')).toHaveValue('4111 1111 1111 1111');

    // Take screenshot of Razorpay Modal: Card details stage
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_checkout_cards.png',
    });

    // Click "Pay ₹... via Card"
    await page.getByTestId('rzp-card-pay-btn').click();

    // 6. Verify Bank 3D Secure Sandbox OTP Screen
    await expect(page.getByTestId('rzp-otp-sandbox')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Enter 6-Digit Bank OTP')).toBeVisible();
    await expect(page.getByText(/Your MediBook OTP is 123456/i)).toBeVisible();
    await page.waitForTimeout(500);

    // Take screenshot of Razorpay 3D Secure Sandbox OTP screen
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_bank_3dsecure_otp.png',
    });

    // Click "Auto-fill 123456"
    await page.getByTestId('rzp-autofill-otp').click();

    // Click "Approve Test Payment (Success)"
    await page.getByTestId('rzp-approve-btn').click();

    // 7. Verify processing spinner then green success checkmark with Audio Ripple and Chime button
    await expect(page.getByText(/Payment Successful!/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Replay Payment Sound 🔔')).toBeVisible();

    // Take screenshot of Razorpay Success checkmark with Audio Ripple
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_payment_success.png',
    });

    // 8. Verify appointment confirmed screen in MediBook with Payment Chime indicator
    await expect(page.getByText('Your Appointment is Scheduled!')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Booking Confirmed')).toBeVisible();
    await expect(page.getByText('Hear Payment Chime 🔔')).toBeVisible();
    await expect(page.getByText('Transaction ID:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return to Dashboard' })).toBeVisible();

    // Take screenshot of MediBook Confirmation Screen with Chime indicator
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/razorpay_booking_confirmed.png',
    });
  });
});
