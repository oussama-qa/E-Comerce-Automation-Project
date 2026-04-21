const { test, expect } = require('../../fixtures');

test.describe('Products', () => {

  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test('should display all products page', async ({ productsPage }) => {
    expect(await productsPage.isLoaded()).toBeTruthy();
  });

  test('should search for a product and return results', async ({ productsPage }) => {
    await productsPage.searchProduct('Top');
    const count = await productsPage.getSearchResultsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should show correct product in search results', async ({ productsPage }) => {
    await productsPage.searchProduct('Jeans');
    expect(await productsPage.isSearchResultVisible('Jeans')).toBeTruthy();
  });

  test('should add first product to cart', async ({ productsPage }) => {
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickContinueShopping();
  });

  test('should navigate to product detail page', async ({ productsPage }) => {
    await productsPage.viewFirstProductDetail();
    await expect(productsPage.getHeading("Blue Top")).toBeVisible();  
});

});