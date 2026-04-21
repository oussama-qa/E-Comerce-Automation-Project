const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async goto() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email, password) {
    await this.page
      .getByPlaceholder('Email Address')
      .nth(0)
      .fill(email);

    await this.page
      .getByPlaceholder('Password')
      .fill(password);

    await this.page
      .getByRole('button', { name: 'Login' })
      .click();

    await this.waitForPageLoad();
  }

  async register(name, email) {
    await this.page
      .getByPlaceholder('Name')
      .fill(name);

    await this.page
      .getByPlaceholder('Email Address')
      .nth(1)
      .fill(email);

    await this.page
      .getByRole('button', { name: 'Signup' })
      .click();

    await this.waitForPageLoad();
  }

  async isLoggedIn() {
    return await this.page
      .getByText('Logged in as')
      .isVisible();
  }

  async getLoginError() {
    return await this.page
      .getByText('Your email or password is incorrect!')
      .isVisible();
  }

  async getRegisterError() {
    return await this.page
      .getByText('Email Address already exist!')
      .isVisible();
  }
}

module.exports = { LoginPage };