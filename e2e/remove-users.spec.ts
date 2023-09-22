import { test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { assertOnLoginPage, login, loginWithSameSession } from './pages/login-page';

test('allows to remove users', async ({ page, context }) => {
  await login(page, 'User 1');
  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);

  const cardPage = await assertOnCardPage(page);
  await cardPage.removeUser('User 2');
  await cardPage.assertVotingStateIs([{ name: 'User 1', state: 'Not voted', pending: false }]);

  const secondLoginPage = await assertOnLoginPage(secondPage);
  await secondLoginPage.assertRemovedBy('User 1');
});
