import { test, expect } from '../../fixtures';

test.describe('Cart @regression', () => {
  test('should display empty cart message when no items added', async ({ cartPage }) => {
    await cartPage.goto();
    expect(await cartPage.isEmpty()).toBeTruthy();
  });

  test('should add product from products page and see it in cart', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    await expect(cartPage.getCartTable()).toBeVisible();
    expect(await cartPage.getCartItemsCount()).toBeGreaterThan(0);
  });

  test('should add multiple products to cart', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickContinueShopping();
    await productsPage.waitForAddedModalHidden();

    await productsPage.addProductToCartByIndex(1);
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    expect(await cartPage.getCartItemsCount()).toBe(2);
  });

  test('should remove item from cart', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    const initialCount = await cartPage.getCartItemsCount();
    await cartPage.removeItem(0);
    await expect(cartPage.page.locator('#cart_info_table tbody tr')).toHaveCount(
      initialCount - 1,
    );
  });

  test('should prompt register/login when unauthenticated user clicks checkout', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    await cartPage.proceedToCheckout();
    await expect(cartPage.getRegisterLoginPrompt()).toBeVisible();
  });
});
