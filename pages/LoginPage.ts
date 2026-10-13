import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string) {
    await expect(this.page.locator('#logInModalLabel')).toBeVisible();

    await this.page.locator('#loginusername').click();
    await this.page.locator('#loginusername').fill(username);
    await expect(this.page.locator('#loginusername')).toHaveValue(username);

    await this.page.locator('#loginpassword').click();
    await this.page.locator('#loginpassword').fill(password);
    await expect(this.page.locator('#loginpassword')).toHaveValue(password);

    this.page.once('dialog', async dialog => {
      // DemoBlaze reports authentication errors via a browser alert.
      await dialog.accept();
    });
    await this.page.locator('#logInModal button:has-text("Log in")').click();
  }

  async expectLoggedIn(username: string) {
    await expect(this.page.locator('#nameofuser')).toContainText(username);
  }
}
