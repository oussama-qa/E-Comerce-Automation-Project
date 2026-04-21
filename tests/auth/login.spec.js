const { test, expect } = require('../../fixtures');

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.login(
      process.env.USER_EMAIL,
      process.env.USER_PASSWORD
    );
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.login(
      process.env.USER_EMAIL,
      'wrongpassword123'
    );
    expect(await loginPage.getLoginError()).toBeTruthy();
  });

  test('should show error with invalid email', async ({ loginPage }) => {
    await loginPage.login(
      'invalidemail@fake.com',
      process.env.USER_PASSWORD
    );
    expect(await loginPage.getLoginError()).toBeTruthy();
  });

});