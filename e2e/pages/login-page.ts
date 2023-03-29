import { expect, Page } from '@playwright/test';

export class LoginPage {
  readonly nameInput = this.page.getByLabel('Name:');
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  readonly alertText = this.page.getByRole('alert');

  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async assertShown() {
    await expect(this.loginButton).toBeVisible();
  }

  async gotoWithSameSession(otherPage: Page) {
    const { search } = new URL(otherPage.url());
    await this.page.goto(`/${search}`);
  }

  async login(name: string) {
    await this.nameInput.fill(name);
    await this.loginButton.click();
  }

  async assertKickedBy(name: string) {
    await expect(this.alertText).toHaveText(`You have been kicked by ${name}.`);
  }

  async assertSessionTakeover() {
    await expect(this.alertText).toHaveText(
      'Your session was taken over by another user with the same name.'
    );
  }
}

export const login = async (page: Page, name: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(name);
};

export const loginWithSameSession = async (page: Page, name: string, otherPage: Page) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoWithSameSession(otherPage);
  await loginPage.login(name);
};

export const assertOnLoginPage = async (page: Page): Promise<LoginPage> => {
  const loginPage = new LoginPage(page);
  await loginPage.assertShown();
  return loginPage;
};
