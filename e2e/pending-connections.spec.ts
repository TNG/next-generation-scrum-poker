import { test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { login, loginWithSameSession } from './pages/login-page';
import { assertOnResultsPage } from './pages/results-page';

test('indicates pending connections on card page', async ({ page, context }) => {
  // First login
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);

  // Second login
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
  await cardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);

  // First logout
  await page.close();
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: true },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);

  // First login again
  const thirdPage = await context.newPage();
  await loginWithSameSession(thirdPage, 'User 1', secondPage);
  const thirdCardPage = await assertOnCardPage(thirdPage);
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
  await thirdCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', pending: false },
    { name: 'User 2', state: 'Not voted', pending: false },
  ]);
});

test('indicates pending connections on result page', async ({ page, context }) => {
  // First login
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');

  // Second login
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.selectCard('1');
  await secondCardPage.revealButton.click();
  const secondResultsPage = await assertOnResultsPage(secondPage);
  await secondResultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '1', pending: false },
  ]);
  const resultsPage = await assertOnResultsPage(page);
  await resultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '1', pending: false },
  ]);

  // First logout
  await page.close();
  await secondResultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: true },
    { name: 'User 2', result: '1', pending: false },
  ]);

  // First login again
  const thirdPage = await context.newPage();
  await loginWithSameSession(thirdPage, 'User 1', secondPage);
  const thirdResultsPage = await assertOnResultsPage(thirdPage);
  await thirdResultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '1', pending: false },
  ]);
  await thirdResultsPage.assertResultsAre([
    { name: 'User 1', result: '1', pending: false },
    { name: 'User 2', result: '1', pending: false },
  ]);
});
