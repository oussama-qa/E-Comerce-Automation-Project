import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AUTH_FILE } from '../../utils/paths';

setup('authenticate and save storage state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  await expect(page.getByText('Logged in as')).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});
