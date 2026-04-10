import { expect, test } from '@playwright/test';
import { SCALES } from '../shared/scales';
import { assertOnCardPage } from './pages/card-page';
import { login, loginWithSameSession } from './pages/login-page';
import { assertOnResultsPage } from './pages/results-page';

test('supports changing the scale', async ({ page, context }) => {
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');

  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.selectCard('2');

  // Verify Custom option exists in scale selector
  await cardPage.scaleSelectorButton.click();
  await expect(
    cardPage.scaleSelectorDropdown.getByRole('option', { name: 'Custom' }),
  ).toBeVisible();

  // Select Fibonacci (dropdown is already open)
  await cardPage.scaleSelectorDropdown.getByRole('option', { name: 'Fibonacci' }).click();
  await cardPage.assertCardsAre([...SCALES.FIBONACCI_SCALE.values, 'observer']);
  await cardPage.assertNoCardSelected();
  await secondCardPage.assertCardsAre([...SCALES.FIBONACCI_SCALE.values, 'observer']);
  await secondCardPage.assertNoCardSelected();

  await secondCardPage.selectScale('Sizes');
  await secondCardPage.assertCardsAre([...SCALES.SIZES_SCALE.values, 'observer']);
  await secondCardPage.assertNoCardSelected();
  await cardPage.assertCardsAre([...SCALES.SIZES_SCALE.values, 'observer']);
  await cardPage.assertNoCardSelected();
});

test('supports creating and using custom scales', async ({ page, context }) => {
  // User 1 logs in
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);

  // User 2 joins same session
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);

  // User 1 creates custom scale
  await cardPage.scaleSelectorButton.click();
  await cardPage.scaleSelectorDropdown.getByRole('option', { name: 'Custom' }).click();

  // Modal should open
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();

  // Add custom cards in a deliberately non-predefined order (descending sizes). Results must follow
  // this order, not the predefined size order, which is what the previous sort logic got wrong.
  const input = modal.getByRole('textbox', { name: /card value/i });
  const addButton = modal.getByRole('button', { name: /add card value/i });

  await input.fill('L');
  await addButton.click();
  await input.fill('M');
  await addButton.click();
  await input.fill('S');
  await addButton.click();
  await input.fill('XS');
  await addButton.click();

  // Save custom scale
  await modal.getByRole('button', { name: /save/i }).click();
  await expect(modal).not.toBeVisible();

  // Both users should see the custom scale in the order it was entered
  await cardPage.assertCardsAre(['L', 'M', 'S', 'XS', 'observer']);
  await secondCardPage.assertCardsAre(['L', 'M', 'S', 'XS', 'observer']);

  // Both users vote with custom values
  await cardPage.selectCard('S');
  await secondCardPage.selectCard('L');

  // Reveal votes
  await cardPage.revealButton.click();
  const resultsPage = await assertOnResultsPage(page);
  const secondResultsPage = await assertOnResultsPage(secondPage);

  // Results are sorted by scale order: L (index 0) before S (index 2), so User 2 sorts first.
  await resultsPage.assertResultsAre([
    { name: 'User 2', result: 'L', pending: false },
    { name: 'User 1', result: 'S', pending: false },
  ]);
  await secondResultsPage.assertResultsAre([
    { name: 'User 2', result: 'L', pending: false },
    { name: 'User 1', result: 'S', pending: false },
  ]);
});
