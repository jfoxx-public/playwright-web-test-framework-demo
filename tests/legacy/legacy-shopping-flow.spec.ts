/**
 * @file legacy-shopping-flow.spec.ts
 * @description THIS IS A LEGACY ARCHIVE MAINTAINED FOR COMPARATIVE PURPOSES.
 * * ARCHITECTURAL EVOLUTION NOTE:
 * This script represents the initial stage of the project (Scripting Pattern).
 * It is preserved to demonstrate the progression toward a Senior-level automation
 * framework by identifying the following anti-patterns corrected in version 2:
 * 1. Hardcoded Locators: Selectors are scattered across the script, making maintenance difficult.
 * 2. Lack of Abstraction: No Page Object Model (POM) implementation, tightly coupling UI logic with test steps.
 * 3. Logic Duplication (DRY Violation): The login flow and setup are manually repeated.
 * 4. Fragility: Basic synchronization that relies on sequential DOM loading without robust wait strategies.
 * * The optimized version featuring POM, custom Fixtures, and Clean Code can be found in: /tests/checkout/
 *
 * important: a refactor for this code is at checkout/checkout-e2e.spec.ts
 * Jimmy Foxx
 */

import { test, expect } from '@playwright/test';

test.describe('Legacy E2E Shopping Scenarios', () => {
  test('login page should have the correct title', { tag: ['@smoke', '@happy-path'] }, async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('shopping cart flow (Monolithic Script)', { tag: ['@smoke', '@happy-path'] }, async ({ page }) => {
    //#region login
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('.title')).toHaveText('Products');
    //#endregion

    //#region products
    await page
      .locator('[data-test="inventory-item"]', { hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    await page
      .locator('[data-test="inventory-item"]', {
        hasText: 'Sauce Labs Bike Light',
      })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    //#endregion

    //#region your cart
    const allRows = await page.locator('div[data-test="inventory-item"]').all();
    const tableData: string[][] = [];
    for (const row of allRows) {
      const cells = await row.locator('div:not(:has(button))').all();
      const rowData: string[] = [];

      for (const cell of cells) {
        // validate if the cell has an input or a textarea
        const input = cell.locator('input, textarea, select');

        if ((await input.count()) > 0) {
          // take the input's value (if any)
          const value = await input.inputValue();
          rowData.push(value.trim());
        } else {
          // take the plain text
          const text = await cell.innerText();
          rowData.push(text.trim());
        }
      }
      tableData.push(rowData);
    }
    const expectedProducts = [
      [
        '1',
        'Sauce Labs Backpack',
        'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
        '$29.99',
      ],
      [
        '1',
        'Sauce Labs Bike Light',
        "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
        '$9.99',
      ],
    ];
    expect(tableData).toEqual(expectedProducts);

    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="secondary-header"]')).toHaveText('Checkout: Your Information');
    //#endregion

    //#region checkout: your information
    await page.locator('[data-test="firstName"]').fill('jimmy');
    await page.locator('[data-test="lastName"]').fill('foxx');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('input[data-test="continue"]').click();
    await expect(page.locator('[data-test="secondary-header"]')).toHaveText('Checkout: Overview');
    //#endregion

    //#region checkout: overview
    const productRows = await page.locator('[data-test="inventory-item"]').all();
    const inventoryData: string[][] = [];

    for (const row of productRows) {
      const rowDetails = [];
      rowDetails.push((await row.locator('[data-test="item-quantity"]').textContent()) || '0');
      rowDetails.push((await row.locator('[data-test="inventory-item-name"]').textContent()) || '');
      rowDetails.push((await row.locator('[data-test="inventory-item-desc"]').textContent()) || '');
      rowDetails.push((await row.locator('[data-test="inventory-item-price"]').textContent()) || '');
      inventoryData.push(rowDetails);
    }
    expect(inventoryData).toEqual(expectedProducts);

    const expectedSummaryInfo = [
      'Payment Information:',
      'SauceCard #31337',
      'Shipping Information:',
      'Free Pony Express Delivery!',
      'Price Total',
      'Item total: $39.98',
      'Tax: $3.20',
      'Total: $43.18',
    ];
    const summaryInfo = [];
    summaryInfo.push((await page.locator('[data-test="payment-info-label"]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="payment-info-value"]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="shipping-info-label"]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="shipping-info-value"]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="total-info-label" ]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="subtotal-label" ]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="tax-label"]').textContent()) || '');
    summaryInfo.push((await page.locator('[data-test="total-label"]').textContent()) || '');
    expect(summaryInfo).toEqual(expectedSummaryInfo);

    await page.locator('[data-test="finish"]').click();
    //#endregion

    //#region checkout: complete
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    //#endregion
  });
});
