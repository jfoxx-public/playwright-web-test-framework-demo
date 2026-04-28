import { test, expect } from '@fixtures/pom-fixture';

const PRODUCTS = {
  NAMES_ASC: [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
  ],
  NAMES_DESC: [
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Onesie',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Backpack',
  ],
  PRICE_ASC: [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
  ],
  PRICE_DESC: [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
  ],
};

test.describe('Inventory: Product Sorting', { tag: ['@regression', '@inventory'] }, () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.validateTitle('Products');
  });

  test('sort by name: alphabetical ascending (A to Z)', { tag: ['@smoke'] }, async ({ inventoryPage }) => {
    const products = await inventoryPage.getSortedProducts('Name (A to Z)');
    expect(products).toEqual(PRODUCTS.NAMES_ASC);
  });

  test('sort by name: alphabetical descending (Z to A)', async ({ inventoryPage }) => {
    const products = await inventoryPage.getSortedProducts('Name (Z to A)');
    expect(products).toEqual(PRODUCTS.NAMES_DESC);
  });

  test('sort by price: numeric ascending (Low to High)', async ({ inventoryPage }) => {
    const products = await inventoryPage.getSortedProducts('Price (low to high)');
    expect(products).toEqual(PRODUCTS.PRICE_ASC);
  });

  test('sort by price: numeric descending (High to Low)', async ({ inventoryPage }) => {
    const products = await inventoryPage.getSortedProducts('Price (high to low)');
    expect(products).toEqual(PRODUCTS.PRICE_DESC);
  });
});
