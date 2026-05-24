import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async validateTitle(title: string) {
    await this.page.locator('[data-test="title"]', { hasText: title }).isVisible();
  }

  async validateErrorMessage(message: string) {
    await this.page.locator('[data-test="error"]', { hasText: message }).isVisible();
  }
}
