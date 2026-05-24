import { test, expect } from '@fixtures/pom-fixture';

const EXPECTED_PRODUCTS = [
  {
    desc: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    quantity: '1',
  },
  {
    desc: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    quantity: '1',
  },
];

const EXPECTED_SUMMARY_INFO = {
  payment: 'SauceCard #31337',
  shipping: 'Free Pony Express Delivery!',
  subtotal: 'Item total: $39.98',
  tax: 'Tax: $3.20',
  total: 'Total: $43.18',
};

test.describe('Checkout - End to End Flow', { tag: ['@checkout', '@e2e'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test(
    'should complete the purchase flow for multiple items',
    { tag: ['@smoke'] },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      //#region [Products] add produts
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      await inventoryPage.clickCartBadge();
      //#endregion

      //#region [Your cart] review cart products
      const cartData = await cartPage.getCartData();
      expect(cartData).toEqual(EXPECTED_PRODUCTS);
      //#endregion

      //#region [Checkout]
      // fill your information
      await cartPage.clickCheckout();
      await checkoutPage.fillInformation('Jimmy', 'Foxx', '12345');

      // summary information
      const overviewData = await checkoutPage.getOverviewData();
      const summaryInfo = await checkoutPage.getSummaryInfo();
      expect(overviewData).toEqual(EXPECTED_PRODUCTS);
      expect(summaryInfo).toEqual(EXPECTED_SUMMARY_INFO);

      // complete
      await checkoutPage.clickFinish();
      await checkoutPage.verifySuccessHeader();
      //#endregion
    }
  );
});
