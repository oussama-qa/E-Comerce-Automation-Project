import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    return await this.page
      .getByRole('link', { name: 'Website for automation practice' })
      .isVisible();
  }

  async navigateToLogin(): Promise<void> {
    await this.page.getByRole('link', { name: ' Signup / Login' }).click();
    await this.waitForPageLoad();
  }

  async navigateToProducts(): Promise<void> {
    await this.page.getByRole('link', { name: ' Products' }).click();
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    await this.page.getByRole('link', { name: ' Cart' }).click();
    await this.waitForPageLoad();
  }

  async searchProduct(productName: string): Promise<void> {
    await this.page.getByRole('link', { name: ' Products' }).click();
    await this.page.getByRole('textbox', { name: 'Search Product' }).fill(productName);
    await this.page.getByRole('button', { name: '' }).click();
    await this.waitForPageLoad();
  }

  async getLoggedInUsername(): Promise<string> {
    return await this.page.getByText('Logged in as').innerText();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('link', { name: ' Logout' }).click();
    await this.waitForPageLoad();
  }
}
