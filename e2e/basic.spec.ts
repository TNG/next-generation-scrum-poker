import { test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { login, loginWithSameSession } from './pages/login-page';
import { assertOnResultsPage } from './pages/results-page';

test('syncs state between users', async ({ page, context }) => {
  // First login
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);
  await cardPage.assertUserNameIs('User 1');
  await cardPage.assertNoCardSelected();
  await cardPage.assertVotingStateIs([{ name: 'User 1', state: 'Not voted', pending: false }]);

  // Second login
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.assertUserNameIs('User 2');
  await secondCardPage.assertNoCardSelected();
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
  await cardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);

  // First vote
  await cardPage.selectCard('1');
  await cardPage.assertSelectedCardIs('1');
  await cardPage.assertVotingStateIs([
    { name: 'User 2', state: 'Not voted', pending: false },
    { name: 'User 1', state: 'Voted', pending: false },
  ]);
  await secondCardPage.assertVotingStateIs([
    { name: 'User 2', state: 'Not voted', pending: false },
    { name: 'User 1', state: 'Voted', pending: false },
  ]);

  // Second vote
  await secondCardPage.selectCard('40');
  await secondCardPage.assertSelectedCardIs('40');
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Voted', pending: false },
    { name: 'User 2', state: 'Voted', pending: false },
  ]);
  await cardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Voted', pending: false },
    { name: 'User 2', state: 'Voted', pending: false },
  ]);

  // Reveal
  await secondCardPage.revealButton.click();
  const secondResultsPage = await assertOnResultsPage(secondPage);
  await secondResultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '40', pending: false },
  ]);
  const resultsPage = await assertOnResultsPage(page);
  await resultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '40', pending: false },
  ]);

  // Reset
  page.on('dialog', (dialog) => dialog.accept());
  await resultsPage.resetButton.click();
  await cardPage.assertShown();
  await cardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
  await secondCardPage.assertShown();
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
});
