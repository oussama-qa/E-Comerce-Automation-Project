const { test: base} = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { ProductsPage } = require('../pages/ProductsPage');



// Extend base test with our custom fixtures
exports.test = base.extend({

    // Centralized Ad-blocking for cleaner test files.
    page: async ({ page }, use) => {

    await page.route('**/*', (route) => {
      const url = route.request().url();

      if (
        url.includes('ads') ||
        url.includes('doubleclick') ||
        url.includes('analytics')
      ) {
        return route.abort();
      }

      route.continue();
    });

    await use(page);
  },
  // LoginPage fixture — automatically gives every test a LoginPage instance
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  // HomePage fixture

    homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  // ProductsPage fixture
    productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },
  // Authenticated user fixture — logs in before the test runs
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.USER_EMAIL,
      process.env.USER_PASSWORD 
    );
    await use(page, homePage);
  },

});

exports.expect = require('@playwright/test').expect;