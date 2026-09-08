import { test, expect } from '@playwright/test';

test.describe('Server-Side Auth Guard & RBAC Proxy (Next.js 16 src/proxy.ts)', () => {
  test.describe.configure({ mode: 'serial' });

  test('Unauthenticated user is redirected to /login when attempting to visit protected dashboards', async ({ browser }) => {
    // Create clean browser context with no cookies/session
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Direct access to Patient Dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

    // 2. Direct access to Doctor Dashboard
    await page.goto('/doctor/dashboard');
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

    // 3. Direct API call to Doctor API returns 401
    const res = await page.request.get('/api/doctor/profile');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');

    await context.close();
  });

  test('Authenticated Patient can access /dashboard, is blocked from /doctor/dashboard, and redirected away from /login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Log in as seeded Patient
    await page.goto('/login');
    await page.fill('input[type="email"]', 'patient@example.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 12000 });
    await expect(page.getByRole('heading', { name: /Good Day|नमस्ते/i })).toBeVisible();

    // 2. Attempt to access Doctor Dashboard -> Proxy must redirect to /dashboard
    await page.goto('/doctor/dashboard');
    await expect(page).toHaveURL(/.*dashboard(?!\/doctor)/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Good Day|नमस्ते/i })).toBeVisible();

    // 3. Attempt to access /login while logged in -> Proxy redirects back to /dashboard
    await page.goto('/login');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // 4. Calling doctor API as Patient returns 403 Forbidden
    const res = await page.request.get('/api/doctor/profile');
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('Doctor access required');

    await context.close();
  });

  test('Authenticated Doctor can access /doctor/dashboard, is redirected from /dashboard, and redirected away from /login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Log in as seeded Doctor
    await page.goto('/login');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /doctor/dashboard
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 12000 });
    await expect(page.getByText('Doctor Practice Portal')).toBeVisible();

    // 2. Attempt to access Patient Dashboard -> Proxy redirects Doctor to /doctor/dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 10000 });
    await expect(page.getByText('Doctor Practice Portal')).toBeVisible();

    // 3. Attempt to access /login while logged in as Doctor -> Redirects to /doctor/dashboard
    await page.goto('/login');
    await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 10000 });

    // 4. Calling doctor API as Doctor returns 200 with profile
    const res = await page.request.get('/api/doctor/profile');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.profile).toBeDefined();

    await context.close();
  });
});
