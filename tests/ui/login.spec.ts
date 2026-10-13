import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage} from '../../pages/LoginPage';
import { getCredentials } from '../../utils/credentials';

test.describe('Login Feature', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.openLogin();
  });

  test('LOGIN-001 - Login with valid credentials @smoke @regression', async ({ page }) => {
    const { username, password } = getCredentials();
    const login = new LoginPage(page);


    await login.login(username, password);
    await login.expectLoggedIn(username);
    await expect(page.locator('#login2')).toBeHidden();
  });

  test('LOGIN-002 - Login with incorrect password', async ({ page }) => {

    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`unknown_${Date.now()}`);
    await page.locator('#loginpassword').fill('invalid-password');
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-003 - Login with unknown username', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`unknown_${Date.now()}`);
    await page.locator('#loginpassword').fill('12345678@X');
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-004 - Submit empty username and password', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(``);
    await page.locator('#loginpassword').fill('');
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-005 - Submit username only', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`tamle129`);
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-006 - Submit password only', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginpassword').fill(`12345678@X`);
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-007 - Username with leading/trailing spaces', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`tamle129`);
    await page.locator('#loginpassword').fill(`12345678@X `);
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-008 - Password case sensitivity', async ({ page }) => {
    let alertMessage = '';

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`tamle129`);
    await page.locator('#loginpassword').fill(`12345678@x`);
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

  test('LOGIN-009 - Username case handling', async ({ page }) => {
    let alertMessage = '';
    const login = new LoginPage(page);

    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#loginusername').fill(`TAMLE129`);
    await page.locator('#loginpassword').fill(`12345678@X`);
    await page.locator('#logInModal button:has-text("Log in")').click();
    await expect.poll(() => alertMessage).not.toBe('');
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

});
