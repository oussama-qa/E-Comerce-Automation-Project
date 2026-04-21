const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async goto() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async isLoaded() {
    return await this.page
      .getByRole('link', { name: 'Website for automation practice' })
      .isVisible();
  }

  async navigateToLogin() {
    await this.page
      .getByRole('link', { name: ' Signup / Login' })
      .click();
    await this.waitForPageLoad();
  }

  async navigateToProducts() {
    await this.page
      .getByRole('link', { name: ' Products' })
      .click();
    await this.waitForPageLoad();
  }

  async navigateToCart() {
    await this.page
      .getByRole('link', { name: ' Cart' })
      .click();
    await this.waitForPageLoad();
  }

  async searchProduct(productName) {
    await this.page
      .getByRole('link', { name: ' Products' })
      .click();
    await this.page
      .getByRole('textbox', { name: 'Search Product' })
      .fill(productName);
    await this.page
      .getByRole('button', { name: '' })
      .click();
    await this.waitForPageLoad();
  }

  async getLoggedInUsername() {
    return await this.page
      .getByText('Logged in as')
      .innerText();
  }

  async logout() {
    await this.page
      .getByRole('link', { name: ' Logout' })
      .click();
    await this.waitForPageLoad();
  }
}

module.exports = { HomePage };