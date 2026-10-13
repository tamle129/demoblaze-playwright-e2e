# DemoBlaze Login & Cart E2E QA

A small TypeScript + Playwright framework for the DemoBlaze demo site.

## Deliverables

- `DemoBlaze_Login_Cart_Test_Cases.xlsx`: manual test suite with 51 test cases, test data, steps, expected results, priority, type and execution fields.
- Playwright E2E tests for login and the login → add product → cart → place order flow.
- Page Object Model classes, environment configuration, HTML/JUnit reports and GitHub Actions CI workflow.

## Framework rationale

- **Playwright + TypeScript**: auto-waiting, browser contexts, traces, screenshots and Chromium/Firefox/WebKit projects.
- **Page Object Model**: selectors and interactions live in `pages/`, while assertions and scenario flow live in `tests/`.
- **Environment configuration**: base URL, credentials and headless mode can be set through `.env`; secrets are not committed.
- **CI-ready reporting**: HTML report, JUnit XML, traces, screenshots and video on failure.
- **Sequential tests**: `fullyParallel: false` and one CI worker reduce conflicts against DemoBlaze's shared demo data.

## Requirements

- Node.js 20+
- npm
- A registered DemoBlaze account at https://www.demoblaze.com/

## Setup

```bash
npm install
npx playwright install
```

Create local environment config:

```bash
cp .env.example .env
```

Set `DEMOBLAZE_USERNAME` and `DEMOBLAZE_PASSWORD` in `.env`. Register the test account on DemoBlaze first if needed. Never commit `.env` or real credentials.

## Run

```bash
# All tests, all configured browsers
npm test

# Only Chromium
npm run test:chromium

# Visible browser
npm run test:headed

# Smoke tests or regression
npm run test:smoke
npm run test:regression

# Open the HTML report after a run
npm run report
```

To override config for one run:

```bash
BASE_URL=https://www.demoblaze.com HEADLESS=false npm run test:chromium
```

PowerShell example:

```powershell
$env:DEMOBLAZE_USERNAME="your-test-user"
$env:DEMOBLAZE_PASSWORD="your-test-password"
$env:HEADLESS="false"
npm run test:chromium
```

## Test scope

### Login
- Successful login
- Manual suite also covers empty fields, incorrect password, casing, long/special inputs, injection-like payloads, modal behavior, logout/session and network failure.

### Cart / checkout
- Add a product and validate it appears in cart
- Place an order and validate confirmation dialog content
- Manual suite covers multi-item totals, deletion, empty cart, invalid order data, persistence, responsive behavior and duplicate submissions.

## CI/CD

A GitHub Actions workflow is included at `.github/workflows/playwright.yml`. Add repository secrets:
- `DEMOBLAZE_USERNAME`
- `DEMOBLAZE_PASSWORD`

The workflow installs dependencies and browsers, runs tests, and uploads the HTML report and test results as artifacts.

## Extending to API, regression and performance

- **API**: add `tests/api/*.spec.ts` using Playwright's `request` fixture and keep API helpers under `utils/api/`. Do not assume undocumented endpoints; document any site-specific contract first.
- **Regression**: tag tests (`@smoke`, `@regression`) and add grep-based scripts.
- **Performance**: use a dedicated performance tool such as k6 or Lighthouse for repeatable load/performance measurements; do not treat ordinary UI E2E timing as a performance test.
- **Cross-platform**: browser projects cover Chromium, Firefox and WebKit. Add mobile device projects in `playwright.config.ts` if mobile viewport coverage is needed.

## Known limitations / notes

- DemoBlaze is a public demo website; selectors, data and behavior may change without notice.
- Checkout uses a demo confirmation, not a real payment gateway.
- Login error messages are browser dialogs on the current site. Alert handling is therefore explicit.
- The E2E scripts are a starter implementation and should be run against the live site before submission. They have not been executed in this generated environment; verify selectors and adjust if the site changes.
- Cart state and product data may be shared or persisted by the demo service. Use a dedicated test account and avoid running concurrent destructive tests.
