import { fireEvent } from '@testing-library/preact';
import { VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { SCALES } from '../../../../shared/scales';
import { BUTTON_REVEAL_NOW, BUTTON_REVEAL_VOTES } from '../../constants';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { RevealButton } from './RevealButton';

const render = getRenderWithWebSocket(<RevealButton />, {
  connected: true,
  loginData: { user: 'TheUser', session: 'TheSession123456' },
  loggedIn: true,
  state: {
    resultsVisible: false,
    votes: {
      TheUser: VOTE_NOTE_VOTED,
    },
    scale: SCALES.COHEN_SCALE.values,
  },
});

describe('The RevealButton', () => {
  it('reveals votes after everyone voted', () => {
    const revealVotes = vi.fn();
    const { getByText } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: '3',
          OtherUser: '5',
        },
      },
    });

    fireEvent.click(getByText('Reveal Votes'));
    expect(revealVotes).toHaveBeenCalled();
  });

  it('shows a different reveal button if votes are missing', () => {
    const revealVotes = vi.fn();
    const { getByText } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: '3',
          OtherUser: VOTE_NOTE_VOTED,
        },
      },
    });

    fireEvent.click(getByText(BUTTON_REVEAL_NOW));
    expect(revealVotes).toHaveBeenCalled();
  });

  it('shows a different reveal button and disables it if there are no votes', () => {
    const revealVotes = vi.fn();
    const { getByText } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: VOTE_OBSERVER,
          OtherUser: VOTE_NOTE_VOTED,
        },
      },
    });

    expect(getByText(BUTTON_REVEAL_VOTES)).toHaveTextContent('Waiting for votes...');
    expect(getByText(BUTTON_REVEAL_VOTES)).toBeDisabled();
  });

  it('disables button if not connected', () => {
    const revealVotes = vi.fn();
    const { getByRole } = render({
      revealVotes,
      connected: false,
    });

    expect(getByRole('button', { name: 'reveal votes' })).toBeDisabled();
  });

  it('auto-updates the view and auto-reveals once missing votes have been added', () => {
    const revealVotes = vi.fn();
    const { getByText, rerender } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: VOTE_NOTE_VOTED,
          OtherUser: VOTE_NOTE_VOTED,
          ThirdUser: VOTE_NOTE_VOTED,
        },
      },
    });
    expect(getByText(BUTTON_REVEAL_VOTES)).toHaveTextContent('Waiting for votes...');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: VOTE_NOTE_VOTED,
          OtherUser: '3',
          ThirdUser: VOTE_NOTE_VOTED,
        },
      },
    });
    expect(getByText(BUTTON_REVEAL_NOW)).toHaveTextContent('2 missing votes');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: '2',
          OtherUser: '3',
          ThirdUser: VOTE_NOTE_VOTED,
        },
      },
    });
    expect(getByText(BUTTON_REVEAL_NOW)).toHaveTextContent('1 missing vote');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: '2',
          OtherUser: '3',
          ThirdUser: '5',
        },
      },
    });
    expect(getByText(BUTTON_REVEAL_VOTES)).toBeInTheDocument();
  });
});
