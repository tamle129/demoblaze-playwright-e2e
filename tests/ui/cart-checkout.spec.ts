import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { getCredentials } from '../../utils/credentials';
import checkoutData from '../../data/checkout-data.json';

test.describe('Cart and Checkout Function', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.openLogin();

    const { username, password } = getCredentials();
    const login = new LoginPage(page);
    await login.login(username, password);
    await login.expectLoggedIn(username);
  });

  test('Login successfully, add a product to cart, and place an order @smoke', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    const productName = await home.openFirstProduct();
    await cart.addCurrentProductToCart();

    await home.openCart();
    await cart.expectProductInCart(productName);
    const total = await cart.getTotal();
    expect(total).toBeGreaterThan(0);

    let confirmationText = '';
    page.once('dialog', async dialog => {
      confirmationText = dialog.message();
      await dialog.accept();
    });

    // Input data
    await cart.placeOrder(checkoutData);

    // Order and verify
    await cart.verifyOrderSuccess()
  });

});
