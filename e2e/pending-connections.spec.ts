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
    { name: 'User 1', state: 'Not voted', disconnected: false },
    { name: 'User 2', state: 'Not voted', disconnected: false },
  ]);
  await cardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', disconnected: false },
    { name: 'User 2', state: 'Not voted', disconnected: false },
  ]);

  // First logout
  await page.close();
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', disconnected: true },
    { name: 'User 2', state: 'Not voted', disconnected: false },
  ]);

  // First login again
  const thirdPage = await context.newPage();
  await loginWithSameSession(thirdPage, 'User 1', secondPage);
  const thirdCardPage = await assertOnCardPage(thirdPage);
  await secondCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', disconnected: false },
    { name: 'User 2', state: 'Not voted', disconnected: false },
  ]);
  await thirdCardPage.assertVotingStateIs([
    { name: 'User 1', state: 'Not voted', disconnected: false },
    { name: 'User 2', state: 'Not voted', disconnected: false },
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
  const secondResultPage = await assertOnResultsPage(secondPage);
  await secondResultPage.assertResultsAre([
    { name: 'User 1', result: '1', disconnected: false },
    { name: 'User 2', result: '1', disconnected: false },
  ]);
  const resultPage = await assertOnResultsPage(page);
  await resultPage.assertResultsAre([
    { name: 'User 1', result: '1', disconnected: false },
    { name: 'User 2', result: '1', disconnected: false },
  ]);

  // First logout
  await page.close();
  await secondResultPage.assertResultsAre([
    { name: 'User 1', result: '1', disconnected: true },
    { name: 'User 2', result: '1', disconnected: false },
  ]);

  // First login again
  const thirdPage = await context.newPage();
  await loginWithSameSession(thirdPage, 'User 1', secondPage);
  const thirdResultPage = await assertOnResultsPage(thirdPage);
  await thirdResultPage.assertResultsAre([
    { name: 'User 1', result: '1', disconnected: false },
    { name: 'User 2', result: '1', disconnected: false },
  ]);
  await thirdResultPage.assertResultsAre([
    { name: 'User 1', result: '1', disconnected: false },
    { name: 'User 2', result: '1', disconnected: false },
  ]);
});
