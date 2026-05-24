import { BasePage } from './BasePage';
import { Page, Locator, expect } from '@fixtures/pom-fixture';

export class InventoryPage extends BasePage {
  private readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');
  private readonly cartBadge = this.page.locator('[data-test="shopping-cart-link"]');
  private readonly sortContainer = this.page.locator('[data-test="product-sort-container"]');
  private readonly productTitles = this.page.locator('div[data-test="inventory-item-name"]');
  public readonly mainMenu: BurgerMenu;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new BurgerMenu(page);
  }

  async addItemToCart(productName: string) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async clickCartBadge() {
    await this.cartBadge.click();
  }

  get cartBadgeLocator() {
    return this.cartBadge;
  }

  async getActiveSortOption(): Promise<string> {
    return await this.sortContainer.inputValue();
  }

  async getSortedProducts(label: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)') {
    await this.sortContainer.selectOption({ label });
    return await this.productTitles.allTextContents();
  }

  async expectProductButtonState(productName: string, expectedText: 'Add to cart' | 'Remove') {
    const productContainer = this.inventoryItems.filter({ hasText: productName });
    const actionButton = productContainer.getByRole('button');
    await expect(actionButton).toHaveText(expectedText);
  }

  async addProductsToCart(productNames: string[]) {
    for (const name of productNames) {
      await this.addItemToCart(name);
    }
  }

  async expectMultipleProductsButtonState(productNames: string[], expectedText: 'Add to cart' | 'Remove') {
    for (const name of productNames) {
      await this.expectProductButtonState(name, expectedText);
    }
  }
}

export class BurgerMenu {
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly resetAppStateLink: Locator;
  
  constructor(private readonly page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  private async open() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetAppStateLink.click();
  }

  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click();
  }
}