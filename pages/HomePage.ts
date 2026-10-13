import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
    await expect(this.page.locator('#nava')).toBeVisible();
  }

  async openLogin() {
    await expect(this.page.locator('#login2')).toBeVisible();
    await this.page.locator('#login2').click();
    await expect(this.page.locator('#logInModal')).toBeVisible();
  }

  async openCart() {
    await expect(this.page.locator('#cartur')).toBeVisible();
    await this.page.locator('#cartur').click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async openFirstProduct() {
    const firstProduct = this.page.locator('#tbodyid .card-title a').first();
    await expect(firstProduct).toBeVisible();
    const productName = (await firstProduct.innerText()).trim();
    await firstProduct.click();
    await expect(this.page.locator('.name')).toHaveText(productName);
    return productName;
  }
}
