import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.ts';
import { InventoryPage } from '../pages/InventoryPage.ts';
import { CartPage } from '../pages/CartPage.ts';
import { CheckoutPage } from '../pages/CheckoutPage.ts';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect, type Page, type Locator } from '@playwright/test';
