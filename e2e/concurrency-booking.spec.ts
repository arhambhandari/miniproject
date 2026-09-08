import { test, expect } from '@playwright/test';

test.describe('Database Integrity, Live Fee & Double-Booking Prevention', () => {
  test.describe.configure({ mode: 'serial' });

  test('Live doctor consultation fee is queried from database rather than mock array', async ({ page }) => {
    // 1. Log in as patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 12000 });

    // 2. Fetch doctor list to get Dr. Aarav Mehta's database ID
    const doctorsRes = await page.request.get('/api/doctors');
    expect(doctorsRes.status()).toBe(200);
    const doctors = await doctorsRes.json();
    const aarav = doctors.find((d: any) => d.user?.name?.includes('Aarav') || d.name?.includes('Aarav'));
    expect(aarav).toBeDefined();

    // 3. Request Razorpay order creation for Aarav
    const orderRes = await page.request.post('/api/payments/create-order', {
      data: { doctorId: aarav.id },
    });
    expect(orderRes.status()).toBe(200);
    const orderData = await orderRes.json();

    // Verify amount reflects the live database fee (e.g. 2200 INR = 220000 paise)
    expect(orderData.amount).toBe(aarav.fee * 100);
    expect(orderData.fee).toBe(aarav.fee);
    expect(orderData.doctorName).toContain('Aarav');
  });

  test('Anti-double-booking engine blocks conflicting appointment slots with 409 Conflict', async ({ page }) => {
    // 1. Log in as patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 12000 });

    // Get doctor
    const doctorsRes = await page.request.get('/api/doctors');
    const doctors = await doctorsRes.json();
    const targetDoctor = doctors[0];

    const uniqueDate = `2026-11-${Math.floor(10 + Math.random() * 18)}`;
    const testSlot = '11:30 AM';

    // 2. First booking succeeds
    const book1 = await page.request.post('/api/appointments', {
      data: {
        doctorId: targetDoctor.id,
        date: uniqueDate,
        startTime: testSlot,
        disease: 'Neurology Consultation',
      },
    });
    expect(book1.status()).toBe(201);
    const appt1 = await book1.json();
    expect(appt1.appointment?.id).toBeDefined();

    // 3. Second booking for the exact same doctor, date & time MUST fail with 409 Conflict
    const book2 = await page.request.post('/api/appointments', {
      data: {
        doctorId: targetDoctor.id,
        date: uniqueDate,
        startTime: testSlot,
        disease: 'Duplicate Checkup',
      },
    });
    expect(book2.status()).toBe(409);
    const errorBody = await book2.json();
    expect(errorBody.error).toMatch(/already booked/i);

    // 4. Cancel the first appointment
    const cancelRes = await page.request.delete(`/api/appointments/${appt1.appointment.id}`);
    expect(cancelRes.status()).toBe(200);

    // 5. Re-booking the newly freed slot succeeds
    const book3 = await page.request.post('/api/appointments', {
      data: {
        doctorId: targetDoctor.id,
        date: uniqueDate,
        startTime: testSlot,
        disease: 'Second Attempt After Cancellation',
      },
    });
    expect(book3.status()).toBe(201);
    const appt3 = await book3.json();
    expect(appt3.appointment?.id).toBeDefined();

    // 6. Clean up test appointment so database state remains clean for other suites
    const cleanupRes = await page.request.delete(`/api/appointments/${appt3.appointment.id}`);
    expect(cleanupRes.status()).toBe(200);
  });

  test('Doctor self-booking prevention blocks practitioner from booking themselves', async ({ page }) => {
    // 1. Log in as Doctor Aarav
    await page.goto('/login');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 12000 });

    // 2. Fetch Dr. Aarav's profile to get his doctorId
    const profileRes = await page.request.get('/api/doctor/profile');
    expect(profileRes.status()).toBe(200);
    const { profile } = await profileRes.json();

    // 3. Attempt self-booking
    const selfBook = await page.request.post('/api/appointments', {
      data: {
        doctorId: profile.id,
        date: '2026-11-20',
        startTime: '02:00 PM',
        disease: 'Self Consult',
      },
    });

    expect(selfBook.status()).toBe(400);
    const body = await selfBook.json();
    expect(body.error).toMatch(/Doctors cannot book consultations with their own profile/i);
  });
});
