import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/view_cart');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    return await this.page.locator('#cart_info_table').isVisible();
  }

  getCartTable(): Locator {
    return this.page.locator('#cart_info_table');
  }

  async isEmpty(): Promise<boolean> {
    return await this.page.getByText('Cart is empty!').isVisible();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.page.locator('#cart_info_table tbody tr').count();
  }

  async getCartItemName(index: number = 0): Promise<string> {
    return await this.page
      .locator('#cart_info_table tbody tr .cart_description h4 a')
      .nth(index)
      .innerText();
  }

  async getCartItemQuantity(index: number = 0): Promise<string> {
    return await this.page
      .locator('#cart_info_table tbody tr .cart_quantity button')
      .nth(index)
      .innerText();
  }

  async removeItem(index: number = 0): Promise<void> {
    await this.page.locator('.cart_quantity_delete').nth(index).click();
  }

  async clearCart(): Promise<void> {
    await this.goto();
    const deleteButtons = this.page.locator('.cart_quantity_delete');
    while ((await deleteButtons.count()) > 0) {
      await deleteButtons.first().click();
      await this.page.waitForTimeout(200);
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByText('Proceed To Checkout').click();
  }

  getRegisterLoginPrompt(): Locator {
    return this.page.getByText('Register / Login account');
  }
}
