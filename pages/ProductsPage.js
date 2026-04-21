const { BasePage } = require('./BasePage');


class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

  }
getHeading(productName) {
  return this.page.getByRole('heading', { name: productName});
}

  async goto() {
    await this.navigate('/products');
    // await this.waitForPageLoad();
  }

  async isLoaded() {
    return await this.page
      .getByRole('heading', { name: 'All Products' })
      .isVisible();
  }

  async searchProduct(productName) {
    await this.page
      .getByRole('textbox', { name: 'Search Product' })
      .fill(productName);
    await this.page
      .locator('#submit_search')
      .click();
    // await this.waitForPageLoad();
  }

  async isSearchResultVisible(productName) {
    return await this.page
      .locator('.productinfo p', { hasText: productName })
      .first()
      .isVisible();
  }

  getAddedToCartModal() {
    return this.page.getByRole('heading', { name: 'Added!' });
  }

  async getSearchResultsCount() {
    return await this.page
      .locator('.productinfo')
      .count();
  }

  async addFirstProductToCart() {
    await this.page
      .locator('.productinfo')
      .first()
      .hover();
    await this.page
      .getByText('Add to cart')
      .first()
      .click();
    // await this.waitForPageLoad();
  }

  async clickContinueShopping() {
    await this.page
      .getByRole('button', { name: 'Continue Shopping' })
      .click();
  }

  async clickViewCart() {
    await this.page
      .getByRole('link', { name: 'View Cart' })
      .click();
    // await this.waitForPageLoad();
  }

  async getFirstProductName() {
    return await this.page
      .locator('.productinfo p')
      .first()
      .innerText();
  }

  async getFirstProductPrice() {
    return await this.page
      .locator('.productinfo h2')
      .first()
      .innerText();
  }

  async viewFirstProductDetail() {
    await this.page
      .getByRole('link', { name: 'View Product' })
      .first()
      .click();
    // await this.waitForPageLoad();
  }
}

module.exports = { ProductsPage };