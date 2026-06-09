import { describe, expect, it } from 'vitest';
import { VOTE_HIDDEN, VOTE_NOTE_VOTED } from '../../../../shared/cards';
import { TOOLTIP_LOST_CONNECTION, TOOLTIP_NOT_VOTED } from '../../constants';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { ResultsPage } from './ResultsPage';

const renderResultsPage = getRenderWithWebSocket(<ResultsPage />, {
  connected: true,
  loggedIn: true,
  loginData: { user: 'TheUser', session: 'TheSession123456' },
});

describe('ResultsPage', () => {
  it('falls back to a lost-connection indicator for votes that stayed hidden after reveal', () => {
    const { getByText, getByTitle, queryByTitle } = renderResultsPage({
      state: {
        resultsVisible: true,
        votes: { TheUser: '5', OtherUser: VOTE_HIDDEN },
      },
    });

    expect(getByText('5')).toBeVisible();
    expect(getByTitle(TOOLTIP_LOST_CONNECTION)).toBeVisible();
    expect(queryByTitle(TOOLTIP_NOT_VOTED)).toBeNull();
  });

  it('shows the not-voted indicator for users who did not vote', () => {
    const { getByTitle, queryByTitle } = renderResultsPage({
      state: {
        resultsVisible: true,
        votes: { TheUser: '5', OtherUser: VOTE_NOTE_VOTED },
      },
    });

    expect(getByTitle(TOOLTIP_NOT_VOTED)).toBeVisible();
    expect(queryByTitle(TOOLTIP_LOST_CONNECTION)).toBeNull();
  });
});
