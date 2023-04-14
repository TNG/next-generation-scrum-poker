import { test } from '@playwright/test';
import { SCALES } from '../shared/scales';
import { assertOnCardPage } from './pages/card-page';
import { login, loginWithSameSession } from './pages/login-page';

test('supports changing the scale', async ({ page, context }) => {
  await login(page, 'User 1');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');

  const secondPage = await context.newPage();
  await loginWithSameSession(secondPage, 'User 2', page);
  const secondCardPage = await assertOnCardPage(secondPage);
  await secondCardPage.selectCard('2');

  await cardPage.selectScale('Fibonacci');
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
