import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Email Address').nth(0).fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.waitForPageLoad();
  }

  async register(name: string, email: string): Promise<void> {
    await this.page.getByPlaceholder('Name').fill(name);
    await this.page.getByPlaceholder('Email Address').nth(1).fill(email);
    await this.page.getByRole('button', { name: 'Signup' }).click();
    await this.waitForPageLoad();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.page.getByText('Logged in as').isVisible();
  }

  async getLoginError(): Promise<boolean> {
    return await this.page
      .getByText('Your email or password is incorrect!')
      .isVisible();
  }

  async getRegisterError(): Promise<boolean> {
    return await this.page
      .getByText('Email Address already exist!')
      .isVisible();
  }
}
