import { BasePage } from './BasePage';
import { expect } from '@fixtures/pom-fixture';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('[data-test="username"]');
  private readonly passwordInput = this.page.locator('[data-test="password"]');
  private readonly submitButton = this.page.locator('[data-test="login-button"]');

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.validateTitle('Swag Labs');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    await this.validateTitle('Products');
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }
}
