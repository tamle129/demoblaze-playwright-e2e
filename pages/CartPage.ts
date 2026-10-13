import { Page, expect } from '@playwright/test';

// Define the shape of your checkout data interface
export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class CartPage {
  constructor(private readonly page: Page) { }

  async addCurrentProductToCart() {

    // Solution 1
    // await expect(this.page.locator('a:has-text("Add to cart")')).toBeVisible(); 
    // await expect(this.page.locator('a:has-text("Add to cart")')).toBeEnabled(); 

    // // Register the listener before triggering the action
    // this.page.once('dialog', async dialog => {
    //   expect(dialog.message()).toContain('Product added.');
    //   await dialog.accept();
    // });

    // // Click on Add to cart button
    // await this.page.locator('a:has-text("Add to cart")').click();

    // Solution 2
    const addToCartButton = this.page.locator('a:text("Add to cart")');

    // 1. Ensure the button is visible and fully enabled before clicking
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 2. Set up the dialog listener concurrently using Promise.all 
        // to avoid race conditions with fast-firing browser alerts
        const [dialog] = await Promise.all([
          this.page.waitForEvent('dialog', { timeout: 4000 }),
          addToCartButton.click(),
        ]);

        // 3. Verify and accept the alert popup
        expect(dialog.message()).toContain('Product added.');
        await dialog.accept();
        
        return; // Success, exit function
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to add product to cart and catch alert after ${maxRetries} attempts.`);
        }
        
        // Brief recovery pause before retrying the action
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async expectProductInCart(productName: string) {
    await expect(this.page.locator('#tbodyid')).toContainText(productName);
  }

  async expectCartHasAtLeastOneItem() {
    await expect(this.page.locator('#tbodyid tr')).toHaveCount(1, { timeout: 15_000 });
  }

  async getTotal() {
    const totalText = (await this.page.locator('#totalp').innerText()).trim();
    return Number(totalText || 0);
  }

  async placeOrder(data: CheckoutData) {
    // 1. Click the Place Order button and wait for modal to be visible
    await this.page.click('button.btn.btn-success[data-toggle="modal"]');
    const orderModal = this.page.locator('#orderModal');
    await expect(orderModal).toBeVisible();

    // 2. Map form fields to their selectors
    const fields = [
      { selector: '#name', value: data.name },
      { selector: '#country', value: data.country },
      { selector: '#city', value: data.city },
      { selector: '#card', value: data.card },
      { selector: '#month', value: data.month },
      { selector: '#year', value: data.year },
    ];

    // 3. Click, fill, and verify each input field robustly
    for (const field of fields) {
      const inputElement = this.page.locator(field.selector);
      await inputElement.click();
      await inputElement.fill(field.value);
      await expect(inputElement).toHaveValue(field.value);
    }

    // 4. Submit the order form
    await this.page.locator('#orderModal button:has-text("Purchase")').click()
  }

  async verifyOrderSuccess() {
    const successModal = this.page.locator('.sweet-alert.showSweetAlert');
    await expect(successModal).toBeVisible();

    // Check the title
    const header = successModal.locator('h2');
    await expect(header).toHaveText('Thank you for your purchase!');

    // Check other information
    const details = successModal.locator('p.lead');
    await expect(details).toContainText('Id:');

    // Click OK to close the popup
    await this.page.click('button.confirm.btn.btn-primary');
  }
}
