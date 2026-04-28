import { test, expect } from '@fixtures/pom-fixture';

test('restart the application state', { tag: ['@smoke', '@cart', '@functional'] }, async ({ inventoryPage }) => {
  test.skip(true, 'BUG: buttons for chosen products are not being restored');
  //#region test setup
  const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
  //#endregion

  // add products
  await inventoryPage.addProductsToCart(products);
  // validation
  await inventoryPage.expectMultipleProductsButtonState(products, 'Remove');
  await expect(inventoryPage.cartBadgeLocator).toHaveText('2');
  // reset app state
  await inventoryPage.mainMenu.resetAppState();
  // validation
  await expect(inventoryPage.cartBadgeLocator).toHaveText('');
  await inventoryPage.expectMultipleProductsButtonState(products, 'Add to cart');
  //#endregion
});
