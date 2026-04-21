# automationexercise-playwright

End-to-end **and** API test suite for [automationexercise.com](https://automationexercise.com) built with **Playwright + TypeScript**.

Demonstrates the modern Playwright patterns expected in a production QA codebase: Page Object Model, custom fixtures, `storageState` auth reuse, cross-browser projects, API-layer tests, tagged test runs, and a sharded CI matrix.

[![Playwright Tests](https://github.com/oussamaomari/automationexercise-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/oussamaomari/automationexercise-playwright/actions/workflows/playwright.yml)

---

## Highlights

- **TypeScript** end-to-end — strict mode, typed fixtures, typed page objects
- **Page Object Model** with a shared `BasePage`
- **`storageState` auth** — log in once, reuse across all auth-gated tests (no per-test re-login)
- **Cross-browser** projects: Chromium, Firefox, WebKit
- **API testing** against `/api/*` endpoints — independent of the browser
- **Tag-based runs** (`@smoke`, `@regression`, `@api`)
- **Sharded CI matrix** — each browser runs on its own GitHub Actions runner
- **Ad-blocking fixture** to make runs faster and less flaky

## Project structure

```
automationexercise-playwright/
├── .github/workflows/
│   └── playwright.yml          CI pipeline — typecheck + matrix
├── fixtures/
│   └── index.ts                Typed fixtures (ad-block, page objects)
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts       One-time login → saves storageState
│   │   └── login.spec.ts       UI login (smoke)
│   ├── products/products.spec.ts
│   ├── cart/cart.spec.ts
│   ├── checkout/checkout.spec.ts  Uses storageState
│   └── api/
│       ├── auth.api.spec.ts
│       └── products.api.spec.ts
├── utils/
│   └── paths.ts
├── .env                         Credentials (gitignored)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

### Prerequisites

- Node.js LTS
- npm

### Install

```bash
npm ci
npx playwright install --with-deps
```

### Environment variables

Create a `.env` file in the project root:

```bash
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
```

The `.env` file is gitignored — never commit credentials.

## Running tests

```bash
npm test                    # chromium UI + API (safe default)
npm run test:chromium       # chromium only
npm run test:firefox        # firefox only
npm run test:webkit         # webkit only
npm run test:api            # API tests only (no browser)
npm run test:smoke          # @smoke-tagged tests
npm run test:regression     # @regression-tagged tests
npm run test:ui             # Playwright UI mode
npm run test:headed         # watch the browser run
npm run typecheck           # tsc --noEmit
npm run report              # open last HTML report
```

> **Note on cross-browser local runs:** the suite uses a single shared test account on automationexercise.com. Running all three browsers simultaneously against the same account causes cart conflicts (same server-side session). The default `npm test` avoids this. CI sidesteps it entirely via a per-browser matrix — each browser gets its own runner, its own login, and its own session.

## Test coverage

| Suite     | Tests | Tag          | What it covers                                                           |
| --------- | :---: | ------------ | ------------------------------------------------------------------------ |
| Login UI  |   3   | `@smoke`     | Valid login, invalid password, invalid email                             |
| Products  |   5   | `@smoke`     | Products page load, search, product detail, add to cart from listing     |
| Cart      |   5   | `@regression`| Empty state, add single, add multiple, remove item, unauthed checkout    |
| Checkout  |   3   | `@regression`| Address/review render, place order + comment, full checkout with payment |
| API Auth  |   4   | `@api`       | `verifyLogin` happy/unhappy/missing-params/method-not-allowed            |
| API Products | 5  | `@api`       | `productsList`, `searchProduct`, `brandsList`, edge cases                |

**Total: 25 tests × 3 browsers + 9 API tests** = 84 test runs on full cross-browser run.

## Architecture notes

### storageState auth

`tests/auth/auth.setup.ts` is a setup project that logs in once and writes cookies to `playwright/.auth/user.json`. Tests that need auth declare:

```ts
test.use({ storageState: AUTH_FILE });
```

No per-test login cost. Significantly faster than reauthenticating in every checkout test.

### Project graph (playwright.config.ts)

- `setup` — runs `auth.setup.ts`, writes storageState
- `chromium`, `firefox`, `webkit` — depend on `setup`, exclude `*.api.spec.ts`
- `api` — independent, runs `*.api.spec.ts` only (no browser)

### Locator strategy

Priority order for resilient selectors:

| Priority | Method              | When                       |
| :------: | ------------------- | -------------------------- |
|   1st    | `getByRole`         | Buttons, links, headings   |
|   2nd    | `getByPlaceholder`  | Input fields               |
|   3rd    | `getByText`         | Labels, messages           |
|   4th    | `getByLabel`        | Form labels                |
|   5th    | `getByTestId`       | When `data-testid` exists  |
|   Last   | `locator` (CSS)     | Nothing else works         |

All assertions use auto-waiting `expect(locator).toBeVisible()` rather than boolean `.isVisible()` checks — avoids Firefox/WebKit timing flakes.

### Stateful-test handling

`tests/checkout/checkout.spec.ts` uses `test.describe.configure({ mode: 'serial' })` plus a `cartPage.clearCart()` in `beforeEach`, because cart state is server-side per user account. Standard pattern for tests that mutate shared state.

## CI

GitHub Actions runs:

1. **typecheck** — `tsc --noEmit`
2. **test matrix** — one runner per project (`chromium`, `firefox`, `webkit`, `api`). Each uploads its own HTML report as an artifact.

Required repository secrets:

- `USER_EMAIL`
- `USER_PASSWORD`

## Author

**Oussama El Omari** — QA Engineer
- GitHub: [@oussamaomari](https://github.com/oussama-qa)
- LinkedIn: [linkedin.com/in/oussamaomari](https://linkedin.com/in/oussamaomari)
