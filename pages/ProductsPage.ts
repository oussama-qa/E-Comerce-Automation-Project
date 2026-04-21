import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getHeading(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName });
  }

  async goto(): Promise<void> {
    await this.navigate('/products');
  }

  async isLoaded(): Promise<boolean> {
    return await this.page
      .getByRole('heading', { name: 'All Products' })
      .isVisible();
  }

  async searchProduct(productName: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Search Product' }).fill(productName);
    await this.page.locator('#submit_search').click();
  }

  async isSearchResultVisible(productName: string): Promise<boolean> {
    return await this.page
      .locator('.productinfo p', { hasText: productName })
      .first()
      .isVisible();
  }

  getSearchResultLocator(productName: string): Locator {
    return this.page
      .locator('.productinfo p', { hasText: productName })
      .first();
  }

  async getSearchResultsCount(): Promise<number> {
    return await this.page.locator('.productinfo').count();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.addProductToCartByIndex(0);
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const productCard = this.page.locator('.product-image-wrapper').nth(index);
    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();
    await productCard.getByText('Add to cart').first().click();
  }

  async waitForAddedModalHidden(): Promise<void> {
    await this.page
      .getByRole('heading', { name: 'Added!' })
      .waitFor({ state: 'hidden' });
  }

  getAddedToCartModal(): Locator {
    return this.page.getByRole('heading', { name: 'Added!' });
  }

  async clickContinueShopping(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async clickViewCart(): Promise<void> {
    await this.page.getByRole('link', { name: 'View Cart' }).click();
  }

  async getFirstProductName(): Promise<string> {
    return await this.page.locator('.productinfo p').first().innerText();
  }

  async getFirstProductPrice(): Promise<string> {
    return await this.page.locator('.productinfo h2').first().innerText();
  }

  async viewFirstProductDetail(): Promise<void> {
    await this.page.getByRole('link', { name: 'View Product' }).first().click();
  }
}
