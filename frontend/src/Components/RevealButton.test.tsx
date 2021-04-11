import { getRenderWithWebSocket } from '../test-helpers/renderWithWebSocker';
import { fireEvent, prettyDOM } from '@testing-library/preact';
import { RevealButton } from './RevealButton';
import { SCALES } from '../constants';

const render = getRenderWithWebSocket(<RevealButton />, {
  connected: true,
  loginData: { user: 'TheUser', session: 'TheSession123456' },
  loggedIn: true,
  state: {
    resultsVisible: false,
    votes: {
      TheUser: 'not-voted',
    },
    scale: SCALES.COHEN_SCALE.values,
  },
});

describe('The RevealButton', () => {
  it('reveals votes after everyone voted', () => {
    const revealVotes = jest.fn();
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

  it('does not reveal votes but shows a different view if votes are missing', () => {
    const revealVotes = jest.fn();
    const { getByText } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: '3',
          OtherUser: 'not-voted',
        },
      },
    });

    fireEvent.click(getByText('Reveal Votes'));
    expect(revealVotes).not.toHaveBeenCalled();
    getByText('1 people did not vote');

    fireEvent.click(getByText('Reveal Now'));
    expect(revealVotes).toHaveBeenCalled();
  });

  it('auto-updates the view and auto-reveals', () => {
    const revealVotes = jest.fn();
    const { getByText, rerender } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: 'not-voted',
        },
      },
    });

    fireEvent.click(getByText('Reveal Votes'));
    expect(revealVotes).not.toHaveBeenCalled();
    getByText('2 people did not vote');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: '5',
        },
      },
    });
    expect(revealVotes).not.toHaveBeenCalled();
    getByText('1 people did not vote');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: '3',
          OtherUser: '5',
        },
      },
    });
    expect(revealVotes).toHaveBeenCalled();
  });
});
