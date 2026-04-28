import { test } from '@fixtures/pom-fixture';

test.describe('Login - Happy Path', { tag: ['@smoke', '@auth'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.validateTitle('Products');
    await loginPage.expectSuccessfulLogin();
  });
});
