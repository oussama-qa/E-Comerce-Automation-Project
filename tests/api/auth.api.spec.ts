import { test, expect } from '@playwright/test';

const BASE = 'https://automationexercise.com/api';

test.describe('API: Auth @api', () => {
  test('POST /verifyLogin with valid creds returns User exists!', async ({ request }) => {
    const res = await request.post(`${BASE}/verifyLogin`, {
      form: {
        email: process.env.USER_EMAIL!,
        password: process.env.USER_PASSWORD!,
      },
    });
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User exists!');
  });

  test('POST /verifyLogin with invalid creds returns User not found!', async ({ request }) => {
    const res = await request.post(`${BASE}/verifyLogin`, {
      form: {
        email: 'nonexistent-user-xyz@example.com',
        password: 'wrong-password',
      },
    });
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  });

  test('POST /verifyLogin with missing params returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/verifyLogin`, {
      form: { email: 'x@y.com' },
    });
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('Bad request');
  });

  test('DELETE on /verifyLogin rejects the method', async ({ request }) => {
    const res = await request.delete(`${BASE}/verifyLogin`);
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });
});
