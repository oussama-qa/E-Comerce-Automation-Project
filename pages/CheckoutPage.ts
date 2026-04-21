import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    return await this.page
      .getByRole('heading', { name: 'Address Details' })
      .isVisible();
  }

  getReviewOrderHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Review Your Order' });
  }

  getAddressDetailsHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Address Details' });
  }

  async fillComment(comment: string): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole('link', { name: 'Place Order' }).click();
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.page.locator('input[name="name_on_card"]').fill(details.nameOnCard);
    await this.page.locator('input[name="card_number"]').fill(details.cardNumber);
    await this.page.locator('input[name="cvc"]').fill(details.cvc);
    await this.page.locator('input[name="expiry_month"]').fill(details.expiryMonth);
    await this.page.locator('input[name="expiry_year"]').fill(details.expiryYear);
  }

  async confirmPayment(): Promise<void> {
    await this.page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
  }

  getOrderPlacedConfirmation(): Locator {
    return this.page.getByText('Congratulations! Your order has been confirmed!');
  }
}
