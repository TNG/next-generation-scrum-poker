import { expect, Page } from '@playwright/test';

export class ResultsPage {
  readonly results = this.page.getByRole('table').locator('tbody tr');
  readonly resetButton = this.page.getByRole('button', { name: 'Reset votes' });
  readonly heading = this.page.getByRole('heading');

  constructor(readonly page: Page) {}

  async assertResultsAre(results: { name: string; result: string; pending: boolean }[]) {
    await Promise.all(
      results.map(async ({ name, result, pending }, index) => {
        const element = this.results.nth(index);
        const expectName = expect(element.locator('td:nth-child(1)'), `Name of row ${index}`);
        await expect(element.locator('td:nth-child(1)'), `Name of row ${index}`).toHaveText(name);
        if (pending) {
          await expectName.toHaveAttribute('title', 'Pending connection');
        } else {
          await expectName.not.toHaveAttribute('title', 'Pending connection');
        }
        await expect(async () =>
          expect(
            (await element.locator('td:nth-child(2)').textContent()) ||
              (await element.locator('td:nth-child(2) div').getAttribute('title')),
            `Result of row ${index}`
          ).toBe(result)
        ).toPass();
      })
    );
    await expect(this.results).toHaveCount(results.length);
  }
}

export const assertOnResultsPage = async (page: Page): Promise<ResultsPage> => {
  const resultsPage = new ResultsPage(page);
  await expect(resultsPage.heading).toHaveText('RESULTS');
  return resultsPage;
};
