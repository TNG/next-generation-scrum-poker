import { Page } from '@playwright/test';

export class LoginPage {
  readonly nameInput = this.page.getByLabel('Name:');
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async gotoWithSameSession(otherPage: Page) {
    const { search } = new URL(otherPage.url());
    await this.page.goto(`/${search}`);
  }

  async login(name: string) {
    await this.nameInput.fill(name);
    await this.loginButton.click();
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
