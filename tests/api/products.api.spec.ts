import { test, expect } from '@playwright/test';

const BASE = 'https://automationexercise.com/api';

test.describe('API: Products @api', () => {
  test('GET /productsList returns all products', async ({ request }) => {
    const res = await request.get(`${BASE}/productsList`);
    expect(res.status()).toBe(200);

    const body = JSON.parse(await res.text());
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);

    const sample = body.products[0];
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('price');
    expect(sample).toHaveProperty('category');
  });

  test('POST /searchProduct returns matching products', async ({ request }) => {
    const res = await request.post(`${BASE}/searchProduct`, {
      form: { search_product: 'top' },
    });
    expect(res.status()).toBe(200);

    const body = JSON.parse(await res.text());
    expect(body).toHaveProperty('products');
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST /searchProduct without param returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/searchProduct`);
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('search_product parameter is missing');
  });

  test('GET /brandsList returns all brands', async ({ request }) => {
    const res = await request.get(`${BASE}/brandsList`);
    expect(res.status()).toBe(200);

    const body = JSON.parse(await res.text());
    expect(body).toHaveProperty('brands');
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('DELETE on /productsList should reject the method', async ({ request }) => {
    const res = await request.delete(`${BASE}/productsList`);
    const body = JSON.parse(await res.text());
    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });
});
