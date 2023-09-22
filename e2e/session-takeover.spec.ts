import { test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { assertOnLoginPage, login, loginWithSameSession } from './pages/login-page';
import { assertOnResultsPage } from './pages/results-page';

test('allows to take over sessions from other users', async ({ page, context }) => {
  await login(page, 'User');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');

  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.assertSelectedCardIs('1');
  await secondCardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', pending: false }]);
  await secondCardPage.selectCard('2');

  const loginPage = await assertOnLoginPage(page);
  await loginPage.assertSessionTakeover();
  await loginPage.login('User');
  await assertOnCardPage(page);
  await cardPage.assertSelectedCardIs('2');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', pending: false }]);
  await cardPage.revealButton.click();
  const resultsPage = await assertOnResultsPage(page);
  await resultsPage.assertResultsAre([{ name: 'User', result: '2', pending: false }]);

  const secondLoginPage = await assertOnLoginPage(secondPage);
  await secondLoginPage.assertSessionTakeover();
});
