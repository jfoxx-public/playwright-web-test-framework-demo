import { BasePage } from './BasePage.ts';
import { expect } from '@fixtures/pom-fixture.ts';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly finishButton = this.page.locator('button[data-test="finish"]');
  private readonly continueButton = this.page.locator('input[data-test="continue"]');
  private readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  private readonly completeHeaderSub = this.page.locator('[data-test="complete-text"]');

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async verifySuccessHeader() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeHeaderSub).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
  }

  async verifyNotToHaveSuccessHeader() {
    await expect(this.completeHeader).not.toHaveText('Thank you for your order!');
    await expect(this.completeHeaderSub).not.toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    await this.validateTitle('Checkout: Overview');
  }

  async getSummaryInfo() {
    // Función interna pequeña para no repetir código
    const getText = async (selector: string) => (await this.page.locator(selector).textContent())?.trim() || '';

    return {
      payment: await getText('[data-test="payment-info-value"]'),
      shipping: await getText('[data-test="shipping-info-value"]'),
      subtotal: await getText('[data-test="subtotal-label"]'),
      tax: await getText('[data-test="tax-label"]'),
      total: await getText('[data-test="total-label"]'),
    };
  }

  async getOverviewData() {
    const productRows = await this.page.locator('[data-test="inventory-item"]').all();
    const items = [];

    for (const row of productRows) {
      items.push({
        quantity: await row.locator('[data-test="item-quantity"]').innerText(),
        name: await row.locator('[data-test="inventory-item-name"]').innerText(),
        desc: await row.locator('[data-test="inventory-item-desc"]').innerText(),
        price: await row.locator('[data-test="inventory-item-price"]').innerText(),
      });
    }

    return items;
  }
}
