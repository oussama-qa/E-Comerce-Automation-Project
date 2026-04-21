import { test, expect } from '../../fixtures';
import { AUTH_FILE } from '../../utils/paths';

test.use({ storageState: AUTH_FILE });

// Shared test account means cart state is server-side global per user —
// run checkout tests serially and reset cart before each one.
test.describe.configure({ mode: 'serial' });

test.describe('Checkout @regression', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.clearCart();
  });

  test('should show address details and order review when logged-in user proceeds to checkout', async ({
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    await cartPage.proceedToCheckout();
    await expect(checkoutPage.getAddressDetailsHeading()).toBeVisible();
    await expect(checkoutPage.getReviewOrderHeading()).toBeVisible();
  });

  test('should allow adding a comment and placing an order', async ({
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    await cartPage.proceedToCheckout();
    await checkoutPage.fillComment('Please deliver between 9-5pm.');
    await checkoutPage.placeOrder();

    await expect(
      checkoutPage.page.getByRole('heading', { name: 'Payment' }),
    ).toBeVisible();
  });

  test('should complete full checkout with payment', async ({
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.getAddedToCartModal()).toBeVisible();
    await productsPage.clickViewCart();

    await cartPage.proceedToCheckout();
    await checkoutPage.placeOrder();

    await checkoutPage.fillPaymentDetails({
      nameOnCard: 'Oussama El Omari',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2030',
    });
    await checkoutPage.confirmPayment();

    await expect(checkoutPage.getOrderPlacedConfirmation()).toBeVisible();
  });
});
