import { fireEvent } from '@testing-library/preact';
import { SCALES } from '../../shared/scales';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { RevealButton } from './RevealButton';

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

  it('shows a different reveal button if votes are missing', () => {
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

    fireEvent.click(getByText('Reveal Now'));
    expect(revealVotes).toHaveBeenCalled();
  });

  it('auto-updates the view and auto-reveals once missing votes have been added', () => {
    const revealVotes = jest.fn();
    const { getByText, rerender } = render({
      revealVotes,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: 'not-voted',
          ThirdUser: 'not-voted',
        },
      },
    });
    expect(getByText('Reveal Now')).toHaveTextContent('3 missing votes');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: '3',
          ThirdUser: 'not-voted',
        },
      },
    });
    expect(getByText('Reveal Now')).toHaveTextContent('2 missing votes');

    rerender({
      revealVotes,
      state: {
        votes: {
          TheUser: '2',
          OtherUser: '3',
          ThirdUser: 'not-voted',
        },
      },
    });
    expect(getByText('Reveal Now')).toHaveTextContent('1 missing votes');

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
    getByText('Reveal Votes');
  });
});
