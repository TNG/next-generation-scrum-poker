import { test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { assertOnLoginPage, login, loginWithSameSession } from './pages/login-page';

test('allows to kick users', async ({ page, context }) => {
  await login(page, 'User 1');
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);

  const cardPage = await assertOnCardPage(page);
  await cardPage.kickUser('User 2');
  await cardPage.assertVotingStateIs([{ name: 'User 1', state: 'Not voted', disconnected: false }]);

  const secondLoginPage = await assertOnLoginPage(secondPage);
  await secondLoginPage.assertKickedBy('User 1');
});
