import { Locator } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  async getCartData() {
    const getText = async (selector: string, parent: Locator) =>
      (await parent.locator(selector).textContent())?.trim() || '';

    const allRows = await this.cartItems.all();

    return Promise.all(
      allRows.map(async (row) => {
        // Retornamos el objeto directamente, sin el [ ]
        return {
          quantity: await getText('[data-test="item-quantity"]', row),
          name: await getText('[data-test="inventory-item-name"]', row),
          desc: await getText('[data-test="inventory-item-desc"]', row),
          price: await getText('[data-test="inventory-item-price"]', row),
        };
      })
    );
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
