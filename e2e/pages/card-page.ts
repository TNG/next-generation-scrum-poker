import { expect, Page } from '@playwright/test';
import { CardValue } from '../../shared/cards';

export class CardPage {
  readonly revealButton = this.page.getByLabel('reveal votes');
  readonly userName = this.page.getByText(/^Name: .*/);
  readonly votes = this.page.getByRole('table').locator('tbody tr');
  readonly heading = this.page.getByRole('heading');
  readonly cards = this.page.getByLabel('selectable cards');
  readonly scaleSelectorButton = this.page.getByRole('button', { name: 'Change Scale' });
  readonly scaleSelectorDropdown = this.page.getByRole('listbox', { name: 'scales' });

  constructor(readonly page: Page) {}

  async assertCardsAre(cards: CardValue[]) {
    await Promise.all(
      cards.map(async (card, index) => {
        await expect(
          this.cards.getByRole('option').nth(index),
          `Label of card ${index}`
        ).toHaveAttribute('aria-label', card);
      })
    );
    await expect(this.cards.getByRole('option')).toHaveCount(cards.length);
  }

  async assertNoCardSelected() {
    await expect(this.cards.locator('[aria-selected="true"]')).toHaveCount(0);
  }

  async assertSelectedCardIs(card: CardValue) {
    await expect(this.cards.locator(`[aria-label="${card}"]`)).toHaveAttribute(
      'aria-selected',
      'true'
    );
  }

  async assertShown() {
    await expect(this.heading).toHaveText('SELECT A CARD');
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

  async kickUser(name: string) {
    await this.votes.getByTitle(`Kick ${name}`).click();
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
