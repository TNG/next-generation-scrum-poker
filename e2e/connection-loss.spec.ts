import { expect, Page, test } from '@playwright/test';
import { assertOnCardPage } from './pages/card-page';
import { login } from './pages/login-page';
import { assertOnResultsPage } from './pages/results-page';

declare global {
  interface Window {
    currentSockets: Set<WebSocket>;
  }
}

test('recovers after connection loss due to unexpected close', async ({ page }) => {
  const { closeSocket } = await instrumentWebSocket(page);
  await login(page, 'User');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', disconnected: false }]);

  await closeSocket();
  await expect(cardPage.revealButton).toHaveText('Connecting…');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', disconnected: true }]);
  await expect(cardPage.revealButton).toHaveText('Reveal Votes');
  await cardPage.selectCard('2');
  await closeSocket();
  await expect(cardPage.revealButton).toHaveText('Connecting…');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', disconnected: true }]);
  await expect(cardPage.revealButton).toHaveText('Reveal Votes');

  await cardPage.revealButton.click();
  const resultsPage = await assertOnResultsPage(page);
  await resultsPage.assertResultsAre([{ name: 'User', result: '2', disconnected: false }]);
});

test('recovers after connection loss due to error', async ({ page }) => {
  const { emitError } = await instrumentWebSocket(page);
  await login(page, 'User');
  const cardPage = await assertOnCardPage(page);
  await cardPage.selectCard('1');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', disconnected: false }]);

  await emitError();
  await expect(cardPage.revealButton).toHaveText('Connecting…');
  await cardPage.assertVotingStateIs([{ name: 'User', state: 'Voted', disconnected: true }]);
  await expect(cardPage.revealButton).toHaveText('Reveal Votes');
  await cardPage.assertSelectedCardIs('1');

  await cardPage.revealButton.click();
  const resultsPage = await assertOnResultsPage(page);
  await resultsPage.assertResultsAre([{ name: 'User', result: '1', disconnected: false }]);
});

async function instrumentWebSocket(page: Page) {
  await page.addInitScript({
    content: `const OriginalWebSocket = window.WebSocket;
      window.currentSockets = new Set();
      window.WebSocket = class WebSocket extends OriginalWebSocket {
        constructor(url, ...args) {
          super(url, ...args);
          if (url.endsWith(':8080')) {
            window.currentSockets.add(this);
            this.addEventListener('close', () => window.currentSockets.delete(this));
          }
        }
      };`,
  });
  return {
    async closeSocket() {
      expect(
        await page.evaluate(() => {
          if (window.currentSockets.size === 1) {
            const socket = window.currentSockets.values().next().value;
            socket.close();
          }
          return window.currentSockets.size;
        })
      ).toBe(1);
    },
    async emitError() {
      expect(
        await page.evaluate(() => {
          if (window.currentSockets.size === 1) {
            const socket: WebSocket = window.currentSockets.values().next().value;
            socket.dispatchEvent(new Event('error'));
          }
          return window.currentSockets.size;
        })
      ).toBe(1);
    },
  };
}
