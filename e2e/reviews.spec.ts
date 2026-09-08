import { test, expect } from '@playwright/test';

test.describe('Doctor Reviews & Profile E2E Flow', () => {
  test('API: POST and GET reviews for doctor', async ({ request }) => {
    // 1. Post a review for doc_1 (Dr. Aarav Mehta) with custom patient name
    const postRes = await request.post('/api/reviews', {
      data: {
        doctorId: 'doc_1',
        rating: 5,
        comment: 'Exceptional neurosurgeon with immense clinical empathy. Explained surgery in detail.',
        patientName: 'Kavita Nair',
      },
    });
    expect(postRes.ok()).toBeTruthy();
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.review.rating).toBe(5);
    expect(postData.review.patientName).toBe('Kavita Nair');

    // 2. Fetch doctor profile to verify review is included
    const docRes = await request.get('/api/doctors/doc_1');
    expect(docRes.ok()).toBeTruthy();
    const docData = await docRes.json();
    expect(docData.bio).toBeDefined();
    expect(docData.qualifications).toBeDefined();
    expect(Array.isArray(docData.reviews)).toBe(true);
    expect(docData.reviews.some((r: any) => r.patientName === 'Kavita Nair')).toBe(true);
  });

  test('Dashboard & Doctor Profile: Diverse reviews and instant update without refresh', async ({ page }) => {
    // 1. Log in as patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /Good Day/i })).toBeVisible({ timeout: 15000 });

    // 2. Find completed appointment with Dr. Vikramaditya Rathore
    const completedVisitCard = page
      .locator('[data-testid^="appointment-card"]')
      .filter({ hasText: /Dr\. Vikramaditya Rathore/i })
      .filter({ hasText: /Completed/i })
      .first();
    await expect(completedVisitCard).toBeVisible({ timeout: 10000 });

    // 3. Click "Write Review" button
    const writeReviewBtn = completedVisitCard.getByRole('button', { name: /Write Review/i });
    await expect(writeReviewBtn).toBeVisible();
    await writeReviewBtn.click();

    // 4. Modal should open
    await expect(page.getByRole('heading', { name: 'Write Doctor Review' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Help other patients with your verified consultation feedback')).toBeVisible();

    // 5. Select 5-star rating
    await page.getByRole('button', { name: 'Rate 5 star' }).click();

    // 6. Select a quick praise tag
    await page.getByRole('button', { name: '+ Accurate Diagnosis' }).click();

    // 7. Type review feedback
    const textarea = page.locator('div[role="dialog"] textarea');
    await textarea.fill('Dr. Vikramaditya was incredibly thorough in diagnosing my condition. Outstanding surgical consultation.');

    // 8. Submit review
    const submitBtn = page.getByRole('button', { name: /Publish Verified Review/i });
    await submitBtn.click();

    // 9. Verify success: Modal closes and reviewed badge appears
    await expect(page.getByRole('heading', { name: 'Write Doctor Review' })).not.toBeVisible({ timeout: 15000 });
    await expect(completedVisitCard.getByText(/Reviewed \(5★\)/i)).toBeVisible({ timeout: 15000 });

    // 10. Click on "View on Doctor Page"
    const viewDoctorLink = completedVisitCard.getByRole('link', { name: /View on Doctor Page/i });
    await expect(viewDoctorLink).toBeVisible();
    await viewDoctorLink.click();

    // 11. Verify Doctor Profile Page
    await expect(page).toHaveURL(/\/doctors\/doc_2/, { timeout: 10000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Dr. Vikramaditya Rathore' })).toBeVisible();

    // Verify "About the Doctor" section
    await expect(page.getByText('About the Doctor')).toBeVisible();
    await expect(page.getByText('Tata Memorial Centre, Mumbai')).toBeVisible();
    await expect(page.getByText(/MBBS, MS, DNB, MCh/i)).toBeVisible();

    // Verify Patient Reviews section displays our submitted review
    await expect(page.getByText('Patient Reviews & Ratings')).toBeVisible();
    await expect(page.getByText(/Dr\. Vikramaditya was incredibly thorough in diagnosing my condition/i).first()).toBeVisible();

    // 12. Verify diverse Indian patient names exist on the page
    await expect(page.getByText('Pooja Verma')).toBeVisible();
    await expect(page.getByText('Arjun Saxena')).toBeVisible();
    await expect(page.getByText('Sunita Deshmukh')).toBeVisible();

    // 13. Test submitting a review directly on the doctor page with custom name (e.g., "Arham")
    const nameInput = page.locator('input[placeholder*="Rahul Sharma, Arham"]');
    await nameInput.fill('Arham');

    const profileTextarea = page.locator('textarea[placeholder*="Share details of your consultation"]');
    await profileTextarea.fill('Phenomenal doctor with exceptional surgical skill and humble demeanour.');

    const submitProfileBtn = page.getByRole('button', { name: /Submit Verified Review/i });
    await submitProfileBtn.click();

    // 14. Verify review is visible IMMEDIATELY without refreshing ("until I refresh the site also show my Review")
    await expect(page.getByText('Arham').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Phenomenal doctor with exceptional surgical skill/i).first()).toBeVisible({ timeout: 15000 });

    // 15. Verify review remains visible AFTER refreshing the page
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Dr. Vikramaditya Rathore' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Arham').first()).toBeVisible();
    await expect(page.getByText(/Phenomenal doctor with exceptional surgical skill/i).first()).toBeVisible();
  });

  test('Doctor profile with no reviews displays clean initial avatar and no fake rating', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 950 });
    await page.goto('/doctors/cmtr4zq330001x9s12zl1e7r1');

    await expect(page.getByRole('heading', { level: 1, name: 'Arham Bhandari' })).toBeVisible({ timeout: 15000 });

    // Verify stock photo img is NOT rendered in profile avatar; initial "A" is shown
    const stockImage = page.locator('img[src*="unsplash.com"]');
    await expect(stockImage).toHaveCount(0);
    await expect(page.getByText('A', { exact: true }).first()).toBeVisible();

    // Verify fake 4.9 rating is NOT rendered
    await expect(page.getByText('4.9 / 5.0')).toHaveCount(0);
    await expect(page.getByText('4.9 Overall Score')).toHaveCount(0);
    await expect(page.getByText('No reviews yet').first()).toBeVisible();
    await expect(page.getByText('0 verified')).toBeVisible();

    // Capture clean screenshot
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_profile_clean.png',
      fullPage: false,
    });
  });
});
