import { expect, Locator, Page } from '@playwright/test';
import { CardValue } from '../../shared/cards';

export class CardPage {
  readonly revealButton: Locator;
  readonly userName: Locator;
  readonly votes: Locator;
  readonly heading: Locator;
  readonly cards: Locator;
  readonly scaleSelectorButton: Locator;
  readonly scaleSelectorDropdown: Locator;

  constructor(readonly page: Page) {
    this.revealButton = page.getByLabel('reveal votes');
    this.userName = page.getByText(/^Name: .*/);
    this.votes = page.getByRole('table').locator('tbody tr');
    this.heading = page.getByRole('heading');
    this.cards = page.getByLabel('selectable cards');
    this.scaleSelectorButton = page.getByRole('button', { name: 'Change Scale' });
    this.scaleSelectorDropdown = page.getByRole('listbox', { name: 'scales' });
  }

  async assertCardsAre(cards: CardValue[]) {
    await Promise.all(
      cards.map(async (card, index) => {
        await expect(
          this.cards.getByRole('option').nth(index),
          `Label of card ${index}`,
        ).toHaveAttribute('aria-label', card);
      }),
    );
    await expect(this.cards.getByRole('option')).toHaveCount(cards.length);
  }

  async assertNoCardSelected() {
    await expect(this.cards.locator('[aria-selected="true"]')).toHaveCount(0);
  }

  async assertSelectedCardIs(card: CardValue) {
    await expect(this.cards.locator(`[aria-label="${card}"]`)).toHaveAttribute(
      'aria-selected',
      'true',
    );
  }

  async assertShown() {
    await expect(this.heading).toHaveText('SELECT A CARD');
  }

  async assertUserNameIs(name: string) {
    await expect(this.userName).toHaveText(`Name: ${name}`);
  }

  async assertVotingStateIs(states: { name: string; state: string; pending: boolean }[]) {
    await Promise.all(
      states.map(async ({ name, state, pending }, index) => {
        const element = this.votes.nth(index);
        const expectName = expect(element.locator('td:nth-child(1)'), `Name of row ${index}`);
        await expectName.toHaveText(name);
        if (pending) {
          await expectName.toHaveAttribute('title', 'Pending connection');
        } else {
          await expectName.not.toHaveAttribute('title', 'Pending connection');
        }
        await expect(
          element.locator('td:nth-child(2) div'),
          `State of row ${index}`,
        ).toHaveAttribute('title', state);
      }),
    );
    await expect(this.votes).toHaveCount(states.length);
  }

  async removeUser(name: string) {
    await this.votes.getByTitle(`Remove ${name}`).click();
  }

  async selectCard(value: CardValue) {
    await this.cards.locator(`[aria-label="${value}"]`).click();
  }

  async selectScale(scale: string) {
    await this.scaleSelectorButton.click();
    await this.scaleSelectorDropdown.getByRole('option', { name: scale }).click();
  }
}

export const assertOnCardPage = async (page: Page): Promise<CardPage> => {
  const cardPage = new CardPage(page);
  await cardPage.assertShown();
  return cardPage;
};
