import { test, expect } from '@fixtures/pom-fixture';

test.describe('Login - Negative Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'should display error when username is empty',
    { tag: ['@smoke', '@auth', '@negative'] },
    async ({ loginPage }) => {
      await loginPage.login('', 'secret_sauce');
      await loginPage.validateErrorMessage('Epic sadface: Username is required');
    }
  );

  test(
    'should display error when password is empty',
    { tag: ['@smoke', '@auth', '@negative'] },
    async ({ loginPage }) => {
      await loginPage.login('standard_user', '');
      await loginPage.validateErrorMessage('Epic sadface: Password is required');
    }
  );

  test(
    'should display error when using invalid credentials',
    { tag: ['@smoke', '@auth', '@negative'] },
    async ({ loginPage }) => {
      await loginPage.login('standard_user', 'wrong_password');
      await loginPage.validateErrorMessage('Epic sadface: Username and password do not match any user in this service');
    }
  );
});

test.describe('cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test(
    'app rejects completing checkout with an empty cart',
    { tag: ['@regression', '@cart', '@edge-case'] },
    async ({ page, inventoryPage, cartPage }) => {
      test.skip(
        true,
        'BUG: Checkout allowed with 0 items. Expected error message or disabled button, but app proceeds to Summary.'
      );
      //#region [Products] Avoiding add items to the cart
      await inventoryPage.clickCartBadge();
      //#endregion

      //#region [Checkout]
      await cartPage.clickCheckout();
      await cartPage.validateErrorMessage('Cart is empty');
      await expect(page).toHaveURL(/.*cart/); // verify we are still in the cart
      //#endregion
    }
  );
});
