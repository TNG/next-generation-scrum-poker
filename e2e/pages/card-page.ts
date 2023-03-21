import { expect, Page } from '@playwright/test';
import { CardValue } from '../../shared/cards';

export class CardPage {
  readonly revealButton = this.page.getByRole('button', { name: 'Reveal Votes' });
  readonly revealNowButton = this.page.getByRole('button', { name: 'Reveal Now' });
  readonly userName = this.page.getByText(/^Name: .*/);
  readonly votes = this.page.getByRole('table').locator('tbody tr');
  readonly heading = this.page.getByRole('heading');

  constructor(readonly page: Page) {}

  async assertShown() {
    await expect(this.heading).toHaveText('SELECT A CARD');
  }

  async selectCard(value: CardValue) {
    await this.page.getByRole('button', { name: value, exact: true }).click();
  }

  async assertUserNameIs(name: string) {
    await expect(this.userName).toHaveText(`Name: ${name}`);
  }

  async assertVotingStateIs(states: { name: string; state: string }[]) {
    await Promise.all(
      states.map(async ({ name, state }, index) => {
        const element = this.votes.nth(index);
        await expect(element.locator('td:nth-child(1)'), `Name of row ${index}`).toHaveText(name);
        await expect(
          element.locator('td:nth-child(2) div'),
          `State of row ${index}`
        ).toHaveAttribute('title', state);
      })
    );
    await expect(this.votes).toHaveCount(states.length);
  }
}

export const assertOnCardPage = async (page: Page): Promise<CardPage> => {
  const cardPage = new CardPage(page);
  await cardPage.assertShown();
  return cardPage;
};
